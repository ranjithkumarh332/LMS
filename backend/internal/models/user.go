package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Role string

const (
	RoleSuperAdmin   Role = "superadmin"
	RoleCollegeAdmin Role = "college_admin"
	RoleTrainer     Role = "trainer"
	RoleStudent     Role = "student"
)

type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email       string            `bson:"email" json:"email" binding:"required,email"`
	Password    string            `bson:"password" json:"-"`
	Name        string            `bson:"name" json:"name" binding:"required"`
	Role        Role              `bson:"role" json:"role" binding:"required"`
	Mobile      string            `bson:"mobile" json:"mobile"`
	IDValue     string            `bson:"id_value" json:"id_value"`
	CollegeID   primitive.ObjectID `bson:"college_id,omitempty" json:"college_id,omitempty"`
	Department  string            `bson:"department" json:"department"`
	Status      string            `bson:"status" json:"status"`
	IsVerified  bool              `bson:"is_verified" json:"is_verified"`
	Avatar      string            `bson:"avatar" json:"avatar"`
	Bio         string            `bson:"bio" json:"bio"`
	CreatedAt   time.Time         `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time         `bson:"updated_at" json:"updated_at"`
	LastLoginAt *time.Time        `bson:"last_login_at,omitempty" json:"last_login_at,omitempty"`
}

type Student struct {
	User
	RollNumber     string               `bson:"roll_number" json:"roll_number"`
	CohortIDs      []primitive.ObjectID `bson:"cohort_ids" json:"cohort_ids"`
	ResumeURL      string               `bson:"resume_url" json:"resume_url"`
	ReadinessScore float64              `bson:"readiness_score" json:"readiness_score"`
	Skills         map[string]float64  `bson:"skills" json:"skills"`
}

type Trainer struct {
	User
	EmployeeID     string               `bson:"employee_id" json:"employee_id"`
	Specialization []string             `bson:"specialization" json:"specialization"`
	StudentIDs     []primitive.ObjectID `bson:"student_ids" json:"student_ids"`
}

type CollegeAdmin struct {
	User
	TNEACode string `bson:"tnea_code" json:"tnea_code"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name" binding:"required"`
	Role     Role   `json:"role" binding:"required"`
	Mobile   string `json:"mobile"`
	IDValue  string `json:"id_value"`
}

type AuthResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
	User         *User  `json:"user"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
}
