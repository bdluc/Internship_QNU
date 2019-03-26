package controllers

import (
	"encoding/json"
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func ListCourses(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	query := []bson.M{
		{
			"$lookup": bson.M{
				"from":         "mentor",
				"localField":   "_id",
				"foreignField": "MentorID",
				"as":           "Mentor",
			}},
		{
			"$unwind": "$Mentor",
		},
		{
			"$match": bson.M{
				"IsDeleted": false,
			}},
		{
			"$project": bson.M{
				"CourseName": 1,
				"StartDate":  1,
				"EndDate":    1,
				"MentorName": "Mentor.Name",
			}},
	}

	pipe := database.C(models.CollectionCourse).Pipe(query)
	resp := []bson.M{}
	err := pipe.All(&resp)

	common.CheckError(c, err)
	c.JSON(http.StatusOK, resp)
}

func CreateCourse(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	course := models.Course{}
	buf, _ := c.GetRawData()

	err := json.Unmarshal(buf, &course)
	common.CheckError(c, err)

	err = database.C(models.CollectionCourse).Insert(course)
	common.CheckError(c, err)
	c.JSON(http.StatusCreated, nil)
}

func UpdateCourse(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	course := models.Course{}
	buf, _ := c.GetRawData()

	err := json.Unmarshal(buf, course)
	common.CheckError(c, err)

	err = database.C(models.CollectionCourse).UpdateId(course.ID, course)
	common.CheckError(c, err)

	c.JSON(http.StatusOK, nil)
}

func getCourseByID(c *gin.Context, id string) models.Course {
	database := c.MustGet("db").(*mgo.Database)
	oID := bson.ObjectIdHex(id)
	course := models.Course{}

	err := database.C(models.CollectionCourse).FindId(oID).One(&course)
	common.CheckError(c, err)

	return course
}

func DeleteCourse(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	course := getCourseByID(c, c.Param("id"))

	course.IsDeleted = true

	err := database.C(models.CollectionCourse).UpdateId(course.ID, course)
	common.CheckError(c, err)

	c.JSON(http.StatusNoContent, nil)
}

func GetCoursesByMentorID(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	collection := database.C(models.CollectionCourse)

	err, mentor := getMentorByID(c, c.Param("id"))
	common.CheckError(c, err)

	query := []bson.M{
		{
			"$lookup": bson.M{ // lookup the documents table here
				"from":         "mentor",
				"localField":   "MentorID",
				"foreignField": "_id",
				"as":           "Mentor",
			}},
		{
			"$unwind": "$Mentor",
		},
		{"$match": bson.M{
			"IsDeleted": false,
			"MentorID":  mentor.ID,
		}},
		{
			"$project": bson.M{
				"CourseName": 1,
				"StartDate":  1,
				"EndDate":    1,
				"Detail":     1,
				"MentorID":   1,
				"IsDeleted":  1,
				"MentorName": "$Mentor.Name",
			},
		},
	}
	pipe := collection.Pipe(query)
	resp := []bson.M{}
	err = pipe.All(&resp)
	common.CheckError(c, err)
	c.JSON(http.StatusOK, resp)
}

func GetCourseByName(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	course := models.Course{}
	name := c.Param("name")
	err := database.C(models.CollectionCourse).Find(bson.M{"CourseName": name}).One(&course)
	common.CheckError(c, err)
	c.JSON(http.StatusOK, course)
}

func GetCourseByTrainee(c *gin.Context, id string) (error, *models.Course) {
	database := c.MustGet("db").(*mgo.Database)
	trainee := models.Intern{}
	oID := bson.ObjectIdHex(id)
	err := database.C(models.CollectionIntern).FindId(oID).One(&trainee)
	if err != nil {
		return err, nil
	}

	course := models.Course{}
	errCourse := database.C(models.CollectionCourse).FindId(trainee.CourseID).One(&course)
	if errCourse != nil {
		return errCourse, nil
	}

	return nil, &course
}
