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

func GetInternAttendances(c *gin.Context) {
	idTrainee := bson.ObjectIdHex(c.Param("id"))
	database := c.MustGet("db").(*mgo.Database)
	intern := models.Intern{}
	course := models.Course{}
	database.C(models.CollectionIntern).Find(bson.M{"_id": idTrainee, "IsDeleted": false}).One(&intern)
	database.C(models.CollectionCourse).Find(bson.M{"_id": intern.CourseID, "IsDeleted": false}).One(&course)
	attens := getAttendancesByInternID(c, idTrainee)
	resp := Attendance{}
	resp.Name = intern.Name
	resp.StartDate = course.StartDate
	resp.EndDate = course.EndDate
	resp.Course = course.CourseName
	resp.Attendances = attens
	c.JSON(http.StatusOK, resp)

}

type Attendance struct {
	Id          string
	Name        string
	Course      string
	StartDate   time.Time
	EndDate     time.Time
	Attendances []models.Attendance
}

func getAttendancesByMentorId(c *gin.Context, idMentor bson.ObjectId) []Attendance {
	database := c.MustGet("db").(*mgo.Database)

	courses := []models.Course{}
	err := database.C(models.CollectionCourse).Find(bson.M{"MentorID": idMentor, "IsDeleted": false}).All(&courses)
	if common.IsError(c, err, "Could not get courses") {
		return nil
	}
	//courseTrainee := []models.Intern
	resp := []Attendance{}
	for _, course := range courses {
		interns := []models.Intern{}
		err = database.C(models.CollectionIntern).Find(bson.M{"CourseID": course.ID, "IsDeleted": false}).All(&interns)
		if common.IsError(c, err, "Could not get trainees") {
			return nil
		}
		for _, intern := range interns {
			resp = append(resp, Attendance{
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
	AttendancesByMentor []Attendance
}

func GetAttendancesBySupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	idSupervisor := bson.ObjectIdHex(c.Param("id"))
	mentors := []models.Mentor{}
	err := database.C(models.CollectionMentor).Find(bson.M{"SupervisorID": idSupervisor, "IsDeleted": false}).All(&mentors)
	if common.IsError(c, err, "Could not get mentors") {
		return
	}
	resp := []Attendance{}
	for _, mentor := range mentors {
		// temp := AttendanceSupervisor{}
		temp := getAttendancesByMentorId(c, mentor.ID)
		// temp.Name = mentor.Name
		for _, v := range temp {
			if !contains(resp, v) {
				resp = append(resp, v)
			}
		}
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

func getDailyAttendancesByMentorId(c *gin.Context, idMentor bson.ObjectId, date time.Time) []Attendance {
	database := c.MustGet("db").(*mgo.Database)
	courses := []models.Course{}
	err := database.C(models.CollectionCourse).Find(bson.M{"MentorID": idMentor, "IsDeleted": false}).All(&courses)
	if common.IsError(c, err, "Could not get courses") {
		return nil
	}
	//courseTrainee := []models.Intern
	resp := []Attendance{}
	for _, course := range courses {
		interns := []models.Intern{}
		err = database.C(models.CollectionIntern).Find(bson.M{"CourseID": course.ID, "IsDeleted": false}).All(&interns)
		if common.IsError(c, err, "Could not get trainees") {
			return nil
		}
		for _, intern := range interns {
			resp = append(resp, Attendance{
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
		attens := getDailyAttendancesByInternID(c, bson.ObjectIdHex(trainee.Id), date)
		resp[i].Attendances = attens
	}
	return resp
}

func getCurentDate() time.Time {
	currentTime := time.Now()
	return time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 0, 0, 0, 0, time.Local)
}

func GetDailyAttendanceByMentor(c *gin.Context) {
	date := getCurentDate()
	idMentor := bson.ObjectIdHex(c.Param("id"))
	resp := getDailyAttendancesByMentorId(c, idMentor, date)
	c.JSON(http.StatusOK, resp)
}

func contains(attendances []Attendance, atten Attendance) bool {
	for _, attendance := range attendances {
		if attendance.Id == atten.Id {
			return true
		}
	}
	return false
}

func GetDailyAttendanceBySupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	date := getCurentDate()

	idSupervisor := bson.ObjectIdHex(c.Param("id"))
	mentors := []models.Mentor{}
	err := database.C(models.CollectionMentor).Find(bson.M{"SupervisorID": idSupervisor, "IsDeleted": false}).All(&mentors)
	if common.IsError(c, err, "Could not get mentors") {
		return
	}

	resp := []Attendance{}
	for _, mentor := range mentors {
		temp := getDailyAttendancesByMentorId(c, mentor.ID, date)
		for _, v := range temp {
			if !contains(resp, v) {
				resp = append(resp, v)
			}
		}
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
	course := models.Course{}
	intern := models.Intern{}
	err = database.C(models.CollectionIntern).FindId(atten.InternID).One(&intern)
	err = database.C(models.CollectionCourse).FindId(intern.CourseID).One(&course)

	// if error of current time without start date and end date of course, dont create attendance
	if err != nil || currentTime.Before(course.StartDate) || currentTime.After(course.EndDate) {
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not create attendance",
		})
		return
	} else {
		atten.ID = bson.NewObjectId()
		atten.IsDeleted = false
		// check attendance exits
		check := models.Attendance{}
		err = database.C(models.CollectionAttendance).Find(bson.M{"InternID": atten.InternID, "Date": atten.Date}).One(&check)
		if err == nil {
			atten.ID = check.ID
			if !updateAttendance(c, database, atten) {
				c.JSON(http.StatusNotFound, gin.H{
					common.Status:  "error",
					common.Message: "Could not create attendance",
				})
				return
			}
		} else {
			err = database.C(models.CollectionAttendance).Insert(atten)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{
					common.Status:  "error",
					common.Message: "Could not create attendance",
				})
				return
			}
		}
		c.JSON(http.StatusCreated, gin.H{
			common.Status:  "created",
			common.Message: "Created attendance",
			"attendance":   atten,
		})
	}
}

func updateAttendance(c *gin.Context, database *mgo.Database, atten models.Attendance) bool {

	check := models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"$not": bson.M{"_id": atten.ID}, "InternID": atten.ID, "Date": atten.Date}).One(&check)
	if err == nil {
		return false
	}

	err = database.C(models.CollectionAttendance).UpdateId(atten.ID, atten)
	if common.IsError(c, err, "Could not update attendance") {
		return false
	} else {
		return true
	}
}

func UpdateAttendance(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	buff, err := c.GetRawData()
	if common.IsError(c, err, "Could not update attendance") {
		return
	} else {
		atten := models.Attendance{}
		err = json.Unmarshal(buff, &atten)
		if common.IsError(c, err, "Could not update attendance") {
			return
		} else {
			if updateAttendance(c, database, atten) {
				c.JSON(http.StatusCreated, gin.H{
					"status":     "updated",
					"message":    "Update attendance successfully",
					"attendance": atten,
				})
			} else {
				common.IsError(c, err, "Could not update attendance")
			}
		}
	}
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
