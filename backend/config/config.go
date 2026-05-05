package config

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

var DB *gorm.DB

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: .env file not found, using defaults")
	}
}

func ConnectDatabase() {
	var err error
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "accounting.db"
	}
	
	fmt.Println("Connecting to database:", dbPath)
	
	sqlDB, err := sql.Open("sqlite", dbPath)
	if err != nil {
		fmt.Println("Failed to open database:", err)
		panic("Failed to open database: " + err.Error())
	}
	
	DB, err = gorm.Open(sqlite.Dialector{
		Conn: sqlDB,
	}, &gorm.Config{})
	
	if err != nil {
		fmt.Println("Database connection error:", err)
		panic("Failed to connect to database: " + err.Error())
	}
	
	fmt.Println("Database connected successfully")
}

func GetJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-secret-key-change-in-production"
	}
	return secret
}
