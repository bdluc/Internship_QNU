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
	r.POST("/user", controllers.CreateUser)

	//Mentor

	r.POST("/mentor", controllers.CreateMentor)
	r.PUT("/mentor", controllers.UpdateMentor)
	// r.POST("/mentor/:id", controllers.UpdateMentor )
	r.DELETE("/mentor/:id", controllers.DeleteMentor)
	r.GET("/mentors", controllers.ListMentors)

	//intern
	r.POST("/intern", controllers.CreateIntern)
	r.PUT("/intern", controllers.UpdateIntern)
	r.DELETE("/intern/:id", controllers.DeleteIntern)
	r.GET("/intern", controllers.ListIntern)
	r.GET("/intern/:id", controllers.GetIntern)
	r.GET("/intern/:id/course", controllers.GetInternByCourse)

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

	//course
	r.GET("/courses", controllers.ListCourses)
	r.GET("/courses/", controllers.ListCourses)
	r.GET("/course/:id", controllers.GetCourse)
	r.GET("/courses/:id", controllers.GetCoursesByMentorID)
	r.GET("/coursename/:name", controllers.GetCourseByName)
	r.GET("/course/:id/intern", controllers.GetCourseByIntern)
	r.POST("/course", controllers.CreateCourse)
	r.PUT("/course", controllers.UpdateCourse)
	r.DELETE("course", controllers.DeleteCourse)

	return r
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
