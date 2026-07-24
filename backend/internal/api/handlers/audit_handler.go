package handlers

import (
	"net/http"
	"strconv"

	"github.com/eip/backend/internal/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

type AuditHandler struct {
	auditService *services.AuditService
}

func NewAuditHandler(auditService *services.AuditService) *AuditHandler {
	return &AuditHandler{auditService: auditService}
}

func (h *AuditHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	filter := bson.M{}
	if search := c.Query("search"); search != "" {
		filter["$or"] = []bson.M{
			{"action": bson.M{"$regex": search, "$options": "i"}},
			{"user_email": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if action := c.Query("action"); action != "" {
		filter["action"] = action
	}
	if entity := c.Query("entity"); entity != "" {
		filter["entity"] = entity
	}
	
	logs, total, err := h.auditService.GetAll(c.Request.Context(), filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"logs": logs,
		"total": total,
		"page": page,
		"limit": limit,
	})
}
