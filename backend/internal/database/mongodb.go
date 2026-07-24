package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDB struct {
	Client   *mongo.Client
	Database *mongo.Database
}

var DB *MongoDB

func Connect(uri, dbName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		return err
	}

	DB = &MongoDB{
		Client:   client,
		Database: client.Database(dbName),
	}

	log.Println("Connected to MongoDB")
	return nil
}

func Disconnect() error {
	if DB != nil && DB.Client != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return DB.Client.Disconnect(ctx)
	}
	return nil
}

func GetCollection(name string) *mongo.Collection {
	if DB != nil {
		return DB.Database.Collection(name)
	}
	return nil
}

func CreateIndexes() error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Users collection indexes
	usersCol := GetCollection("users")
	userIndexes := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: bson.D{{Key: "role", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "college_id", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "status", Value: 1}},
		},
	}
	_, err := usersCol.Indexes().CreateMany(ctx, userIndexes)
	if err != nil {
		return err
	}

	// Colleges collection indexes
	collegesCol := GetCollection("colleges")
	collegeIndexes := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "code", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: bson.D{{Key: "status", Value: 1}},
		},
	}
	_, err = collegesCol.Indexes().CreateMany(ctx, collegeIndexes)
	if err != nil {
		return err
	}

	// Question banks indexes
	questionBanksCol := GetCollection("question_banks")
	qbIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{Key: "college_id", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "status", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "category", Value: 1}},
		},
	}
	_, err = questionBanksCol.Indexes().CreateMany(ctx, qbIndexes)
	if err != nil {
		return err
	}

	// Quiz attempts indexes
	quizAttemptsCol := GetCollection("quiz_attempts")
	qaIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{Key: "student_id", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "assessment_id", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "status", Value: 1}},
		},
	}
	_, err = quizAttemptsCol.Indexes().CreateMany(ctx, qaIndexes)
	if err != nil {
		return err
	}

	// Audit logs indexes
	auditLogsCol := GetCollection("audit_logs")
	alIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{Key: "user_id", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "action", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "created_at", Value: -1}},
		},
	}
	_, err = auditLogsCol.Indexes().CreateMany(ctx, alIndexes)

	log.Println("Database indexes created successfully")
	return err
}

const (
	CollectionUsers         = "users"
	CollectionStudents     = "students"
	CollectionTrainers     = "trainers"
	CollectionCollegeAdmins = "college_admins"
	CollectionColleges     = "colleges"
	CollectionDepartments  = "departments"
	CollectionCohorts      = "cohorts"
	CollectionWorkshops    = "workshops"
	CollectionEnrollments  = "workshop_enrollments"
	CollectionQuestionBanks = "question_banks"
	CollectionQuestions     = "questions"
	CollectionAssessments   = "assessments"
	CollectionQuizAttempts  = "quiz_attempts"
	CollectionNotifications = "notifications"
	CollectionAuditLogs     = "audit_logs"
	CollectionResumes       = "resumes"
	CollectionInterventions = "interventions"
	CollectionRefreshTokens = "refresh_tokens"
)
