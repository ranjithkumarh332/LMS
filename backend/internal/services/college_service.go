package services

import (
	"context"

	"github.com/eip/backend/internal/database"
	"github.com/eip/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CollegeService struct{}

func NewCollegeService() *CollegeService {
	return &CollegeService{}
}

func (s *CollegeService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.College, int64, error) {
	col := database.GetCollection(database.CollectionColleges)
	opts := (& mongo.Options.FindOptions{}).SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)).SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	
	var colleges []*models.College
	if err = cursor.All(ctx, &colleges); err != nil {
		return nil, 0, err
	}
	
	total, _ := col.CountDocuments(ctx, filter)
	return colleges, total, nil
}

func (s *CollegeService) GetByID(ctx context.Context, id primitive.ObjectID) (*models.College, error) {
	col := database.GetCollection(database.CollectionColleges)
	var college models.College
	err := col.FindOne(ctx, bson.M{"_id": id}).Decode(&college)
	if err != nil {
		return nil, err
	}
	return &college, nil
}

func (s *CollegeService) Create(ctx context.Context, college *models.College) error {
	col := database.GetCollection(database.CollectionColleges)
	_, err := col.InsertOne(ctx, college)
	return err
}

func (s *CollegeService) Update(ctx context.Context, id primitive.ObjectID, update bson.M) error {
	col := database.GetCollection(database.CollectionColleges)
	_, err := col.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	return err
}

func (s *CollegeService) Delete(ctx context.Context, id primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionColleges)
	_, err := col.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (s *CollegeService) Activate(ctx context.Context, id primitive.ObjectID) error {
	return s.Update(ctx, id, bson.M{"status": "active"})
}

func (s *CollegeService) Deactivate(ctx context.Context, id primitive.ObjectID) error {
	return s.Update(ctx, id, bson.M{"status": "inactive"})
}
