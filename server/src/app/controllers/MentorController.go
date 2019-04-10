package controllers

import (
	"encoding/json"
	"net/http"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Add an mentor
func CreateMentor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	mentor := models.Mentor{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &mentor)
	if common.CheckError(c, err) {
		return
	}

	mentor.ID = bson.NewObjectId()
	err = database.C(models.CollectionMentor).Insert(mentor)
	if common.CheckError(c, err) {
		return
	}

	// Add User for mentor
	hash, _ := bcrypt.GenerateFromPassword([]byte(common.DefaultPassword), bcrypt.DefaultCost)
	user := models.User{}
	user.UserName = mentor.Email
	user.Password = string(hash)
	user.Role = 2
	user.ID = mentor.ID

	err = database.C(models.CollectionUser).Insert(user)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusCreated, mentor)
}

// Edit an mentor
func UpdateMentor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	mentor := models.Mentor{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &mentor)
	if common.CheckError(c, err) {
		return
	}

	err = database.C(models.CollectionMentor).UpdateId(bson.ObjectIdHex(c.Param("id")), mentor)
	if common.CheckError(c, err) {
		return
	}

	// CreateMentor(c)
	// DeleteMentor(c)

	c.JSON(http.StatusOK, nil)
}

//Delete an mentor

func DeleteMentor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	err := database.C(models.CollectionMentor).UpdateId(bson.ObjectIdHex(c.Param("id")), bson.M{"$set": bson.M{"IsDeleted": true}})
	if common.CheckError(c, err) {
		return
	}

	//Delete User
	if !DeleteUser(c, bson.ObjectIdHex(c.Param("id"))) {
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// List all mentors
func ListMentors(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	mentor := []models.Mentor{}
	err := database.C(models.CollectionMentor).Find(bson.M{"IsDeleted": false}).All(&mentor)
	//err := database.C(models.CollectionMentor).Find(bson.M{"$or": []bson.M{{"Name": bson.RegEx{"12312", "$i"}}, {"Email": bson.RegEx{"q", "$i"}}, {"Department": bson.RegEx{"DC20", "$i"}}}}).All(&mentor)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, mentor)
}

// Get mentor by id
func getMentorByID(c *gin.Context, id string) (error, *models.Mentor) {
	database := c.MustGet("db").(*mgo.Database)
	oID := bson.ObjectIdHex(id)
	mentor := models.Mentor{}
	err := database.C(models.CollectionMentor).FindId(oID).One(&mentor)
	if err != nil {
		return err, nil
	}

	return nil, &mentor
}
