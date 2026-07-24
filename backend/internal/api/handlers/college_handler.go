package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/eip/backend/internal/models"
	"github.com/eip/backend/internal/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CollegeHandler struct {
	collegeService *services.CollegeService
}

func NewCollegeHandler(collegeService *services.CollegeService) *CollegeHandler {
	return &CollegeHandler{collegeService: collegeService}
}

func (h *CollegeHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": search, "$options": "i"}},
			{"code": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}
	
	colleges, total, err := h.collegeService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"colleges": colleges,
		"total": total,
		"page": page,
		"limit": limit,
	})
}

func (h *CollegeHandler) GetByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	college, err := h.collegeService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if college == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "College not found"})
		return
	}
	
	c.JSON(http.StatusOK, college)
}

func (h *CollegeHandler) Create(c *gin.Context) {
	var college struct {
		Name        string `json:"name" binding:"required"`
		Code        string `json:"code" binding:"required"`
		TNEACode    string `json:"tnea_code"`
		Location    string `json:"location"`
		Address     string `json:"address"`
		ContactEmail string `json:"contact_email"`
		ContactPhone string `json:"contact_phone"`
		Website     string `json:"website"`
	}
	
	if err := c.ShouldBindJSON(&college); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	newCollege := &models.College{
		Name:         college.Name,
		Code:         college.Code,
		TNEACode:     college.TNEACode,
		Location:     college.Location,
		Address:      college.Address,
		ContactEmail: college.ContactEmail,
		ContactPhone: college.ContactPhone,
		Website:      college.Website,
		Status:       "active",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	
	err := h.collegeService.Create(c.Request.Context(), newCollege)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, newCollege)
}

func (h *CollegeHandler) Update(c *gin.Context) {
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
	
	err = h.collegeService.Update(c.Request.Context(), id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "College updated successfully"})
}

func (h *CollegeHandler) Delete(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.collegeService.Delete(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "College deleted successfully"})
}

func (h *CollegeHandler) Activate(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.collegeService.Activate(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "College activated successfully"})
}

func (h *CollegeHandler) Deactivate(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.collegeService.Deactivate(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "College deactivated successfully"})
}
