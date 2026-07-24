package services

import (
	"context"

	"github.com/eip/backend/internal/models"
	"github.com/eip/backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TrainerService struct {
	trainerRepo *repositories.UserRepository
}

func NewTrainerService(trainerRepo *repositories.UserRepository) *TrainerService {
	return &TrainerService{trainerRepo: trainerRepo}
}

func (s *TrainerService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.User, int64, error) {
	filter["role"] = models.RoleTrainer
	return s.trainerRepo.FindAll(ctx, filter, page, limit)
}

func (s *TrainerService) GetByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	return s.trainerRepo.FindByID(ctx, id)
}

func (s *TrainerService) Create(ctx context.Context, trainer *models.User) error {
	trainer.Role = models.RoleTrainer
	return s.trainerRepo.Create(ctx, trainer)
}

func (s *TrainerService) Update(ctx context.Context, id primitive.ObjectID, update bson.M) error {
	return s.trainerRepo.Update(ctx, id, update)
}

func (s *TrainerService) Delete(ctx context.Context, id primitive.ObjectID) error {
	return s.trainerRepo.Delete(ctx, id)
}
