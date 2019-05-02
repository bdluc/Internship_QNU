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

//add intern

func CreateReason(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	absent := models.Absent{}
	buf, _ := c.GetRawData()

	err := json.Unmarshal(buf, &absent)
	if common.CheckError(c, err) {
		return
	}
	err = database.C(models.CollectionAbsent).Insert(absent)
	common.CheckError(c, err)
	c.JSON(http.StatusCreated, nil)
}
func UpdateReason(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	absent := models.Absent{}
	buf, _ := c.GetRawData()

	err := json.Unmarshal(buf, &absent)
	common.CheckError(c, err)

	err = database.C(models.CollectionAbsent).UpdateId(absent.ID, absent)
	common.CheckError(c, err)

	c.JSON(http.StatusOK, nil)
}
func DeleteReason(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	absent := getReasonByID(c, c.Param("id"))

	absent.IsDeleted = true

	err := database.C(models.CollectionAbsent).UpdateId(absent.ID, absent)
	common.CheckError(c, err)

	c.JSON(http.StatusNoContent, nil)
}
func getReasonByID(c *gin.Context, id string) models.Absent {
	database := c.MustGet("db").(*mgo.Database)
	oID := bson.ObjectIdHex(id)
	absent := models.Absent{}

	err := database.C(models.CollectionAbsent).FindId(oID).One(&absent)
	common.CheckError(c, err)

	return absent
}
func GetReason(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	query := []bson.M{

		// {
		// 	"$unwind": "$MentorID",
		// },
		{
			"$lookup": bson.M{
				"from":         "intern",
				"localField":   "InternID",
				"foreignField": "_id",
				"as":           "Intern",
			}},
		{
			"$unwind": "$Intern",
		},
		{
			"$match": bson.M{
				"IsDeleted": false,
				// "MentorID":  "Mentor.ID",
			}},
		{
			"$project": bson.M{
				"Message":    1,
				"Date":       1,
				"InternID":   1,
				"Status":     1,
				"IsDeleted":  1,
				"InternName": "$Intern.Name",
			}},
	}

	pipe := database.C(models.CollectionAbsent).Pipe(query)
	resp := []bson.M{}
	err := pipe.All(&resp)

	common.CheckError(c, err)
	c.JSON(http.StatusOK, resp)
}
