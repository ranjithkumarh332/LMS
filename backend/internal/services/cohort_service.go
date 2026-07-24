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

type CohortService struct{}

func NewCohortService() *CohortService {
	return &CohortService{}
}

func (s *CohortService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.Cohort, int64, error) {
	col := database.GetCollection(database.CollectionCohorts)
	opts := (&mongo.FindOptions{}).SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)).SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	
	var cohorts []*models.Cohort
	if err = cursor.All(ctx, &cohorts); err != nil {
		return nil, 0, err
	}
	
	total, _ := col.CountDocuments(ctx, filter)
	return cohorts, total, nil
}

func (s *CohortService) GetByID(ctx context.Context, id primitive.ObjectID) (*models.Cohort, error) {
	col := database.GetCollection(database.CollectionCohorts)
	var cohort models.Cohort
	err := col.FindOne(ctx, bson.M{"_id": id}).Decode(&cohort)
	if err != nil {
		return nil, err
	}
	return &cohort, nil
}

func (s *CohortService) Create(ctx context.Context, cohort *models.Cohort) error {
	col := database.GetCollection(database.CollectionCohorts)
	cohort.CreatedAt = time.Now()
	cohort.UpdatedAt = time.Now()
	cohort.Status = "active"
	_, err := col.InsertOne(ctx, cohort)
	return err
}

func (s *CohortService) Update(ctx context.Context, id primitive.ObjectID, update bson.M) error {
	col := database.GetCollection(database.CollectionCohorts)
	update["updated_at"] = time.Now()
	_, err := col.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	return err
}

func (s *CohortService) Delete(ctx context.Context, id primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionCohorts)
	_, err := col.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
