package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/eip/backend/internal/api/routes"
	"github.com/eip/backend/internal/config"
	"github.com/eip/backend/internal/database"
	"github.com/eip/backend/internal/repositories"
	"github.com/eip/backend/internal/services"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to MongoDB
	err := database.Connect(cfg.MongoURI, cfg.MongoDatabase)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer database.Disconnect()

	// Create database indexes
	err = database.CreateIndexes()
	if err != nil {
		log.Printf("Warning: Failed to create indexes: %v", err)
	}

	// Initialize repositories
	userRepo := repositories.NewUserRepository()

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg)
	studentService := services.NewStudentService(userRepo)
	trainerService := services.NewTrainerService(userRepo)
	collegeService := services.NewCollegeService()
	assessmentService := services.NewAssessmentService()
	quizService := services.NewQuizService()
	cohortService := services.NewCohortService()
	workshopService := services.NewWorkshopService()
	notificationService := services.NewNotificationService()
	auditService := services.NewAuditService()

	// Setup router
	routerConfig := &routes.RouterConfig{
		AuthService:        authService,
		StudentService:     studentService,
		TrainerService:    trainerService,
		CollegeService:    collegeService,
		AssessmentService: assessmentService,
		QuizService:       quizService,
		CohortService:     cohortService,
		WorkshopService:   workshopService,
		NotificationService: notificationService,
		AuditService:      auditService,
		CORSAllowed:       cfg.CORSAllowed,
	}

	router := routes.SetupRouter(routerConfig)

	// Create server
	server := &http.Server{
		Addr:    ":" + cfg.ServerPort,
		Handler: router,
	}

	// Start server in goroutine
	go func() {
		log.Printf("Server starting on port %s", cfg.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}
