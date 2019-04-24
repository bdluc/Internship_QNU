package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

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
	mentor.ID = bson.ObjectIdHex(c.Param("id"))

	err = database.C(models.CollectionMentor).UpdateId(mentor.ID, mentor)
	if common.CheckError(c, err) {
		return
	}

	// Update User
	user := models.User{}
	err = database.C(models.CollectionUser).FindId(mentor.ID).One(&user)
	if common.CheckError(c, err) {
		return
	}
	user.UserName = mentor.Email
	user.ID = mentor.ID
	err = database.C(models.CollectionUser).UpdateId(mentor.ID, user)
	if common.CheckError(c, err) {
		return
	}
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

func ListMentorByID(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	id := bson.ObjectIdHex(c.Param("id"))
	mentor := models.Mentor{}
	err := database.C(models.CollectionMentor).Find(bson.M{"_id": id}).One(&mentor)
	//err := database.C(models.CollectionMentor).Find(bson.M{"$or": []bson.M{{"Name": bson.RegEx{"12312", "$i"}}, {"Email": bson.RegEx{"q", "$i"}}, {"Department": bson.RegEx{"DC20", "$i"}}}}).All(&mentor)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, mentor)
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

//Get intern attendance by day
func GetInternStatusByDay(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	id := bson.ObjectIdHex(c.Param("internID"))
	attendance := models.Attendance{}
	// fmt.Printf("%s\n", oID)
	date := c.Param("date")
	s := strings.Split(date, "-")
	y, m, d := s[0], s[1], s[2]
	yi, err := strconv.Atoi(y)
	mi, err := strconv.Atoi(m)
	di, err := strconv.Atoi(d)

	date1 := time.Date(yi, time.Month(mi), di, 1, 0, 0, 0, time.Local)
	date2 := time.Date(yi, time.Month(mi), di, 2, 0, 0, 0, time.Local)

	// err := database.C(models.CollectionAttendance).FindId(bson.M{"InternID": oID} && bson.M{"Date": date})
	// err := database.C(models.CollectionAttendance).Find(bson.M{"InternID": id, "Date": date}).One(&attendance)
	err = database.C(models.CollectionAttendance).Find(bson.M{"InternID": id, "$or": []bson.M{{"Date": date1}, {"Date": date2}}}).One(&attendance)
	if err != nil {
		c.JSON(http.StatusOK, attendance.IsDeleted)
	}
	c.JSON(http.StatusOK, attendance.Status)
}
