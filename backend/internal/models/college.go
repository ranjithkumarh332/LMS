package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type College struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name" binding:"required"`
	Code        string             `bson:"code" json:"code" binding:"required"`
	TNEACode    string             `bson:"tnea_code" json:"tnea_code"`
	Location    string             `bson:"location" json:"location"`
	Address     string             `bson:"address" json:"address"`
	ContactEmail string            `bson:"contact_email" json:"contact_email"`
	ContactPhone string           `bson:"contact_phone" json:"contact_phone"`
	Website     string             `bson:"website" json:"website"`
	Logo        string             `bson:"logo" json:"logo"`
	Status      string             `bson:"status" json:"status"` // active, inactive, suspended
	DepartmentIDs []primitive.ObjectID `bson:"department_ids" json:"department_ids"`
	Settings    CollegeSettings    `bson:"settings" json:"settings"`
	Stats       CollegeStats      `bson:"stats" json:"stats"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}

type CollegeSettings struct {
	AllowSelfRegistration bool `bson:"allow_self_registration" json:"allow_self_registration"`
	RequireApproval       bool `bson:"require_approval" json:"require_approval"`
	PlacementThreshold    float64 `bson:"placement_threshold" json:"placement_threshold"`
}

type CollegeStats struct {
	TotalStudents   int `bson:"total_students" json:"total_students"`
	ActiveStudents int `bson:"active_students" json:"active_students"`
	TotalTrainers  int `bson:"total_trainers" json:"total_trainers"`
	PlacementRate  float64 `bson:"placement_rate" json:"placement_rate"`
}

type Department struct {
	ID        primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name" binding:"required"`
	Code      string             `bson:"code" json:"code" binding:"required"`
	CollegeID primitive.ObjectID `bson:"college_id,omitempty" json:"college_id,omitempty"`
	Status    string             `bson:"status" json:"status"` // active, inactive
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}
