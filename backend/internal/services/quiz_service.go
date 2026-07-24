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

type QuizService struct{}

func NewQuizService() *QuizService {
	return &QuizService{}
}

func (s *QuizService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.AssessmentTemplate, int64, error) {
	col := database.GetCollection(database.CollectionAssessments)
	opts := (&mongo.FindOptions{}).SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)).SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	
	var templates []*models.AssessmentTemplate
	if err = cursor.All(ctx, &templates); err != nil {
		return nil, 0, err
	}
	
	total, _ := col.CountDocuments(ctx, filter)
	return templates, total, nil
}

func (s *QuizService) GetByID(ctx context.Context, id primitive.ObjectID) (*models.AssessmentTemplate, error) {
	col := database.GetCollection(database.CollectionAssessments)
	var template models.AssessmentTemplate
	err := col.FindOne(ctx, bson.M{"_id": id}).Decode(&template)
	if err != nil {
		return nil, err
	}
	return &template, nil
}

func (s *QuizService) Create(ctx context.Context, template *models.AssessmentTemplate) error {
	col := database.GetCollection(database.CollectionAssessments)
	template.CreatedAt = time.Now()
	template.UpdatedAt = time.Now()
	template.Status = "draft"
	_, err := col.InsertOne(ctx, template)
	return err
}

func (s *QuizService) StartQuiz(ctx context.Context, studentID, assessmentID primitive.ObjectID) (*models.QuizAttempt, error) {
	col := database.GetCollection(database.CollectionQuizAttempts)
	attempt := &models.QuizAttempt{
		StudentID:    studentID,
		AssessmentID: assessmentID,
		Status:       "in_progress",
		StartedAt:    time.Now(),
		CreatedAt:    time.Now(),
	}
	_, err := col.InsertOne(ctx, attempt)
	return attempt, err
}

func (s *QuizService) SubmitQuiz(ctx context.Context, attemptID primitive.ObjectID, answers []models.QuizAnswer) error {
	col := database.GetCollection(database.CollectionQuizAttempts)
	now := time.Now()
	update := bson.M{
		"$set": bson.M{
			"answers":      answers,
			"status":       "submitted",
			"submitted_at": now,
		},
	}
	_, err := col.UpdateOne(ctx, bson.M{"_id": attemptID}, update)
	return err
}

func (s *QuizService) GetResults(ctx context.Context, attemptID primitive.ObjectID) (*models.QuizAttempt, error) {
	col := database.GetCollection(database.CollectionQuizAttempts)
	var attempt models.QuizAttempt
	err := col.FindOne(ctx, bson.M{"_id": attemptID}).Decode(&attempt)
	if err != nil {
		return nil, err
	}
	return &attempt, nil
}
