package controllers

import (
	"encoding/json"
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//add intern

func CreateIntern(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	intern := models.Intern{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &intern)
	if common.CheckError(c, err) {
		return
	}

	intern.ID = bson.NewObjectId()
	err = database.C(models.CollectionIntern).Insert(intern)
	if common.CheckError(c, err) {
		return
	}

	// Add User
	hash, _ := bcrypt.GenerateFromPassword([]byte(common.DefaultPassword), bcrypt.DefaultCost)
	user := models.User{}
	user.UserName = intern.Email
	user.Password = string(hash)
	user.Role = 1
	user.ID = intern.ID

	err = database.C(models.CollectionUser).Insert(user)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusCreated, intern)
}

//edit intern
func UpdateIntern(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	intern := models.Intern{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &intern)
	if common.CheckError(c, err) {
		return
	}

	err = database.C(models.CollectionIntern).UpdateId(intern.ID, intern)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(http.StatusOK, nil)
}

//Delete intern
func DeleteIntern(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	err := database.C(models.CollectionIntern).UpdateId(bson.ObjectIdHex(c.Param("id")), bson.M{"$set": bson.M{"IsDeleted": true}})
	if common.CheckError(c, err) {
		return
	}

	if !DeleteUser(c, bson.ObjectIdHex(c.Param("id"))) {
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// Get intern by id
func getInternByID(c *gin.Context, id string) (error, *models.Intern) {
	database := c.MustGet("db").(*mgo.Database)
	oID := bson.ObjectIdHex(id)
	intern := models.Intern{}
	err := database.C(models.CollectionIntern).FindId(oID).One(&intern)
	if err != nil {
		return err, nil
	}

	return nil, &intern
}

// List all intern
func ListIntern(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	intern := []models.Intern{}
	err := database.C(models.CollectionIntern).Find(bson.M{"IsDeleted": false}).All(&intern)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(http.StatusOK, intern)
}

// Get an intern
func GetIntern(c *gin.Context) {
	err, intern := getInternByID(c, c.Param("id"))
	if common.CheckNotFound(c, err) {
		return
	}
	c.JSON(http.StatusOK, intern)
}

//list all intern in course
func GetInternByCourse(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	internDb := models.Intern{}
	errIntern := database.C(models.CollectionIntern).Find(bson.M{"CourseID": c.Param("course")}).All(&internDb)
	common.CheckError(c, errIntern)

	c.JSON(http.StatusOK, internDb)
}
