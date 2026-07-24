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

type NotificationService struct{}

func NewNotificationService() *NotificationService {
	return &NotificationService{}
}

func (s *NotificationService) GetAll(ctx context.Context, userID primitive.ObjectID, page, limit int) ([]*models.Notification, int64, error) {
	col := database.GetCollection(database.CollectionNotifications)
	filter := bson.M{"user_id": userID}
	opts := options.Find().SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)).SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	
	var notifications []*models.Notification
	if err = cursor.All(ctx, &notifications); err != nil {
		return nil, 0, err
	}
	
	total, _ := col.CountDocuments(ctx, filter)
	return notifications, total, nil
}

func (s *NotificationService) MarkAsRead(ctx context.Context, id, userID primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionNotifications)
	_, err := col.UpdateOne(ctx, bson.M{"_id": id, "user_id": userID}, bson.M{"$set": bson.M{"is_read": true}})
	return err
}

func (s *NotificationService) MarkAllAsRead(ctx context.Context, userID primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionNotifications)
	_, err := col.UpdateMany(ctx, bson.M{"user_id": userID}, bson.M{"$set": bson.M{"is_read": true}})
	return err
}

func (s *NotificationService) Delete(ctx context.Context, id, userID primitive.ObjectID) error {
	col := database.GetCollection(database.CollectionNotifications)
	_, err := col.DeleteOne(ctx, bson.M{"_id": id, "user_id": userID})
	return err
}

func (s *NotificationService) GetUnreadCount(ctx context.Context, userID primitive.ObjectID) (int64, error) {
	col := database.GetCollection(database.CollectionNotifications)
	return col.CountDocuments(ctx, bson.M{"user_id": userID, "is_read": false})
}

func (s *NotificationService) Create(ctx context.Context, notification *models.Notification) error {
	col := database.GetCollection(database.CollectionNotifications)
	notification.CreatedAt = time.Now()
	notification.IsRead = false
	_, err := col.InsertOne(ctx, notification)
	return err
}
