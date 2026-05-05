package models

import (
	"testing"
	"time"
)

func TestUserModel(t *testing.T) {
	user := User{
		LoginID:  "testuser",
		Password: "hashedpassword",
		Name:     "Test User",
		Gender:   "男",
		Age:      25,
		Phone:    "1234567890",
	}
	
	if user.LoginID != "testuser" {
		t.Errorf("User LoginID is wrong: expected 'testuser', got '%s'", user.LoginID)
	}
	
	if user.Name != "Test User" {
		t.Errorf("User Name is wrong: expected 'Test User', got '%s'", user.Name)
	}
	
	if user.Age != 25 {
		t.Errorf("User Age is wrong: expected 25, got %d", user.Age)
	}
}

func TestAdminModel(t *testing.T) {
	admin := Admin{
		LoginID:  "adminuser",
		Password: "adminhashed",
		Name:     "Admin User",
	}
	
	if admin.LoginID != "adminuser" {
		t.Errorf("Admin LoginID is wrong: expected 'adminuser', got '%s'", admin.LoginID)
	}
	
	if admin.Name != "Admin User" {
		t.Errorf("Admin Name is wrong: expected 'Admin User', got '%s'", admin.Name)
	}
}

func TestTransactionModel(t *testing.T) {
	now := time.Now()
	
	transaction := Transaction{
		UserID:      1,
		Name:        "测试交易",
		Type:        "支出",
		Category:    "餐饮",
		Time:        now,
		Amount:      100.50,
		Description: "午餐",
	}
	
	if transaction.UserID != 1 {
		t.Errorf("Transaction UserID is wrong: expected 1, got %d", transaction.UserID)
	}
	
	if transaction.Name != "测试交易" {
		t.Errorf("Transaction Name is wrong: expected '测试交易', got '%s'", transaction.Name)
	}
	
	if transaction.Type != "支出" {
		t.Errorf("Transaction Type is wrong: expected '支出', got '%s'", transaction.Type)
	}
	
	if transaction.Amount != 100.50 {
		t.Errorf("Transaction Amount is wrong: expected 100.50, got %.2f", transaction.Amount)
	}
}

func TestMonthlyStatsModel(t *testing.T) {
	stats := MonthlyStats{
		Year:      2024,
		Month:     5,
		Income:    10000.00,
		Expense:   5000.00,
		NetIncome: 5000.00,
	}
	
	if stats.Year != 2024 {
		t.Errorf("MonthlyStats Year is wrong: expected 2024, got %d", stats.Year)
	}
	
	if stats.Month != 5 {
		t.Errorf("MonthlyStats Month is wrong: expected 5, got %d", stats.Month)
	}
	
	if stats.Income != 10000.00 {
		t.Errorf("MonthlyStats Income is wrong: expected 10000.00, got %.2f", stats.Income)
	}
	
	if stats.Expense != 5000.00 {
		t.Errorf("MonthlyStats Expense is wrong: expected 5000.00, got %.2f", stats.Expense)
	}
	
	if stats.NetIncome != 5000.00 {
		t.Errorf("MonthlyStats NetIncome is wrong: expected 5000.00, got %.2f", stats.NetIncome)
	}
}

func TestYearlyStatsModel(t *testing.T) {
	stats := YearlyStats{
		Year:      2024,
		Income:    120000.00,
		Expense:   60000.00,
		NetIncome: 60000.00,
	}
	
	if stats.Year != 2024 {
		t.Errorf("YearlyStats Year is wrong: expected 2024, got %d", stats.Year)
	}
	
	if stats.Income != 120000.00 {
		t.Errorf("YearlyStats Income is wrong: expected 120000.00, got %.2f", stats.Income)
	}
	
	if stats.Expense != 60000.00 {
		t.Errorf("YearlyStats Expense is wrong: expected 60000.00, got %.2f", stats.Expense)
	}
	
	if stats.NetIncome != 60000.00 {
		t.Errorf("YearlyStats NetIncome is wrong: expected 60000.00, got %.2f", stats.NetIncome)
	}
}
