package main

import (
	"fmt"
	"log"

	"accounting-management-system/config"
	"accounting-management-system/models"
	"accounting-management-system/routes"
	"accounting-management-system/utils"
)

func main() {
	config.LoadConfig()
	config.ConnectDatabase()

	err := config.DB.AutoMigrate(&models.User{}, &models.Admin{}, &models.Transaction{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	createDefaultAdmin()

	r := routes.SetupRouter()
	
	fmt.Println("Server starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func createDefaultAdmin() {
	var count int64
	config.DB.Model(&models.Admin{}).Count(&count)
	
	if count == 0 {
		hashedPassword, err := utils.HashPassword("admin123")
		if err != nil {
			log.Println("Failed to hash default admin password:", err)
			return
		}
		
		defaultAdmin := models.Admin{
			LoginID:  "admin",
			Password: hashedPassword,
			Name:     "系统管理员",
		}
		
		if err := config.DB.Create(&defaultAdmin).Error; err != nil {
			log.Println("Failed to create default admin:", err)
			return
		}
		
		fmt.Println("Default admin created: login_id=admin, password=admin123")
	}
}
