package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Cohort struct {
	ID           primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	Name         string             `bson:"name" json:"name" binding:"required"`
	Description  string             `bson:"description" json:"description"`
	CollegeID    primitive.ObjectID  `bson:"college_id" json:"college_id"`
	DepartmentID primitive.ObjectID  `bson:"department_id" json:"department_id"`
	TrainerIDs   []primitive.ObjectID `bson:"trainer_ids" json:"trainer_ids"`
	StudentIDs   []primitive.ObjectID `bson:"student_ids" json:"student_ids"`
	Year         int                `bson:"year" json:"year"`
	Semester     int                `bson:"semester" json:"semester"`
	Status       string             `bson:"status" json:"status"` // active, completed, archived
	Stats        CohortStats        `bson:"stats" json:"stats"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}

type CohortStats struct {
	TotalStudents     int     `bson:"total_students" json:"total_students"`
	AvgReadiness     float64 `bson:"avg_readiness" json:"avg_readiness"`
	PlacementRate    float64 `bson:"placement_rate" json:"placement_rate"`
	WorkshopAttendance float64 `bson:"workshop_attendance" json:"workshop_attendance"`
}

type Workshop struct {
	ID           primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	Title        string             `bson:"title" json:"title" binding:"required"`
	Description  string             `bson:"description" json:"description"`
	CollegeID    primitive.ObjectID  `bson:"college_id" json:"college_id"`
	TrainerID    primitive.ObjectID  `bson:"trainer_id" json:"trainer_id"`
	CohortIDs    []primitive.ObjectID `bson:"cohort_ids" json:"cohort_ids"`
	ScheduledAt  time.Time          `bson:"scheduled_at" json:"scheduled_at"`
	Duration     int                `bson:"duration" json:"duration"` // minutes
	Location     string             `bson:"location" json:"location"`
	MaxSeats     int                `bson:"max_seats" json:"max_seats"`
	EnrolledCount int               `bson:"enrolled_count" json:"enrolled_count"`
	Status       string             `bson:"status" json:"status"` // scheduled, in_progress, completed, cancelled
	Type         string             `bson:"type" json:"type"` // seminar, training, practice
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}

type WorkshopEnrollment struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	WorkshopID primitive.ObjectID `bson:"workshop_id" json:"workshop_id"`
	StudentID  primitive.ObjectID `bson:"student_id" json:"student_id"`
	Status     string             `bson:"status" json:"status"` // registered, attended, absent
	EnrolledAt time.Time          `bson:"enrolled_at" json:"enrolled_at"`
}
