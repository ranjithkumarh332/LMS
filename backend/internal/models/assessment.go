package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	BankID        primitive.ObjectID `bson:"bank_id" json:"bank_id"`
	Text          string            `bson:"text" json:"text" binding:"required"`
	Type          string            `bson:"type" json:"type"` // multiple_choice, true_false, short_answer
	Options       []string         `bson:"options" json:"options"`
	CorrectAnswer string            `bson:"correct_answer" json:"correct_answer"`
	Explanation   string            `bson:"explanation" json:"explanation"`
	Difficulty    string            `bson:"difficulty" json:"difficulty"` // easy, medium, hard
	Marks         int               `bson:"marks" json:"marks"`
	Category      string            `bson:"category" json:"category"`
	CreatedAt     time.Time         `bson:"created_at" json:"created_at"`
	UpdatedAt     time.Time         `bson:"updated_at" json:"updated_at"`
}

type QuestionBank struct {
	ID          primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Name        string              `bson:"name" json:"name" binding:"required"`
	Description string              `bson:"description" json:"description"`
	Category    string              `bson:"category" json:"category"`
	CollegeID   primitive.ObjectID  `bson:"college_id,omitempty" json:"college_id,omitempty"`
	CreatedBy  primitive.ObjectID  `bson:"created_by" json:"created_by"`
	QuestionIDs []primitive.ObjectID `bson:"question_ids" json:"question_ids"`
	Tags        []string            `bson:"tags" json:"tags"`
	Status      string              `bson:"status" json:"status"` // draft, published, archived
	CreatedAt   time.Time           `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time           `bson:"updated_at" json:"updated_at"`
}

type AssessmentTemplate struct {
	ID          primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Name        string              `bson:"name" json:"name" binding:"required"`
	Description string              `bson:"description" json:"description"`
	CollegeID   primitive.ObjectID  `bson:"college_id,omitempty" json:"college_id,omitempty"`
	CreatedBy  primitive.ObjectID  `bson:"created_by" json:"created_by"`
	Duration    int                `bson:"duration" json:"duration"` // minutes
	PassingScore float64          `bson:"passing_score" json:"passing_score"`
	Questions   []AssessmentQuestion `bson:"questions" json:"questions"`
	Rules       []AssessmentRule    `bson:"rules" json:"rules"`
	Status      string              `bson:"status" json:"status"` // draft, published, archived
	IsPublic    bool               `bson:"is_public" json:"is_public"`
	UsageCount  int               `bson:"usage_count" json:"usage_count"`
	CreatedAt   time.Time           `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time           `bson:"updated_at" json:"updated_at"`
}

type AssessmentQuestion struct {
	QuestionID primitive.ObjectID `bson:"question_id" json:"question_id"`
	Marks      int               `bson:"marks" json:"marks"`
	Order      int               `bson:"order" json:"order"`
}

type AssessmentRule struct {
	Type  string `bson:"type" json:"type"` // proctoring, time_limit, etc.
	Key   string `bson:"key" json:"key"`
	Value string `bson:"value" json:"value"`
}

type QuizAttempt struct {
	ID           primitive.ObjectID    `bson:"_id,omitempty" json:"id"`
	StudentID    primitive.ObjectID   `bson:"student_id" json:"student_id"`
	AssessmentID primitive.ObjectID   `bson:"assessment_id" json:"assessment_id"`
	Answers      []QuizAnswer         `bson:"answers" json:"answers"`
	Score        float64             `bson:"score" json:"score"`
	MaxScore     float64             `bson:"max_score" json:"max_score"`
	Percentage   float64             `bson:"percentage" json:"percentage"`
	Status       string              `bson:"status" json:"status"` // in_progress, submitted, graded
	StartedAt    time.Time           `bson:"started_at" json:"started_at"`
	SubmittedAt  *time.Time          `bson:"submitted_at,omitempty" json:"submitted_at,omitempty"`
	Duration     int                 `bson:"duration" json:"duration"` // seconds taken
	Violations   []string            `bson:"violations" json:"violations"`
	CreatedAt    time.Time           `bson:"created_at" json:"created_at"`
}

type QuizAnswer struct {
	QuestionID primitive.ObjectID `bson:"question_id" json:"question_id"`
	Answer    string            `bson:"answer" json:"answer"`
	IsCorrect bool              `bson:"is_correct" json:"is_correct"`
	Marks     float64           `bson:"marks" json:"marks"`
}
