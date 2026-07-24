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

type StudentHandler struct {
	studentService *services.StudentService
}

func NewStudentHandler(studentService *services.StudentService) *StudentHandler {
	return &StudentHandler{studentService: studentService}
}

func (h *StudentHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": search, "$options": "i"}},
			{"email": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if dept := c.Query("department"); dept != "" {
		filter["department"] = dept
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}
	
	students, total, err := h.studentService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"students": students,
		"total": total,
		"page": page,
		"limit": limit,
	})
}

func (h *StudentHandler) GetByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	student, err := h.studentService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if student == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}
	
	c.JSON(http.StatusOK, student)
}

func (h *StudentHandler) Create(c *gin.Context) {
	var student struct {
		Name       string `json:"name" binding:"required"`
		Email      string `json:"email" binding:"required,email"`
		Password   string `json:"password" binding:"required"`
		Mobile     string `json:"mobile"`
		IDValue    string `json:"id_value"`
		RollNumber string `json:"roll_number"`
		Department string `json:"department"`
		CollegeID  string `json:"college_id"`
	}
	
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	collegeID, _ := primitive.ObjectIDFromHex(student.CollegeID)
	user := &models.User{
		Name:       student.Name,
		Email:      student.Email,
		Password:   student.Password,
		Mobile:     student.Mobile,
		IDValue:    student.IDValue,
		Department: student.Department,
		CollegeID:  collegeID,
	}
	
	err := h.studentService.Create(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, user)
}

func (h *StudentHandler) Update(c *gin.Context) {
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
	
	err = h.studentService.Update(c.Request.Context(), id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Student updated successfully"})
}

func (h *StudentHandler) Delete(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	
	err = h.studentService.Delete(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Student deleted successfully"})
}

func (h *StudentHandler) UploadResume(c *gin.Context) {
	id := middleware.GetUserID(c)
	
	file, err := c.FormFile("resume")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	
	// In production, upload to cloud storage
	resumeURL := "/uploads/resumes/" + id.Hex() + "/" + file.Filename
	err = h.studentService.UpdateResume(c.Request.Context(), id, resumeURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Resume uploaded successfully", "url": resumeURL})
}

func (h *StudentHandler) DeleteResume(c *gin.Context) {
	id := middleware.GetUserID(c)
	
	err := h.studentService.DeleteResume(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Resume deleted successfully"})
}
