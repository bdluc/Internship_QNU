package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"gopkg.in/mgo.v2/bson"

	mgo "gopkg.in/mgo.v2"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
)

func GetAttendanceId(c *gin.Context, id bson.ObjectId) *models.Attendance {
	database := c.MustGet("db").(*mgo.Database)
	atten := models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"_id": id, "IsDeleted": false}).One(&atten)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not get attendance",
		})
		return nil
	}
	return &atten

}

func GetAttendance(c *gin.Context) {
	id := bson.ObjectIdHex(c.Param("id"))
	atten := GetAttendanceId(c, id)
	if atten != nil {
		c.JSON(http.StatusOK, atten)
	}

}

func GetListAttendances(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	attens := []models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"IsDeleted": false}).All(&attens)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not get list attendance",
		})
		return
	}

	c.JSON(http.StatusOK, attens)

}

func getAttendancesByInternID(c *gin.Context, idTrainee bson.ObjectId) []models.Attendance {
	database := c.MustGet("db").(*mgo.Database)
	attens := []models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"InternID": idTrainee, "IsDeleted": false}).All(&attens)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not get list attendance",
		})
		return nil
	}
	return attens
}

func GetTraineeAttendances(c *gin.Context) {
	idTrainee := bson.ObjectIdHex(c.Param("id"))
	attens := getAttendancesByInternID(c, idTrainee)
	c.JSON(http.StatusOK, attens)

}

type AttendanceMentor struct {
	Id          string
	Name        string
	Course      string
	StartDate   time.Time
	EndDate     time.Time
	Attendances []models.Attendance
}

func getAttendancesByMentorId(c *gin.Context, idMentor bson.ObjectId) []AttendanceMentor {
	database := c.MustGet("db").(*mgo.Database)

	courses := []models.Course{}
	err := database.C(models.CollectionCourse).Find(bson.M{"MentorID": idMentor, "IsDeleted": false}).All(&courses)
	if common.IsError(c, err, "Could not get courses") {
		return nil
	}

	//courseTrainee := []models.Intern
	resp := []AttendanceMentor{}
	for _, course := range courses {
		interns := []models.Intern{}
		err = database.C(models.CollectionIntern).Find(bson.M{"CourseID": course.ID, "IsDeleted": false}).All(&interns)
		if common.IsError(c, err, "Could not get trainees") {
			return nil
		}
		for _, intern := range interns {
			resp = append(resp, AttendanceMentor{
				Id:          intern.ID.Hex(),
				Name:        intern.Name,
				Course:      course.CourseName,
				StartDate:   course.StartDate,
				EndDate:     course.EndDate,
				Attendances: []models.Attendance{},
			})
		}

	}
	for i, trainee := range resp {
		attens := getAttendancesByInternID(c, bson.ObjectIdHex(trainee.Id))
		resp[i].Attendances = attens
	}
	return resp
}

func GetAttendancesByMentor(c *gin.Context) {
	idMentor := bson.ObjectIdHex(c.Param("id"))
	resp := getAttendancesByMentorId(c, idMentor)
	c.JSON(http.StatusOK, resp)
}

type AttendanceSupervisor struct {
	Name                string
	AttendancesByMentor []AttendanceMentor
}

func GetAttendancesBySupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	idSupervisor := bson.ObjectIdHex(c.Param("id"))
	mentors := []models.Mentor{}
	err := database.C(models.CollectionMentor).Find(bson.M{"SupervisorID": idSupervisor, "IsDeleted": false}).All(&mentors)
	if common.IsError(c, err, "Could not get mentors") {
		return
	}
	resp := []AttendanceSupervisor{}
	for _, mentor := range mentors {
		temp := AttendanceSupervisor{}
		temp.AttendancesByMentor = getAttendancesByMentorId(c, mentor.ID)
		temp.Name = mentor.Name
		resp = append(resp, temp)
	}
	c.JSON(http.StatusOK, resp)
}

func getDailyAttendancesByInternID(c *gin.Context, idTrainee bson.ObjectId, date time.Time) []models.Attendance {
	database := c.MustGet("db").(*mgo.Database)
	atten := []models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"InternID": idTrainee, "IsDeleted": false, "Date": date}).All(&atten)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not get list attendance",
		})
		return nil
	}
	return atten
}

func getDailyAttendancesByMentorId(c *gin.Context, idMentor bson.ObjectId, date time.Time) []AttendanceMentor {
	database := c.MustGet("db").(*mgo.Database)

	courses := []models.Course{}
	err := database.C(models.CollectionCourse).Find(bson.M{"MentorID": idMentor, "IsDeleted": false}).All(&courses)
	if common.IsError(c, err, "Could not get courses") {
		return nil
	}

	courseTrainee := make(map[string][]models.Intern)
	for _, course := range courses {
		interns := []models.Intern{}
		err = database.C(models.CollectionIntern).Find(bson.M{"CourseID": course.ID, "IsDeleted": false}).All(&interns)
		if common.IsError(c, err, "Could not get trainees") {
			return nil
		}
		courseTrainee[course.CourseName] = interns
	}

	resp := []AttendanceMentor{}

	for course, trainees := range courseTrainee {
		for _, trainee := range trainees {
			atten := getDailyAttendancesByInternID(c, trainee.ID, date)
			data := AttendanceMentor{Id: trainee.ID.Hex(), Name: trainee.Name, Course: course, Attendances: atten}
			resp = append(resp, data)
		}
	}
	return resp
}

func getCurentDate(currentTime time.Time) time.Time {
	return time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 0, 0, 0, 0, time.Local)
}

func GetDailyAttendanceByMentor(c *gin.Context) {
	currentTime := time.Now()
	daily := getCurentDate(currentTime)
	idMentor := bson.ObjectIdHex(c.Param("id"))
	resp := getDailyAttendancesByMentorId(c, idMentor, daily)
	c.JSON(http.StatusOK, resp)
}

func GetDailyAttendanceBySupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	currentTime := time.Now()
	daily := getCurentDate(currentTime)

	idSupervisor := bson.ObjectIdHex(c.Param("id"))
	mentors := []models.Mentor{}
	err := database.C(models.CollectionMentor).Find(bson.M{"SupervisorID": idSupervisor, "IsDeleted": false}).All(&mentors)
	if common.IsError(c, err, "Could not get mentors") {
		return
	}

	resp := []AttendanceSupervisor{}
	for _, mentor := range mentors {
		temp := AttendanceSupervisor{}
		temp.AttendancesByMentor = getDailyAttendancesByMentorId(c, mentor.ID, daily)
		temp.Name = mentor.Name
		resp = append(resp, temp)
	}
	c.JSON(http.StatusOK, resp)
}

func CreateAttendance(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	buf, err := c.GetRawData()
	if common.IsError(c, err, "Could not create attendance") {
		return
	}

	atten := models.Attendance{}
	err = json.Unmarshal(buf, &atten)
	if common.IsError(c, err, "Could not create attendance") {
		return
	}

	currentTime := time.Now()
	atten.Date = time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 0, 0, 0, 0, time.Local)
	check := models.Attendance{}
	err = database.C(models.CollectionAttendance).Find(bson.M{"InternID": atten.InternID, "Date": atten.Date}).One(&check)
	if err == nil {
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "attendance is exit",
		})
		return
	}

	err = database.C(models.CollectionAttendance).Insert(atten)
	if err != nil {
		fmt.Println(err)
		fmt.Println(atten)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not create attendance",
		})
		return
	}
	c.JSON(http.StatusCreated, nil)
}

func UpdateAttendance(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	buff, err := c.GetRawData()
	if common.IsError(c, err, "Could not update attendance") {
		return
	}
	atten := models.Attendance{}
	err = json.Unmarshal(buff, &atten)
	if common.IsError(c, err, "Could not update attendance") {
		return
	}

	check := models.Attendance{}
	err = database.C(models.CollectionAttendance).Find(bson.M{"$not": bson.M{"_id": atten.ID}, "InternID": atten.ID, "Date": atten.Date}).One(&check)
	if err == nil {
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "attendance is exit",
		})
		return
	}

	err = database.C(models.CollectionAttendance).UpdateId(atten.ID, atten)
	if common.IsError(c, err, "Could not update attendance") {
		return
	}
	c.JSON(http.StatusCreated, nil)

}

func DeleteAttendance(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	id := bson.ObjectIdHex(c.Param("id"))
	err := database.C(models.CollectionAttendance).RemoveId(bson.M{"_id": id, "IsDeleted": false})
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not delete attendance",
		})
		return
	}
	c.JSON(http.StatusOK, nil)
}
