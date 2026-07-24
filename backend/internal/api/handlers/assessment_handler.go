package handlers

import (
	"net/http"
	"strconv"

	"github.com/eip/backend/internal/models"
	"github.com/eip/backend/internal/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AssessmentHandler struct {
	assessmentService *services.AssessmentService
}

func NewAssessmentHandler(assessmentService *services.AssessmentService) *AssessmentHandler {
	return &AssessmentHandler{assessmentService: assessmentService}
}

func (h *AssessmentHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["name"] = bson.M{"$regex": search, "$options": "i"}
	}
	if category := c.Query("category"); category != "" {
		filter["category"] = category
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}
	
	assessments, total, err := h.assessmentService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"assessments": assessments,
		"total": total,
		"page": page,
		"limit": limit,
	})
}

func (h *AssessmentHandler) GetByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	assessment, err := h.assessmentService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if assessment == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assessment not found"})
		return
	}
	
	c.JSON(http.StatusOK, assessment)
}

func (h *AssessmentHandler) Create(c *gin.Context) {
	var bank struct {
		Name        string   `json:"name" binding:"required"`
		Description string   `json:"description"`
		Category    string   `json:"category"`
		Tags        []string `json:"tags"`
	}
	
	if err := c.ShouldBindJSON(&bank); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	newBank := &models.QuestionBank{
		Name:        bank.Name,
		Description: bank.Description,
		Category:    bank.Category,
		Tags:        bank.Tags,
	}
	
	err := h.assessmentService.Create(c.Request.Context(), newBank)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, newBank)
}

func (h *AssessmentHandler) Update(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	var update map[string]interface{}
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	err = h.assessmentService.Update(c.Request.Context(), id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Assessment updated successfully"})
}

func (h *AssessmentHandler) Delete(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.assessmentService.Delete(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Assessment deleted successfully"})
}

func (h *AssessmentHandler) Publish(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.assessmentService.Publish(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Assessment published successfully"})
}

func (h *AssessmentHandler) Archive(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.assessmentService.Archive(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Assessment archived successfully"})
}
