package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	mgo "gopkg.in/mgo.v2"
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

// Get User Login
func getUserLogin(c *gin.Context, username string, password string) *models.User {
	database := c.MustGet("db").(*mgo.Database)

	user := models.User{}
	err := database.C(models.CollectionUser).Find(bson.M{"UserName": username, "Password": password}).One(&user)
	if common.CheckNotFound(c, err) {
		return nil
	}

	return &user
}

// Check Login from client
func CheckLogin(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	userTemp := models.User{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &userTemp)
	if common.CheckError(c, err) {
		return
	}

	user := models.User{}
	err = database.C(models.CollectionUser).Find(bson.M{"UserName": userTemp.UserName, "IsDeleted": false}).One(&user)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"stt":     "1",
			"message": "Username or Password is not correct!",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userTemp.Password)); err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"stt":     "2",
			"message": "Username or Password is not correct!",
		})
	} else {
		c.JSON(http.StatusOK, user)
	}
}

func UpdateUser(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	buf, _ := c.GetRawData()
	user := models.User{}
	err := json.Unmarshal(buf, &user)
	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hash)
	err = database.C(models.CollectionUser).UpdateId(user.ID, user)
	if common.CheckNotFound(c, err) {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Update successful",
	})
}

// check user email
func CheckUserExit(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	user := models.User{}
	err := database.C(models.CollectionUser).Find(bson.M{"UserName": (c.Param("Email"))}).One(&user)
	if common.CheckNotFound(c, err) {
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Error",
	})
}
