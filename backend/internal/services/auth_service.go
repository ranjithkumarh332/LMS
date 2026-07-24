package services

import (
	"context"
	"errors"
	"time"

	"github.com/eip/backend/internal/config"
	"github.com/eip/backend/internal/models"
	"github.com/eip/backend/internal/repositories"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  *repositories.UserRepository
	jwtSecret string
	jwtExpiry time.Duration
	refreshExpiry time.Duration
}

func NewAuthService(userRepo *repositories.UserRepository, cfg *config.Config) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: cfg.JWTSecret,
		jwtExpiry: cfg.JWTExpiry,
		refreshExpiry: cfg.RefreshExpiry,
	}
}

func (s *AuthService) Register(ctx context.Context, req *models.RegisterRequest) (*models.AuthResponse, error) {
	// Check if user exists
	existingUser, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &models.User{
		Email:    req.Email,
		Password: string(hashedPassword),
		Name:     req.Name,
		Role:     req.Role,
		Mobile:   req.Mobile,
		IDValue:  req.IDValue,
		Status:   "active",
		IsVerified: false,
	}

	err = s.userRepo.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	// Generate tokens
	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateRefreshToken(user)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	}, nil
}

func (s *AuthService) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthResponse, error) {
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Update last login
	s.userRepo.UpdateLastLogin(ctx, user.ID)

	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateRefreshToken(user)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	}, nil
}

func (s *AuthService) GetProfile(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	return s.userRepo.FindByID(ctx, userID)
}

func (s *AuthService) ForgotPassword(ctx context.Context, email string) error {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	// In production, send email with reset link
	// For now, we just return success
	return nil
}

func (s *AuthService) ResetPassword(ctx context.Context, token, password string) error {
	// Validate token and get user email
	// For simplicity, we'll just validate the token format
	if len(token) < 10 {
		return errors.New("invalid token")
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// In production, decode the token to get user ID
	// For now, just return success
	_ = hashedPassword
	return nil
}

func (s *AuthService) ChangePassword(ctx context.Context, userID primitive.ObjectID, currentPassword, newPassword string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword))
	if err != nil {
		return errors.New("current password is incorrect")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.userRepo.UpdatePassword(ctx, userID, string(hashedPassword))
}

func (s *AuthService) RefreshToken(ctx context.Context, refreshToken string) (string, error) {
	claims, err := s.ValidateToken(refreshToken)
	if err != nil {
		return "", errors.New("invalid refresh token")
	}

	userID, err := primitive.ObjectIDFromHex(claims["sub"].(string))
	if err != nil {
		return "", errors.New("invalid token claims")
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil || user == nil {
		return "", errors.New("user not found")
	}

	return s.generateToken(user)
}

func (s *AuthService) Logout(ctx context.Context, userID primitive.ObjectID) error {
	// In production, invalidate the refresh token in database
	return nil
}

func (s *AuthService) generateToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":   user.ID.Hex(),
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(s.jwtExpiry).Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) generateRefreshToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"sub": user.ID.Hex(),
		"exp": time.Now().Add(s.refreshExpiry).Unix(),
		"iat": time.Now().Unix(),
		"type": "refresh",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) ValidateToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.jwtSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

type PaginationQuery struct {
	Page   int `form:"page,default=1"`
	Limit  int `form:"limit,default=10"`
}

func (s *AuthService) GetAllUsers(ctx context.Context, query PaginationQuery, role, status string) ([]*models.User, int64, error) {
	filter := bson.M{}
	if role != "" {
		filter["role"] = role
	}
	if status != "" {
		filter["status"] = status
	}

	return s.userRepo.FindAll(ctx, filter, query.Page, query.Limit)
}

func (s *AuthService) UpdateUser(ctx context.Context, userID primitive.ObjectID, update bson.M) error {
	return s.userRepo.Update(ctx, userID, update)
}

func (s *AuthService) DeleteUser(ctx context.Context, userID primitive.ObjectID) error {
	return s.userRepo.Delete(ctx, userID)
}

func (s *AuthService) UpdateUserStatus(ctx context.Context, userID primitive.ObjectID, status string) error {
	return s.userRepo.UpdateStatus(ctx, userID, status)
}
