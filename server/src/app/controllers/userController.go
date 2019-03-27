package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// List all users
func ListUsers(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	users := []models.User{}
	err := database.C(models.CollectionUser).Find(bson.M{"IsDeleted": false}).All(&users)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, users)
}

// Create an user
func CreateUser(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	user := models.User{}
	buf, _ := c.GetRawData()
	fmt.Println(c.GetRawData())
	err := json.Unmarshal(buf, &user)
	if common.CheckError(c, err) {
		return
	}

	err = database.C(models.CollectionUser).Insert(user)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(http.StatusCreated, nil)
}

// Delete an user
func DeleteUser(c *gin.Context, id bson.ObjectId) bool {
	database := c.MustGet("db").(*mgo.Database)

	err := database.C(models.CollectionUser).Update(bson.M{"RoleId": id}, bson.M{"$set": bson.M{"IsDeleted": true}})
	if common.CheckError(c, err) {
		return false
	}
	return true
}
