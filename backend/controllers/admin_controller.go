package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"accounting-management-system/config"
	"accounting-management-system/models"
	"accounting-management-system/utils"
)

type CreateAdminRequest struct {
	LoginID  string `json:"login_id" binding:"required"`
	Password string `json:"password" binding:"required"`
	Name     string `json:"name"`
}

type UpdateAdminRequest struct {
	LoginID  string `json:"login_id"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

func GetCurrentAdmin(c *gin.Context) {
	adminID := c.GetUint("user_id")

	var admin models.Admin
	if err := config.DB.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	c.JSON(http.StatusOK, admin)
}

func GetAllAdmins(c *gin.Context) {
	search := c.Query("search")
	
	var admins []models.Admin
	query := config.DB.Model(&models.Admin{})
	
	if search != "" {
		query = query.Where("login_id LIKE ? OR name LIKE ?", 
			"%"+search+"%", "%"+search+"%")
	}
	
	if err := query.Find(&admins).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get admins"})
		return
	}

	c.JSON(http.StatusOK, admins)
}

func GetAdmin(c *gin.Context) {
	adminID := c.Param("id")

	var admin models.Admin
	if err := config.DB.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	c.JSON(http.StatusOK, admin)
}

func CreateAdmin(c *gin.Context) {
	var req CreateAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingAdmin models.Admin
	if err := config.DB.Where("login_id = ?", req.LoginID).First(&existingAdmin).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Login ID already exists"})
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	admin := models.Admin{
		LoginID:  req.LoginID,
		Password: hashedPassword,
		Name:     req.Name,
	}

	if err := config.DB.Create(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Admin created successfully", "admin": admin})
}

func UpdateAdmin(c *gin.Context) {
	adminID := c.Param("id")

	var req UpdateAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var admin models.Admin
	if err := config.DB.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	if req.LoginID != "" && req.LoginID != admin.LoginID {
		var existingAdmin models.Admin
		if err := config.DB.Where("login_id = ?", req.LoginID).First(&existingAdmin).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Login ID already exists"})
			return
		}
		admin.LoginID = req.LoginID
	}

	if req.Password != "" {
		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		admin.Password = hashedPassword
	}

	if req.Name != "" {
		admin.Name = req.Name
	}

	if err := config.DB.Save(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update admin"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Admin updated successfully", "admin": admin})
}

func DeleteAdmin(c *gin.Context) {
	adminID := c.Param("id")

	var admin models.Admin
	if err := config.DB.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	if err := config.DB.Delete(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete admin"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Admin deleted successfully"})
}
