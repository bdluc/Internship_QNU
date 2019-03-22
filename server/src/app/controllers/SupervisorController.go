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

// Get supervisor by id
func getSupervisorByID(c *gin.Context, id string) (error, *models.Supervisor) {
	database := c.MustGet("db").(*mgo.Database)
	oID := bson.ObjectIdHex(id)
	sup := models.Supervisor{}
	err := database.C(models.CollectionSupervisor).FindId(oID).One(&sup)
	if err != nil {
		return err, nil
	}

	return nil, &sup
}

// List all supervisors
func ListSupervisors(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	sups := []models.Supervisor{}
	err := database.C(models.CollectionSupervisor).Find(bson.M{"IsDeleted": false}).All(&sups)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(http.StatusOK, sups)
}

// Get an supervisor
func GetSupervisor(c *gin.Context) {
	err, sup := getSupervisorByID(c, c.Param("id"))
	if common.CheckNotFound(c, err) {
		return
	}
	c.JSON(http.StatusOK, sup)
}

// Create an supervisor
func CreateSupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	sup := models.Supervisor{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &sup)
	if common.CheckError(c, err) {
		return
	}

	id := bson.NewObjectId()
	sup.ID = id
	err = database.C(models.CollectionSupervisor).Insert(sup)
	if common.CheckError(c, err) {
		return
	}

	// Create user
	hash, _ := bcrypt.GenerateFromPassword([]byte(common.DefaultPassword), bcrypt.DefaultCost)
	user := models.User{
		UserName: sup.Email,
		Password: string(hash),
		Role:     3,
		//RoleID:   id,
	}
	err = database.C(models.CollectionUser).Insert(user)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(http.StatusCreated, nil)
}

// Update an supervisor
func UpdateSupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	sup := models.Supervisor{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &sup)
	if common.CheckError(c, err) {
		return
	}

	err = database.C(models.CollectionSupervisor).UpdateId(sup.ID, sup)
	if common.CheckError(c, err) {
		return
	}

	c.JSON(http.StatusOK, nil)
}

// Delete an supervisor
func DeleteSupervisor(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	err := database.C(models.CollectionSupervisor).UpdateId(bson.ObjectIdHex(c.Param("id")), bson.M{"$set": bson.M{"IsDeleted": true}})
	if common.CheckError(c, err) {
		return
	}

	// Delete user
	if !DeleteUser(c, bson.ObjectIdHex(c.Param("id"))) {
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
