package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"accounting-management-system/config"
	"accounting-management-system/models"
)

type CreateTransactionRequest struct {
	Name        string  `json:"name" binding:"required"`
	Type        string  `json:"type" binding:"required"`
	Category    string  `json:"category" binding:"required"`
	Time        string  `json:"time" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
	Description string  `json:"description"`
}

func CreateTransaction(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req CreateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transactionTime, err := time.Parse("2006-01-02 15:04:05", req.Time)
	if err != nil {
		transactionTime, err = time.Parse("2006-01-02", req.Time)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid time format. Use '2006-01-02' or '2006-01-02 15:04:05'"})
			return
		}
	}

	transaction := models.Transaction{
		UserID:      userID,
		Name:        req.Name,
		Type:        req.Type,
		Category:    req.Category,
		Time:        transactionTime,
		Amount:      req.Amount,
		Description: req.Description,
	}

	if err := config.DB.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Transaction created successfully", "transaction": transaction})
}

func GetTransaction(c *gin.Context) {
	userID := c.GetUint("user_id")
	transactionID := c.Param("id")

	var transaction models.Transaction
	if err := config.DB.Where("id = ? AND user_id = ?", transactionID, userID).First(&transaction).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	c.JSON(http.StatusOK, transaction)
}

func GetAllTransactions(c *gin.Context) {
	userID := c.GetUint("user_id")
	search := c.Query("search")
	transactionType := c.Query("type")
	category := c.Query("category")

	var transactions []models.Transaction
	query := config.DB.Where("user_id = ?", userID)

	if search != "" {
		query = query.Where("name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}
	if transactionType != "" {
		query = query.Where("type = ?", transactionType)
	}
	if category != "" {
		query = query.Where("category = ?", category)
	}

	if err := query.Order("time DESC").Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get transactions"})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

func DeleteTransaction(c *gin.Context) {
	userID := c.GetUint("user_id")
	transactionID := c.Param("id")

	var transaction models.Transaction
	if err := config.DB.Where("id = ? AND user_id = ?", transactionID, userID).First(&transaction).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	if err := config.DB.Delete(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted successfully"})
}

func GetMonthlyStats(c *gin.Context) {
	userID := c.GetUint("user_id")
	yearStr := c.Query("year")
	monthStr := c.Query("month")

	var year, month int
	var err error

	if yearStr != "" {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
			return
		}
	} else {
		year = time.Now().Year()
	}

	if monthStr != "" {
		month, err = strconv.Atoi(monthStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
			return
		}
		if month < 1 || month > 12 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Month must be between 1 and 12"})
			return
		}
	}

	var transactions []models.Transaction
	query := config.DB.Where("user_id = ?", userID)

	if month != 0 {
		startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)
		endDate := startDate.AddDate(0, 1, 0)
		query = query.Where("time >= ? AND time < ?", startDate, endDate)
	} else {
		startDate := time.Date(year, 1, 1, 0, 0, 0, 0, time.Local)
		endDate := startDate.AddDate(1, 0, 0)
		query = query.Where("time >= ? AND time < ?", startDate, endDate)
	}

	if err := query.Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get transactions"})
		return
	}

	var monthlyStats []models.MonthlyStats
	statsMap := make(map[string]*models.MonthlyStats)

	for _, t := range transactions {
		key := t.Time.Format("2006-01")
		if _, exists := statsMap[key]; !exists {
			statsMap[key] = &models.MonthlyStats{
				Year:  t.Time.Year(),
				Month: int(t.Time.Month()),
			}
		}
		
		if t.Type == "收入" {
			statsMap[key].Income += t.Amount
		} else if t.Type == "支出" {
			statsMap[key].Expense += t.Amount
		}
	}

	for _, stat := range statsMap {
		stat.NetIncome = stat.Income - stat.Expense
		monthlyStats = append(monthlyStats, *stat)
	}

	c.JSON(http.StatusOK, monthlyStats)
}

func GetYearlyStats(c *gin.Context) {
	userID := c.GetUint("user_id")
	yearStr := c.Query("year")

	var year int
	var err error

	if yearStr != "" {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
			return
		}
	}

	var transactions []models.Transaction
	query := config.DB.Where("user_id = ?", userID)

	if year != 0 {
		startDate := time.Date(year, 1, 1, 0, 0, 0, 0, time.Local)
		endDate := startDate.AddDate(1, 0, 0)
		query = query.Where("time >= ? AND time < ?", startDate, endDate)
	}

	if err := query.Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get transactions"})
		return
	}

	var yearlyStats []models.YearlyStats
	statsMap := make(map[int]*models.YearlyStats)

	for _, t := range transactions {
		y := t.Time.Year()
		if _, exists := statsMap[y]; !exists {
			statsMap[y] = &models.YearlyStats{
				Year: y,
			}
		}
		
		if t.Type == "收入" {
			statsMap[y].Income += t.Amount
		} else if t.Type == "支出" {
			statsMap[y].Expense += t.Amount
		}
	}

	for _, stat := range statsMap {
		stat.NetIncome = stat.Income - stat.Expense
		yearlyStats = append(yearlyStats, *stat)
	}

	c.JSON(http.StatusOK, yearlyStats)
}
