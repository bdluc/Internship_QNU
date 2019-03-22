package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

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

func GetTraineeAttendances(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	idTrainee := bson.ObjectIdHex(c.Param("id"))
	attens := []models.Attendance{}
	err := database.C(models.CollectionAttendance).Find(bson.M{"TraineeId": idTrainee, "IsDeleted": false}).All(&attens)
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

func GetAttendancesByMentor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	idMentor := bson.ObjectIdHex(c.Param("id"))
	trainees := []models.Trainee{}
	err := database.C(models.CollectionTrainee).Find(bson.M{"MentorID": idMentor, "IsDeleted": false}).All(&trainees)
	if common.IsError(c, err, "Could not get trainees") {
		return
	}

	type ResponseObject struct {
		Id         string
		Name       string
		Attendance []models.Attendance
	}

	resp := []ResponseObject{}

	for _, trainee := range trainees {
		attens := []models.Attendance{}
		err := database.C(models.CollectionAttendance).Find(bson.M{"TraineeId": trainee.ID, "IsDeleted": false}).All(&attens)
		if common.IsError(c, err, "Could not get attendance") {
			return
		}
		data := ResponseObject{Id: trainee.ID.Hex(), Name: trainee.Name, Attendance: attens}
		resp = append(resp, data)

	}
	c.JSON(http.StatusOK, resp)
}

func GetAttendancesBySupervisor(c *gin.Context) {

}

func GetDailyAttendanceByMentor(c *gin.Context) {

}

func GetDailyAttendanceBySupervisor(c *gin.Context) {

}

func CreateAttendance(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	buf, err := c.GetRawData()
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not create attendance",
		})
		return
	}

	atten := models.Attendance{}
	err = json.Unmarshal(buf, &atten)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  "error",
			common.Message: "Could not create attendance",
		})
		return
	}

	atten.ID = bson.NewObjectId()
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
