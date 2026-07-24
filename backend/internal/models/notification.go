package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Notification struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Type      string            `bson:"type" json:"type"` // assess, cohort, workshop, report, upload
	Icon      string            `bson:"icon" json:"icon"`
	Title     string            `bson:"title" json:"title" binding:"required"`
	Desc      string            `bson:"desc" json:"desc"`
	Link      string            `bson:"link" json:"link"`
	IsRead    bool              `bson:"is_read" json:"is_read"`
	CreatedAt time.Time         `bson:"created_at" json:"created_at"`
}

type AuditLog struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	UserEmail string            `bson:"user_email" json:"user_email"`
	Action    string            `bson:"action" json:"action" binding:"required"`
	Entity    string            `bson:"entity" json:"entity"` // student, trainer, college, etc.
	EntityID  string            `bson:"entity_id" json:"entity_id"`
	IP        string            `bson:"ip" json:"ip"`
	UserAgent string            `bson:"user_agent" json:"user_agent"`
	Details   map[string]any    `bson:"details" json:"details"`
	CreatedAt time.Time         `bson:"created_at" json:"created_at"`
}

type Resume struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudentID primitive.ObjectID `bson:"student_id" json:"student_id"`
	FileName  string            `bson:"file_name" json:"file_name"`
	FileURL   string            `bson:"file_url" json:"file_url"`
	FileSize  int64             `bson:"file_size" json:"file_size"`
	MimeType  string            `bson:"mime_type" json:"mime_type"`
	IsActive  bool              `bson:"is_active" json:"is_active"`
	UploadedAt time.Time        `bson:"uploaded_at" json:"uploaded_at"`
}

type Intervention struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	StudentID   primitive.ObjectID   `bson:"student_id" json:"student_id"`
	Type        string              `bson:"type" json:"type"` // workshop, mentoring, training
	Title       string              `bson:"title" json:"title"`
	Description string              `bson:"description" json:"description"`
	TriggeredBy string             `bson:"triggered_by" json:"triggered_by"` // low_score, attendance, manual
	Status      string              `bson:"status" json:"status"` // recommended, enrolled, completed, skipped
	CreatedAt   time.Time           `bson:"created_at" json:"created_at"`
	CompletedAt *time.Time          `bson:"completed_at,omitempty" json:"completed_at,omitempty"`
}
