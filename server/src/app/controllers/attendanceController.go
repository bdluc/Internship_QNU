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
	resp := []AttendanceSupervisor{}
	for _, mentor := range mentors {
		temp := AttendanceSupervisor{}
		temp.AttendancesByMentor = getAttendancesByMentorId(c, mentor.ID)
		temp.Name = mentor.Name
		resp = append(resp, temp)
	}
	c.JSON(http.StatusOK, resp)
}

func getDailyAttendancesByInternID(c *gin.Context, idTrainee bson.ObjectId, date1 time.Time, date2 time.Time) []models.Attendance {
	database := c.MustGet("db").(*mgo.Database)
	atten := []models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"InternID": idTrainee, "IsDeleted": false, "$or": []bson.M{{"Date": date1}, {"Date": date2}}}).All(&atten)
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

func getDailyAttendancesByMentorId(c *gin.Context, idMentor bson.ObjectId, date1 time.Time, date2 time.Time) []Attendance {
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
		attens := getDailyAttendancesByInternID(c, bson.ObjectIdHex(trainee.Id), date1, date2)
		resp[i].Attendances = attens
	}
	return resp
}

func getCurentDate(currentTime time.Time, date1 *time.Time, date2 *time.Time) {
	*date1 = time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 1, 0, 0, 0, time.Local)
	*date2 = time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 2, 0, 0, 0, time.Local)
}

func GetDailyAttendanceByMentor(c *gin.Context) {
	currentTime := time.Now()
	date1 := time.Time{}
	date2 := time.Time{}
	getCurentDate(currentTime, &date1, &date2)
	fmt.Print(date1)
	idMentor := bson.ObjectIdHex(c.Param("id"))
	resp := getDailyAttendancesByMentorId(c, idMentor, date1, date2)
	c.JSON(http.StatusOK, resp)
}

func GetDailyAttendanceBySupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	currentTime := time.Now()
	date1 := time.Time{}
	date2 := time.Time{}
	getCurentDate(currentTime, &date1, &date2)

	idSupervisor := bson.ObjectIdHex(c.Param("id"))
	mentors := []models.Mentor{}
	err := database.C(models.CollectionMentor).Find(bson.M{"SupervisorID": idSupervisor, "IsDeleted": false}).All(&mentors)
	if common.IsError(c, err, "Could not get mentors") {
		return
	}

	resp := []AttendanceSupervisor{}
	for _, mentor := range mentors {
		temp := AttendanceSupervisor{}
		temp.AttendancesByMentor = getDailyAttendancesByMentorId(c, mentor.ID, date1, date2)
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
	course := models.Course{}
	intern := models.Intern{}
	err = database.C(models.CollectionIntern).FindId(atten.InternID).One(&intern)
	err = database.C(models.CollectionCourse).FindId(intern.CourseID).One(&course)
	if currentTime.Before(course.StartDate) || currentTime.After(course.EndDate) {
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not create attendance",
		})
		return
	} else {
		date1 := time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 1, 0, 0, 0, time.Local)
		date2 := time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 2, 0, 0, 0, time.Local)
		if currentTime.Hour() < 13 {
			atten.Date = date1
		} else {
			atten.Date = date2
		}

		atten.IsDeleted = false

		check := models.Attendance{}
		err = database.C(models.CollectionAttendance).Find(bson.M{"InternID": atten.InternID, "$or": []bson.M{{"Date": date1}, {"Date": date2}}}).One(&check)
		if err == nil && ((check.Status == "PP") || (check.Status == "P") || (currentTime.Hour() < 13 && check.Status == "PA") || (check.Date.Hour() == 2 && check.Status == "PA")) {
			c.JSON(http.StatusNotFound, gin.H{
				common.Status:  "error",
				common.Message: "attendance is exit",
			})
			return
		} else {
			if err == nil && currentTime.Hour() > 13 && (check.Status == "PA" || check.Status == "AR") {
				atten.ID = check.ID
				if check.Status == "PA" && atten.Status == "PA" {
					atten.Status = "PP"
				} else if (check.Status == "PA" && atten.Status == "AR") || (check.Status == "AR" && atten.Status == "PA") {
					atten.Status = "P"
				}
				if !updateAttendance(c, database, atten) {
					c.JSON(http.StatusNotFound, gin.H{
						common.Status:  "error",
						common.Message: "Could not create attendance",
					})
					return
				}
			} else if err == nil {
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
			})
		}
	}
}

func updateAttendance(c *gin.Context, database *mgo.Database, atten models.Attendance) bool {
	check := models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"$not": bson.M{"_id": atten.ID}, "InternID": atten.ID, "Date": atten.Date}).One(&check)
	if err == nil {
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "attendance is exit",
		})
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
			if atten.Status == "PP" {
				atten.Date = time.Date(atten.Date.Year(), atten.Date.Month(), atten.Date.Day(), 2, 0, 0, 0, time.Local)
			}
			if updateAttendance(c, database, atten) {
				c.JSON(http.StatusCreated, gin.H{
					"status":  "updated",
					"message": "Update attendance successfully",
				})
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
