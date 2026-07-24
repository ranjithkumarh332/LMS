package services

import (
	"context"
	"time"

	"github.com/eip/backend/internal/database"
	"github.com/eip/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AssessmentService struct{}

func NewAssessmentService() *AssessmentService {
	return &AssessmentService{}
}

func (s *AssessmentService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.QuestionBank, int64, error) {
	col := database.GetCollection(database.CollectionQuestionBanks)
	opts := (&mongo.FindOptions{}).SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)).SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	
	var banks []*models.QuestionBank
	if err = cursor.All(ctx, &banks); err != nil {
		return nil, 0, err
	}
	
	total, _ := col.CountDocuments(ctx, filter)
	return banks, total, nil
}

func (s *AssessmentService) GetByID(ctx context.Context, id primitive.ObjectID) (*models.QuestionBank, error) {
	col := database.GetCollection(database.CollectionQuestionBanks)
	var bank models.QuestionBank
	err := col.FindOne(ctx, bson.M{"_id": id}).Decode(&bank)
	if err != nil {
		return nil, err
	}
	return &bank, nil
}

func (s *AssessmentService) Create(ctx context.Context, bank *models.QuestionBank) error {
	col := database.GetCollection(database.CollectionQuestionBanks)
	bank.CreatedAt = time.Now()
	bank.UpdatedAt = time.Now()
	bank.Status = "draft"
	_, err := col.InsertOne(ctx, bank)
	return err
}

func (s *AssessmentService) Update(ctx context.Context, id primitive.ObjectID, update bson.M) error {
	col := database.GetCollection(database.CollectionQuestionBanks)
	update["updated_at"] = time.Now()
	_, err := col.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	return err
}

func (s *AssessmentService) Delete(ctx context.Context, id primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionQuestionBanks)
	_, err := col.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (s *AssessmentService) Publish(ctx context.Context, id primitive.ObjectID) error {
	return s.Update(ctx, id, bson.M{"status": "published"})
}

func (s *AssessmentService) Archive(ctx context.Context, id primitive.ObjectID) error {
	return s.Update(ctx, id, bson.M{"status": "archived"})
}
