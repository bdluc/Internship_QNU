package controllers

import (
	//"bytes"
	"encoding/json"
	"fmt"

	//"log"
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	//"github.com/olahol/go-imageupload"
)

// createexam
func CreateExamination(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	examination := models.Examination{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &examination)
	if common.CheckError(c, err) {
		return
	}

	examination.ID = bson.NewObjectId()
	err = database.C(models.CollectionExamination).Insert(examination)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusCreated, examination)
}

//updateexam
func UpdateExamination(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	examination := models.Examination{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &examination)
	if common.CheckError(c, err) {
		return
	}
	examination.ID = bson.ObjectIdHex(c.Param("id"))
	fmt.Println(examination)

	err = database.C(models.CollectionExamination).UpdateId(examination.ID, examination)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusCreated, examination)
}

//listexamination
func ListExamination(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	examination := []models.Examination{}
	err := database.C(models.CollectionExamination).Find(bson.M{"IsDeleted": false}).All(&examination)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, examination)
}

//create_result
func CreateResultExamination(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	resultexamination := models.ResultExamination{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &resultexamination)
	if common.CheckError(c, err) {
		return
	}

	resultexamination.ID = bson.NewObjectId()
	err = database.C(models.CollectionResult).Insert(resultexamination)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusCreated, resultexamination)

}

//update_result

func UpdateResult(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	resultexamination := models.ResultExamination{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &resultexamination)
	if common.CheckError(c, err) {
		return
	}
	resultexamination.ID = bson.ObjectIdHex(c.Param("id"))
	fmt.Println(resultexamination)

	err = database.C(models.CollectionResult).UpdateId(resultexamination.ID, resultexamination)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusCreated, resultexamination)
}

//listresultexam
func ListResultExamination(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	resultexamination := []models.ResultExamination{}
	err := database.C(models.CollectionResult).Find(bson.M{"IsDeleted": false}).All(&resultexamination)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, resultexamination)
}
