package main

import (
	"./controllers"
	"./db"
	"./middlewares"
	"github.com/gin-gonic/gin"
)

func init() {
	db.Connect()
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "application/json")
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Max")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors())

	// Middlewares
	r.Use(middlewares.Connect)
	r.Use(middlewares.ErrorHandler)
	r.Use(cors())

	//User
	r.PUT("/user", controllers.CreateUser)
	r.GET("/users", controllers.ListUsers)

	//Mentor

	r.GET("/mentor", )

	//attendance
	r.GET("/attendance/:id", controllers.GetAttendance)
	r.GET("/attendances", controllers.GetListAttendances)
	r.GET("/attendance/:id/trainee", controllers.GetTraineeAttendances)
	r.GET("/attendance/:id/mentor", controllers.GetAttendancesByMentor)
	r.GET("/attendance/:id/supervisor", controllers.GetAttendancesBySupervisor)
	r.GET("/attendance/:id/mentor/daily", controllers.GetDailyAttendanceByMentor)
	r.GET("/attendance/:id/supervisor/daily", controllers.GetDailyAttendanceBySupervisor)
	r.POST("/attendance", controllers.CreateAttendance)
	r.PUT("/attendance", controllers.UpdateAttendance)
	r.DELETE("/attendance/:id", controllers.DeleteAttendance)
	return r
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
