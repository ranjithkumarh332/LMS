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

type AuditService struct{}

func NewAuditService() *AuditService {
	return &AuditService{}
}

func (s *AuditService) GetAll(ctx context.Context, filter bson.M, page, limit int) ([]*models.AuditLog, int64, error) {
	col := database.GetCollection(database.CollectionAuditLogs)
	opts := (&mongo.FindOptions{}).SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)).SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)
	
	var logs []*models.AuditLog
	if err = cursor.All(ctx, &logs); err != nil {
		return nil, 0, err
	}
	
	total, _ := col.CountDocuments(ctx, filter)
	return logs, total, nil
}

func (s *AuditService) Create(ctx context.Context, log *models.AuditLog) error {
	col := database.GetCollection(database.CollectionAuditLogs)
	log.CreatedAt = time.Now()
	_, err := col.InsertOne(ctx, log)
	return err
}

func (s *AuditService) Log(ctx context.Context, userID primitive.ObjectID, userEmail, action, entity, entityID, ip string, details map[string]interface{}) error {
	return s.Create(ctx, &models.AuditLog{
		UserID:    userID,
		UserEmail: userEmail,
		Action:    action,
		Entity:    entity,
		EntityID:  entityID,
		IP:        ip,
		Details:   details,
	})
}
