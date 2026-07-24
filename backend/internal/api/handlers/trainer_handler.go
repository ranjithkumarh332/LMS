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

type TrainerHandler struct {
	trainerService *services.TrainerService
}

func NewTrainerHandler(trainerService *services.TrainerService) *TrainerHandler {
	return &TrainerHandler{trainerService: trainerService}
}

func (h *TrainerHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": search, "$options": "i"}},
			{"email": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	
	trainers, total, err := h.trainerService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"trainers": trainers,
		"total": total,
		"page": page,
		"limit": limit,
	})
}

func (h *TrainerHandler) GetByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	trainer, err := h.trainerService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if trainer == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trainer not found"})
		return
	}
	
	c.JSON(http.StatusOK, trainer)
}

func (h *TrainerHandler) Create(c *gin.Context) {
	var trainer struct {
		Name           string `json:"name" binding:"required"`
		Email          string `json:"email" binding:"required,email"`
		Password       string `json:"password" binding:"required"`
		Mobile         string `json:"mobile"`
		EmployeeID     string `json:"employee_id"`
		Department     string `json:"department"`
		Specialization []string `json:"specialization"`
		CollegeID      string `json:"college_id"`
	}
	
	if err := c.ShouldBindJSON(&trainer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	collegeID, _ := primitive.ObjectIDFromHex(trainer.CollegeID)
	user := &models.User{
		Name:       trainer.Name,
		Email:      trainer.Email,
		Password:   trainer.Password,
		Mobile:     trainer.Mobile,
		IDValue:    trainer.EmployeeID,
		Department: trainer.Department,
		CollegeID:  collegeID,
	}
	
	err := h.trainerService.Create(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, user)
}

func (h *TrainerHandler) Update(c *gin.Context) {
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
	
	delete(update, "password")
	delete(update, "email")
	delete(update, "role")
	
	err = h.trainerService.Update(c.Request.Context(), id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Trainer updated successfully"})
}

func (h *TrainerHandler) Delete(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.trainerService.Delete(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Trainer deleted successfully"})
}
