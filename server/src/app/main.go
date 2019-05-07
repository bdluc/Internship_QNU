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
	r.PUT("/user", controllers.UpdateUser)
	r.GET("/users", controllers.ListUsers)
	r.POST("/user", controllers.CreateUser)
	r.PUT("/login", controllers.CheckLogin)
	r.GET("/checkemail/:Email", controllers.CheckUserExit)

	//Mentor

	r.POST("/mentor", controllers.CreateMentor)
	// r.PUT("/mentor", controllers.UpdateMentor)
	r.PUT("/mentoru/:id", controllers.UpdateMentor)
	r.DELETE("/mentor/:id", controllers.DeleteMentor)
	r.GET("/mentors", controllers.ListMentors)
	r.GET("/getmentor/:id", controllers.ListMentorByID)
	// r.GET("/mentorshowattend/:internID/:date", controllers.GetInternStatusByDay)
	r.GET("/mentorDash/:mentorID/:date/:view", controllers.GetDataForDashBoard)
	///:date/:view
	//intern
	r.POST("/intern", controllers.CreateIntern)
	// intern update
	r.PUT("/internu/:id", controllers.UpdateIntern)
	r.DELETE("/intern/:id", controllers.DeleteIntern)
	r.GET("/intern", controllers.ListIntern)
	r.GET("/intern/:id", controllers.GetIntern)
	r.GET("/intern/:id/course", controllers.GetInternByCourse)
	r.GET("/getintern/:id", controllers.ListInternByID)
	r.GET("/internshowattend", controllers.GetInternA)
	r.GET("/internabsent", controllers.GetCurrentDayAbsent)

	//attendance
	r.GET("/attendance/:id", controllers.GetAttendance)
	r.GET("/attendances", controllers.GetListAttendances)
	r.GET("/attendance/:id/intern", controllers.GetInternAttendances)
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
	r.GET("/course/:id/mentor", controllers.GetMentorByInternID)
	r.GET("/course/:id/intern", controllers.GetCourseByIntern)
	r.GET("/coursedetail/:id/intern", controllers.GetDetailCourseByIntern)
	r.GET("/coursedetailindex/:id/:idDetail", controllers.GetDetailCourseByID)
	r.POST("/course", controllers.CreateCourse)
	r.PUT("/course", controllers.UpdateCourse)
	r.PUT("/coursedetailindex/:id", controllers.CreateElementDetailCourseByID)
	r.PUT("/coursedetailupdate/:id/:idDetail", controllers.UpdateElementDetailCourseByID)
	r.DELETE("/course/:id", controllers.DeleteCourse)
	r.DELETE("/coursedetailindex/:id/:idDetail", controllers.DeleteElementDetailCourseByID)

	//absent
	r.GET("/absents", controllers.GetReason)
	r.POST("/absent", controllers.CreateReason)
	r.PUT("/absent", controllers.UpdateReason)
	r.DELETE("/absent/:id", controllers.DeleteReason)

	return r
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
