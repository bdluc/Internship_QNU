package controllers

import (
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func ListUsers(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	users := []models.User{}
	err := database.C(models.CollectionUser).Find(bson.M{"IsDeleted": false}).All(&users)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, users)
}
