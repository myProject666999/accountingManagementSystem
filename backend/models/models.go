package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	LoginID   string         `json:"login_id" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Name      string         `json:"name"`
	Gender    string         `json:"gender"`
	Age       int            `json:"age"`
	Phone     string         `json:"phone"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type Admin struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	LoginID   string         `json:"login_id" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Name      string         `json:"name"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type Transaction struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"user_id" gorm:"index;not null"`
	Name        string         `json:"name"`
	Type        string         `json:"type"` // 收入 或 支出
	Category    string         `json:"category"`
	Time        time.Time      `json:"time"`
	Amount      float64        `json:"amount"`
	Description string         `json:"description"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type MonthlyStats struct {
	Year      int     `json:"year"`
	Month     int     `json:"month"`
	Income    float64 `json:"income"`
	Expense   float64 `json:"expense"`
	NetIncome float64 `json:"net_income"`
}

type YearlyStats struct {
	Year      int     `json:"year"`
	Income    float64 `json:"income"`
	Expense   float64 `json:"expense"`
	NetIncome float64 `json:"net_income"`
}
