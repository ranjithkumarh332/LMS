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

type CohortHandler struct {
	cohortService *services.CohortService
}

func NewCohortHandler(cohortService *services.CohortService) *CohortHandler {
	return &CohortHandler{cohortService: cohortService}
}

func (h *CohortHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["name"] = bson.M{"$regex": search, "$options": "i"}
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}
	
	cohorts, total, err := h.cohortService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"cohorts": cohorts,
		"total": total,
		"page": page,
		"limit": limit,
	})
}

func (h *CohortHandler) GetByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	cohort, err := h.cohortService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if cohort == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}
	
	c.JSON(http.StatusOK, cohort)
}

func (h *CohortHandler) Create(c *gin.Context) {
	var cohort struct {
		Name         string   `json:"name" binding:"required"`
		Description  string   `json:"description"`
		DepartmentID string   `json:"department_id"`
		Year         int      `json:"year"`
		Semester     int      `json:"semester"`
		TrainerIDs   []string `json:"trainer_ids"`
	}
	
	if err := c.ShouldBindJSON(&cohort); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	var trainerIDs []primitive.ObjectID
	for _, id := range cohort.TrainerIDs {
		if oid, err := primitive.ObjectIDFromHex(id); err == nil {
			trainerIDs = append(trainerIDs, oid)
		}
	}
	
	var deptID primitive.ObjectID
	if oid, err := primitive.ObjectIDFromHex(cohort.DepartmentID); err == nil {
		deptID = oid
	}
	
	newCohort := &models.Cohort{
		Name:         cohort.Name,
		Description:  cohort.Description,
		DepartmentID: deptID,
		Year:         cohort.Year,
		Semester:     cohort.Semester,
		TrainerIDs:   trainerIDs,
		StudentIDs:   []primitive.ObjectID{},
	}
	
	err := h.cohortService.Create(c.Request.Context(), newCohort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, newCohort)
}

func (h *CohortHandler) Update(c *gin.Context) {
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
	
	err = h.cohortService.Update(c.Request.Context(), id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Cohort updated successfully"})
}

func (h *CohortHandler) Delete(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.cohortService.Delete(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Cohort deleted successfully"})
}
