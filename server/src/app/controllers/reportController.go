package controllers

import (
	"fmt"
	"net/http"
	"time"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Reports struct {
	Name    string
	Reports []models.ReportDetail
}

func GetTodayReportByMentor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	mentorId := bson.ObjectIdHex(c.Param("id"))
	courses := []models.Course{}
	err := database.C(models.CollectionCourse).Find(bson.M{"MentorID": mentorId, "IsDeleted": false}).All(&courses)
	if common.IsError(c, err, "Could not get courses") {
		return
	}

	resp := []Reports{}
	now := time.Now()
	currentday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
	for _, course := range courses {
		interns := []models.Intern{}
		err = database.C(models.CollectionIntern).Find(bson.M{"CourseID": course.ID, "IsDeleted": false}).All(&interns)
		if common.IsError(c, err, "Could not get trainees") {
			return
		}
		for _, intern := range interns {
			reports := []models.ReportDetail{}

			err = database.C(models.CollectionReport).Find(bson.M{"InternID": intern.ID, "Date": currentday, "Type": 1, "IsDeleted": false}).All(&reports)
			resp = append(resp, Reports{
				Name:    intern.Name,
				Reports: reports,
			})
		}
	}
	fmt.Println(resp)
	c.JSON(http.StatusOK, resp)

}

func GetWeekReportByMentor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	mentorId := bson.ObjectIdHex(c.Param("id"))
	startDay, err := time.Parse(time.RFC3339, c.Param("startday"))
	if common.IsError(c, err, "Startdate format error") {
		return
	}

	courses := []models.Course{}
	err = database.C(models.CollectionCourse).Find(bson.M{"MentorID": mentorId, "IsDeleted": false}).All(&courses)
	if common.IsError(c, err, "Could not get courses") {
		return
	}
	resp := []Reports{}
	now := time.Now()
	fmt.Println(startDay)
	currentday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
	fmt.Println(currentday)
	for _, course := range courses {
		interns := []models.Intern{}
		err = database.C(models.CollectionIntern).Find(bson.M{"CourseID": course.ID, "IsDeleted": false}).All(&interns)
		if common.IsError(c, err, "Could not get trainees") {
			return
		}
		for _, intern := range interns {
			reports := []models.ReportDetail{}

			err = database.C(models.CollectionReport).Find(bson.M{"InternID": intern.ID, "Date": bson.M{"$gte": startDay, "$lte": currentday}, "Type": 2, "IsDeleted": false}).All(&reports)
			resp = append(resp, Reports{
				Name:    intern.Name,
				Reports: reports,
			})
		}
	}
	c.JSON(http.StatusOK, resp)
}
