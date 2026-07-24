package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/eip/backend/internal/api/middleware"
	"github.com/eip/backend/internal/models"
	"github.com/eip/backend/internal/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WorkshopHandler struct {
	workshopService *services.WorkshopService
}

func NewWorkshopHandler(workshopService *services.WorkshopService) *WorkshopHandler {
	return &WorkshopHandler{workshopService: workshopService}
}

func (h *WorkshopHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["title"] = bson.M{"$regex": search, "$options": "i"}
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}
	
	workshops, total, err := h.workshopService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"workshops": workshops,
		"total": total,
		"page": page,
		"limit": limit,
	})
}

func (h *WorkshopHandler) GetByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	workshop, err := h.workshopService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if workshop == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Workshop not found"})
		return
	}
	
	c.JSON(http.StatusOK, workshop)
}

func (h *WorkshopHandler) Create(c *gin.Context) {
	var workshop struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description"`
		ScheduledAt string `json:"scheduled_at"`
		Duration    int    `json:"duration"`
		Location    string `json:"location"`
		MaxSeats    int    `json:"max_seats"`
		Type        string `json:"type"`
		CohortIDs   []string `json:"cohort_ids"`
	}
	
	if err := c.ShouldBindJSON(&workshop); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	var cohortIDs []primitive.ObjectID
	for _, id := range workshop.CohortIDs {
		if oid, err := primitive.ObjectIDFromHex(id); err == nil {
			cohortIDs = append(cohortIDs, oid)
		}
	}
	
	scheduledAt, _ := time.Parse(time.RFC3339, workshop.ScheduledAt)
	
	newWorkshop := &models.Workshop{
		Title:       workshop.Title,
		Description: workshop.Description,
		ScheduledAt: scheduledAt,
		Duration:    workshop.Duration,
		Location:    workshop.Location,
		MaxSeats:    workshop.MaxSeats,
		Type:        workshop.Type,
		CohortIDs:   cohortIDs,
	}
	
	err := h.workshopService.Create(c.Request.Context(), newWorkshop)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, newWorkshop)
}

func (h *WorkshopHandler) Update(c *gin.Context) {
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
	
	err = h.workshopService.Update(c.Request.Context(), id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Workshop updated successfully"})
}

func (h *WorkshopHandler) Delete(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.workshopService.Delete(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Workshop deleted successfully"})
}

func (h *WorkshopHandler) Enroll(c *gin.Context) {
	workshopID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	studentID := middleware.GetUserID(c)
	
	err = h.workshopService.Enroll(c.Request.Context(), workshopID, studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Enrolled successfully"})
}

func (h *WorkshopHandler) Unenroll(c *gin.Context) {
	workshopID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	studentID := middleware.GetUserID(c)
	
	err = h.workshopService.Unenroll(c.Request.Context(), workshopID, studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Unenrolled successfully"})
}
