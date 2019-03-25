package controllers

import (
	"encoding/json"
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//list user
func ListUsers(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	users := []models.User{}
	err := database.C(models.CollectionUser).Find(bson.M{"IsDeleted": false}).All(&users)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, users)
}

//update an user
func UpdateUser(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	user := models.User{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &user)
	if common.CheckError(c, err) {
		return
	}

	err = database.C(models.CollectionUser).UpdateId(user.ID, user)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(http.StatusOK, nil)
}

//add intern
func AddIntern(c *gin.Context) {

	type Intern struct {
		user    models.User
		trainee models.Trainee
	}

	database := c.MustGet("db").(*mgo.Database)

	intern := Intern{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &intern)
	if common.CheckError(c, err) {
		return
	}
	intern.user.ID = bson.NewObjectId()
	intern.trainee.ID = intern.user.ID
	err = database.C(models.CollectionUser).Insert(intern.user)
	if common.CheckError(c, err) {
		return
	}

	err = database.C(models.CollectionTrainee).Insert(intern.trainee)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(201, nil)
}
