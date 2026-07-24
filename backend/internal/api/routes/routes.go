package routes

import (
	"github.com/eip/backend/internal/api/handlers"
	"github.com/eip/backend/internal/api/middleware"
	"github.com/eip/backend/internal/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *RouterConfig) *gin.Engine {
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     append([]string{"http://localhost:3000", "http://localhost:5173", "https://*.vercel.app"}, cfg.CORSAllowed...),
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api")
	{
		// Auth routes (public)
		authHandler := handlers.NewAuthHandler(cfg.AuthService)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/forgot-password", authHandler.ForgotPassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
			auth.POST("/refresh-token", authHandler.RefreshToken)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware(cfg.AuthService))
		{
			// Profile routes
			protected.GET("/auth/profile", authHandler.GetProfile)
			protected.PUT("/auth/profile", authHandler.UpdateProfile)
			protected.POST("/auth/change-password", authHandler.ChangePassword)
			protected.POST("/auth/logout", authHandler.Logout)

			// User management (admin only)
			users := protected.Group("/users")
			{
				users.GET("", middleware.RoleMiddleware("superadmin", "college_admin"), authHandler.GetAllUsers)
				users.PUT("/:id/status", middleware.RoleMiddleware("superadmin", "college_admin"), func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "User status updated"})
				})
				users.DELETE("/:id", middleware.RoleMiddleware("superadmin"), func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "User deleted"})
				})
			}

			// Students routes
			studentHandler := handlers.NewStudentHandler(cfg.StudentService)
			students := protected.Group("/students")
			{
				students.GET("", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), studentHandler.GetAll)
				students.GET("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer", "student"), studentHandler.GetByID)
				students.POST("", middleware.RoleMiddleware("superadmin", "college_admin"), studentHandler.Create)
				students.PUT("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "student"), studentHandler.Update)
				students.DELETE("/:id", middleware.RoleMiddleware("superadmin", "college_admin"), studentHandler.Delete)
				students.POST("/:id/resume", middleware.RoleMiddleware("student"), studentHandler.UploadResume)
				students.DELETE("/:id/resume", middleware.RoleMiddleware("student"), studentHandler.DeleteResume)
			}

			// Trainers routes
			trainerHandler := handlers.NewTrainerHandler(cfg.TrainerService)
			trainers := protected.Group("/trainers")
			{
				trainers.GET("", middleware.RoleMiddleware("superadmin", "college_admin"), trainerHandler.GetAll)
				trainers.GET("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), trainerHandler.GetByID)
				trainers.POST("", middleware.RoleMiddleware("superadmin", "college_admin"), trainerHandler.Create)
				trainers.PUT("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), trainerHandler.Update)
				trainers.DELETE("/:id", middleware.RoleMiddleware("superadmin"), trainerHandler.Delete)
			}

			// Colleges routes
			collegeHandler := handlers.NewCollegeHandler(cfg.CollegeService)
			colleges := protected.Group("/colleges")
			{
				colleges.GET("", middleware.RoleMiddleware("superadmin"), collegeHandler.GetAll)
				colleges.GET("/:id", middleware.RoleMiddleware("superadmin", "college_admin"), collegeHandler.GetByID)
				colleges.POST("", middleware.RoleMiddleware("superadmin"), collegeHandler.Create)
				colleges.PUT("/:id", middleware.RoleMiddleware("superadmin"), collegeHandler.Update)
				colleges.DELETE("/:id", middleware.RoleMiddleware("superadmin"), collegeHandler.Delete)
				colleges.POST("/:id/activate", middleware.RoleMiddleware("superadmin"), collegeHandler.Activate)
				colleges.POST("/:id/deactivate", middleware.RoleMiddleware("superadmin"), collegeHandler.Deactivate)
			}

			// Assessments routes
			assessmentHandler := handlers.NewAssessmentHandler(cfg.AssessmentService)
			assessments := protected.Group("/assessments")
			{
				assessments.GET("", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), assessmentHandler.GetAll)
				assessments.GET("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer", "student"), assessmentHandler.GetByID)
				assessments.POST("", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), assessmentHandler.Create)
				assessments.PUT("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), assessmentHandler.Update)
				assessments.DELETE("/:id", middleware.RoleMiddleware("superadmin", "college_admin"), assessmentHandler.Delete)
				assessments.POST("/:id/publish", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), assessmentHandler.Publish)
				assessments.POST("/:id/archive", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), assessmentHandler.Archive)
			}

			// Quizzes routes
			quizHandler := handlers.NewQuizHandler(cfg.QuizService)
			quizzes := protected.Group("/quizzes")
			{
				quizzes.GET("", middleware.RoleMiddleware("superadmin", "college_admin", "trainer", "student"), quizHandler.GetAll)
				quizzes.GET("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer", "student"), quizHandler.GetByID)
				quizzes.POST("", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), quizHandler.Create)
				quizzes.POST("/:id/start", middleware.RoleMiddleware("student"), quizHandler.StartQuiz)
				quizzes.POST("/:id/submit", middleware.RoleMiddleware("student"), quizHandler.SubmitQuiz)
				quizzes.GET("/:id/results/:attemptId", middleware.RoleMiddleware("student", "trainer", "college_admin", "superadmin"), quizHandler.GetResults)
			}

			// Cohorts routes
			cohortHandler := handlers.NewCohortHandler(cfg.CohortService)
			cohorts := protected.Group("/cohorts")
			{
				cohorts.GET("", middleware.RoleMiddleware("superadmin", "college_admin", "trainer", "student"), cohortHandler.GetAll)
				cohorts.GET("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer", "student"), cohortHandler.GetByID)
				cohorts.POST("", middleware.RoleMiddleware("superadmin", "college_admin"), cohortHandler.Create)
				cohorts.PUT("/:id", middleware.RoleMiddleware("superadmin", "college_admin"), cohortHandler.Update)
				cohorts.DELETE("/:id", middleware.RoleMiddleware("superadmin"), cohortHandler.Delete)
			}

			// Workshops routes
			workshopHandler := handlers.NewWorkshopHandler(cfg.WorkshopService)
			workshops := protected.Group("/workshops")
			{
				workshops.GET("", workshopHandler.GetAll)
				workshops.GET("/:id", workshopHandler.GetByID)
				workshops.POST("", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), workshopHandler.Create)
				workshops.PUT("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), workshopHandler.Update)
				workshops.DELETE("/:id", middleware.RoleMiddleware("superadmin", "college_admin", "trainer"), workshopHandler.Delete)
				workshops.POST("/:id/enroll", middleware.RoleMiddleware("student"), workshopHandler.Enroll)
				workshops.POST("/:id/unenroll", middleware.RoleMiddleware("student"), workshopHandler.Unenroll)
			}

			// Notifications routes
			notificationHandler := handlers.NewNotificationHandler(cfg.NotificationService)
			notifications := protected.Group("/notifications")
			{
				notifications.GET("", notificationHandler.GetAll)
				notifications.POST("/:id/read", notificationHandler.MarkAsRead)
				notifications.POST("/read-all", notificationHandler.MarkAllAsRead)
				notifications.DELETE("/:id", notificationHandler.Delete)
				notifications.GET("/unread-count", notificationHandler.GetUnreadCount)
			}

			// Audit logs routes
			auditHandler := handlers.NewAuditHandler(cfg.AuditService)
			auditLogs := protected.Group("/audit-logs")
			{
				auditLogs.GET("", middleware.RoleMiddleware("superadmin", "college_admin"), auditHandler.GetAll)
			}
		}
	}

	return r
}

type RouterConfig struct {
	AuthService       *services.AuthService
	StudentService    *services.StudentService
	TrainerService   *services.TrainerService
	CollegeService   *services.CollegeService
	AssessmentService *services.AssessmentService
	QuizService      *services.QuizService
	CohortService    *services.CohortService
	WorkshopService  *services.WorkshopService
	NotificationService *services.NotificationService
	AuditService     *services.AuditService
	CORSAllowed     []string
}
