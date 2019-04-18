package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"fmt"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func ListCourses(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	query := []bson.M{

		// {
		// 	"$unwind": "$MentorID",
		// },
		{
			"$lookup": bson.M{
				"from":         "mentor",
				"localField":   "MentorID",
				"foreignField": "_id",
				"as":           "Mentor",
			}},
		// {
		// 	"$unwind": "$Mentor",
		// },
		{
			"$match": bson.M{
				"IsDeleted": false,
				// "MentorID":  "Mentor.ID",
			}},
		{
			"$project": bson.M{
				"CourseName": 1,
				"StartDate":  1,
				"EndDate":    1,
				"Detail":     1,
				"MentorID":   1,
				"MentorName": "$Mentor.Name",
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
	if common.CheckError(c, err) {
		return
	}
	fmt.Println(course.StartDate)
	err = database.C(models.CollectionCourse).Insert(course)
	common.CheckError(c, err)
	c.JSON(http.StatusCreated, nil)
}

func UpdateCourse(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	course := models.Course{}
	buf, _ := c.GetRawData()

	err := json.Unmarshal(buf, &course)
	common.CheckError(c, err)

	err = database.C(models.CollectionCourse).UpdateId(course.ID, course)
	common.CheckError(c, err)

	c.JSON(http.StatusOK, nil)
}
func GetDetailCourseByID(c *gin.Context) {
	course := getCourseByID(c, c.Param("id"))
	OidDetail, _ := strconv.Atoi(c.Param("idDetail"))
	resp := models.CourseDetail{}
	for i, v := range course.Detail {
		if OidDetail == i {
			resp = v
		}
	}
	c.JSON(http.StatusOK, resp)
}

func DeleteElementDetailCourseByID(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	OidDetail, _ := strconv.Atoi(c.Param("idDetail"))
	course := getCourseByID(c, c.Param("id"))
	resp := models.CourseDetail{}
	for i, v := range course.Detail {
		if OidDetail == i {
			resp = v
		}
	}
	query := bson.M{

		"$pull": bson.M{
			"Detail": bson.M{
				"Content": resp.Content,
			},
		},
	}
	err := database.C(models.CollectionCourse).UpdateId(course.ID, query)
	common.CheckError(c, err)
	c.JSON(http.StatusNoContent, nil)
}
func CreateElementDetailCourseByID(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	course := getCourseByID(c, c.Param("id"))
	courseDetail := models.CourseDetail{}
	buf, _ := c.GetRawData()

	err := json.Unmarshal(buf, &courseDetail)
	if common.CheckError(c, err) {
		return
	}
	query := bson.M{
		"$push": bson.M{
			"Detail": courseDetail,
		},
	}
	errUpdate := database.C(models.CollectionCourse).UpdateId(course.ID, query)
	common.CheckError(c, errUpdate)
	c.JSON(http.StatusCreated, nil)
}

func UpdateElementDetailCourseByID(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	OidDetail, _ := strconv.Atoi(c.Param("idDetail"))
	course := getCourseByID(c, c.Param("id"))
	resp := models.CourseDetail{}
	for i, v := range course.Detail {
		if OidDetail == i {
			resp = v
		}
	}
	query := bson.M{
		"$pull": bson.M{
			"Detail": bson.M{
				"Content": resp.Content,
			},
		},
	}
	err := database.C(models.CollectionCourse).UpdateId(course.ID, query)
	common.CheckError(c, err)

	courseDetail := models.CourseDetail{}
	buf, _ := c.GetRawData()
	errCreate := json.Unmarshal(buf, &courseDetail)
	datadetail := []models.CourseDetail{}
	datadetail = append(datadetail, courseDetail)
	if common.CheckError(c, errCreate) {
		return
	}
	queryCreate := bson.M{
		"$push": bson.M{
			"Detail": bson.M{
				"$each":     datadetail,
				"$position": OidDetail,
			},
		},
	}
	errUpdate := database.C(models.CollectionCourse).UpdateId(course.ID, queryCreate)
	common.CheckError(c, errUpdate)
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

func GetCourse(c *gin.Context) {
	course := getCourseByID(c, c.Param("id"))
	c.JSON(http.StatusOK, course)
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
		// {
		// 	"$unwind": "$Mentor",
		// },
		{"$match": bson.M{
			"IsDeleted": false,
			"MentorID":  mentor.ID,
		}},
		{
			"$group": bson.M{
				"_id":        "$_id",
				"CourseName": bson.M{"$first": "$CourseName"},
				"StartDate":  bson.M{"$first": "$StartDate"},
				"EndDate":    bson.M{"$first": "$EndDate"},
				"Detail":     bson.M{"$first": "$Detail"},
				"IsDeleted":  bson.M{"$first": "$IsDeleted"},
				"MentorID":   bson.M{"$first": "$MentorID"},
				"MentorName": bson.M{"$first": "$Mentor.Name"},
			},
		},
		{
			"$project": bson.M{
				"CourseName": 1,
				"StartDate":  1,
				"EndDate":    1,
				"Detail":     1,
				"MentorID":   1,
				"IsDeleted":  1,
				"MentorName": "$MentorName",
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

func GetCourseByIntern(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	// trainee := models.Trainee{}
	// oID := bson.ObjectIdHex(id)
	// err := database.C(models.CollectionTrainee).FindId(oID).One(&trainee)
	// if err != nil {
	// 	return err, nil
	// }
	err, intern := getInternByID(c, c.Param("id"))
	if err != nil {
		return
	}
	course := models.Course{}
	errCourse := database.C(models.CollectionCourse).FindId(intern.CourseID).One(&course)
	common.CheckError(c, errCourse)

	c.JSON(http.StatusOK, course)
}

func GetDetailCourseByIntern(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	err, intern := getInternByID(c, c.Param("id"))
	if err != nil {
		return
	}
	course := models.Course{}
	errCourse := database.C(models.CollectionCourse).FindId(intern.CourseID).One(&course)
	common.CheckError(c, errCourse)

	c.JSON(http.StatusOK, course.Detail)
}
func GetMentorByInternID(c *gin.Context) {
	_, intern := getInternByID(c, c.Param("id"))
	idcourse := intern.CourseID.Hex()

	course := getCourseByID(c, idcourse)
	mentorList := []models.Mentor{}
	for _, v := range course.MentorID {
		iidd := v.Hex()
		_, mentor := getMentorByID(c, iidd)
		mentorList = append(mentorList, *mentor)
	}
	c.JSON(http.StatusOK, mentorList)
}
