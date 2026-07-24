package handlers

import (
	"net/http"
	"strconv"

	"github.com/eip/backend/internal/api/middleware"
	"github.com/eip/backend/internal/models"
	"github.com/eip/backend/internal/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuizHandler struct {
	quizService *services.QuizService
}

func NewQuizHandler(quizService *services.QuizService) *QuizHandler {
	return &QuizHandler{quizService: quizService}
}

func (h *QuizHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["name"] = bson.M{"$regex": search, "$options": "i"}
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}
	
	quizzes, total, err := h.quizService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"quizzes": quizzes,
		"total": total,
		"page": page,
		"limit": limit,
	})
}

func (h *QuizHandler) GetByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	quiz, err := h.quizService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if quiz == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Quiz not found"})
		return
	}
	
	c.JSON(http.StatusOK, quiz)
}

func (h *QuizHandler) Create(c *gin.Context) {
	var template struct {
		Name        string                  `json:"name" binding:"required"`
		Description string                  `json:"description"`
		Duration    int                    `json:"duration"`
		PassingScore float64               `json:"passing_score"`
		Questions   []models.AssessmentQuestion `json:"questions"`
		Rules       []models.AssessmentRule    `json:"rules"`
	}
	
	if err := c.ShouldBindJSON(&template); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	newTemplate := &models.AssessmentTemplate{
		Name:         template.Name,
		Description: template.Description,
		Duration:    template.Duration,
		PassingScore: template.PassingScore,
		Questions:   template.Questions,
		Rules:       template.Rules,
	}
	
	err := h.quizService.Create(c.Request.Context(), newTemplate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, newTemplate)
}

func (h *QuizHandler) StartQuiz(c *gin.Context) {
	assessmentID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	studentID := middleware.GetUserID(c)
	
	attempt, err := h.quizService.StartQuiz(c.Request.Context(), studentID, assessmentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, attempt)
}

func (h *QuizHandler) SubmitQuiz(c *gin.Context) {
	attemptID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	var req struct {
		Answers []models.QuizAnswer `json:"answers"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.quizService.SubmitQuiz(c.Request.Context(), attemptID, req.Answers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Quiz submitted successfully"})
}

func (h *QuizHandler) GetResults(c *gin.Context) {
	attemptID, err := primitive.ObjectIDFromHex(c.Param("attemptId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	results, err := h.quizService.GetResults(c.Request.Context(), attemptID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, results)
}
