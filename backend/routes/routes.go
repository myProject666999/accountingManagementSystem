package routes

import (
	"github.com/gin-gonic/gin"
	"accounting-management-system/controllers"
	"accounting-management-system/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	auth := r.Group("/api/auth")
	{
		auth.POST("/user/login", controllers.UserLogin)
		auth.POST("/user/register", controllers.UserRegister)
		auth.POST("/admin/login", controllers.AdminLogin)
		auth.POST("/logout", middleware.AuthMiddleware(), controllers.Logout)
	}

	user := r.Group("/api/user")
	user.Use(middleware.AuthMiddleware())
	{
		user.GET("/profile", controllers.GetCurrentUser)
		user.PUT("/profile", controllers.UpdateCurrentUser)
	}

	transactions := r.Group("/api/transactions")
	transactions.Use(middleware.AuthMiddleware())
	{
		transactions.POST("", controllers.CreateTransaction)
		transactions.GET("", controllers.GetAllTransactions)
		transactions.GET("/:id", controllers.GetTransaction)
		transactions.DELETE("/:id", controllers.DeleteTransaction)
	}

	stats := r.Group("/api/stats")
	stats.Use(middleware.AuthMiddleware())
	{
		stats.GET("/monthly", controllers.GetMonthlyStats)
		stats.GET("/yearly", controllers.GetYearlyStats)
	}

	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		admin.GET("/profile", controllers.GetCurrentAdmin)
		admin.GET("/admins", controllers.GetAllAdmins)
		admin.GET("/admins/:id", controllers.GetAdmin)
		admin.POST("/admins", controllers.CreateAdmin)
		admin.PUT("/admins/:id", controllers.UpdateAdmin)
		admin.DELETE("/admins/:id", controllers.DeleteAdmin)
		
		admin.GET("/users", controllers.GetAllUsers)
		admin.DELETE("/users/:id", controllers.DeleteUser)
	}

	return r
}
