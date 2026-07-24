package services

import (
	"context"

	"github.com/eip/backend/internal/models"
	"github.com/eip/backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type StudentService struct {
	studentRepo *repositories.UserRepository
}

func NewStudentService(studentRepo *repositories.UserRepository) *StudentService {
	return &StudentService{studentRepo: studentRepo}
}

func (s *StudentService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.User, int64, error) {
	filter["role"] = models.RoleStudent
	return s.studentRepo.FindAll(ctx, filter, page, limit)
}

func (s *StudentService) GetByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	return s.studentRepo.FindByID(ctx, id)
}

func (s *StudentService) Create(ctx context.Context, student *models.User) error {
	student.Role = models.RoleStudent
	return s.studentRepo.Create(ctx, student)
}

func (s *StudentService) Update(ctx context.Context, id primitive.ObjectID, update bson.M) error {
	return s.studentRepo.Update(ctx, id, update)
}

func (s *StudentService) Delete(ctx context.Context, id primitive.ObjectID) error {
	return s.studentRepo.Delete(ctx, id)
}

func (s *StudentService) UpdateResume(ctx context.Context, id primitive.ObjectID, resumeURL string) error {
	return s.studentRepo.Update(ctx, id, bson.M{"resume_url": resumeURL})
}

func (s *StudentService) DeleteResume(ctx context.Context, id primitive.ObjectID) error {
	return s.studentRepo.Update(ctx, id, bson.M{"resume_url": ""})
}
