package services

import (
	"context"
	"time"

	"github.com/eip/backend/internal/database"
	"github.com/eip/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type WorkshopService struct{}

func NewWorkshopService() *WorkshopService {
	return &WorkshopService{}
}

func (s *WorkshopService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.Workshop, int64, error) {
	col := database.GetCollection(database.CollectionWorkshops)
	opts := options.Find().SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)).SetSort(bson.D{{Key: "scheduled_at", Value: 1}})
	cursor, err := col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	
	var workshops []*models.Workshop
	if err = cursor.All(ctx, &workshops); err != nil {
		return nil, 0, err
	}
	
	total, _ := col.CountDocuments(ctx, filter)
	return workshops, total, nil
}

func (s *WorkshopService) GetByID(ctx context.Context, id primitive.ObjectID) (*models.Workshop, error) {
	col := database.GetCollection(database.CollectionWorkshops)
	var workshop models.Workshop
	err := col.FindOne(ctx, bson.M{"_id": id}).Decode(&workshop)
	if err != nil {
		return nil, err
	}
	return &workshop, nil
}

func (s *WorkshopService) Create(ctx context.Context, workshop *models.Workshop) error {
	col := database.GetCollection(database.CollectionWorkshops)
	workshop.CreatedAt = time.Now()
	workshop.UpdatedAt = time.Now()
	workshop.Status = "scheduled"
	workshop.EnrolledCount = 0
	_, err := col.InsertOne(ctx, workshop)
	return err
}

func (s *WorkshopService) Update(ctx context.Context, id primitive.ObjectID, update bson.M) error {
	col := database.GetCollection(database.CollectionWorkshops)
	update["updated_at"] = time.Now()
	_, err := col.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	return err
}

func (s *WorkshopService) Delete(ctx context.Context, id primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionWorkshops)
	_, err := col.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (s *WorkshopService) Enroll(ctx context.Context, workshopID, studentID primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionEnrollments)
	enrollment := models.WorkshopEnrollment{
		WorkshopID: workshopID,
		StudentID:  studentID,
		Status:     "registered",
		EnrolledAt: time.Now(),
	}
	_, err := col.InsertOne(ctx, enrollment)
	if err != nil {
		return err
	}
	
	workshopCol := database.GetCollection(database.CollectionWorkshops)
	_, err = workshopCol.UpdateOne(ctx, bson.M{"_id": workshopID}, bson.M{"$inc": bson.M{"enrolled_count": 1}})
	return err
}

func (s *WorkshopService) Unenroll(ctx context.Context, workshopID, studentID primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionEnrollments)
	_, err := col.DeleteOne(ctx, bson.M{"workshop_id": workshopID, "student_id": studentID})
	if err != nil {
		return err
	}
	
	workshopCol := database.GetCollection(database.CollectionWorkshops)
	_, err = workshopCol.UpdateOne(ctx, bson.M{"_id": workshopID}, bson.M{"$inc": bson.M{"enrolled_count": -1}})
	return err
}
