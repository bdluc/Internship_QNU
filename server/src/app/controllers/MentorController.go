package controllers

import (
	"encoding/json"
	"fmt"
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

type data struct {
	category string `json:"category"`
	value    int    `json:"value"`
}

type attendanceDash struct {
	// ID       bson.ObjectId `bson:"_id,omitempty"` //id of Intern, Mentor, Sup
	Name string `json:"Name"`
	data []data `json:"data"`
}

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
func getInternStatusByDay(c *gin.Context, internID string, date string) *models.Attendance {
	database := c.MustGet("db").(*mgo.Database)
	id := bson.ObjectIdHex(internID)
	attendance := models.Attendance{}
	// fmt.Printf("%s\n", oID)
	// date := c.Param("date")
	s := strings.Split(date, "-")
	y, m, d := s[0], s[1], s[2]
	yi, _ := strconv.Atoi(y)
	mi, _ := strconv.Atoi(m)
	di, _ := strconv.Atoi(d)

	date1 := time.Date(yi, time.Month(mi), di, 1, 0, 0, 0, time.Local)
	date2 := time.Date(yi, time.Month(mi), di, 2, 0, 0, 0, time.Local)

	// err := database.C(models.CollectionAttendance).FindId(bson.M{"InternID": oID} && bson.M{"Date": date})
	// err := database.C(models.CollectionAttendance).Find(bson.M{"InternID": id, "Date": date}).One(&attendance)
	err := database.C(models.CollectionAttendance).Find(bson.M{"InternID": id, "$or": []bson.M{{"Date": date1}, {"Date": date2}}}).One(&attendance)
	if err != nil {
		return &attendance
	}
	return &attendance
}

func dayUp(date string) string {
	s := strings.Split(date, "-")
	y, m, d := s[0], s[1], s[2]
	yi, _ := strconv.Atoi(y)
	mi, _ := strconv.Atoi(m)
	di, _ := strconv.Atoi(d)

	// fmt.Print("Month: ", di, "//")

	di = di + 1
	// fmt.Print("Month: ", di, "//")

	switch mi {
	case 1:
	case 3:
	case 5:
	case 7:
	case 8:
	case 10:
	case 12:
		if di > 31 {
			di = 1
			mi = mi + 1
		}
		break
	case 4:
	case 6:
	case 9:
	case 11:
		if di > 30 {
			// fmt.Print("Mont", di, "//")
			di = 1
			mi = mi + 1
		}
		// fmt.Print("Yes 4")
		break
	case 2:
		if di > 29 && yi%4 == 0 {
			di = 1
			mi = mi + 1
		} else if di > 28 {
			di = 1
			mi = mi + 1
		}
		break
	}
	values := []string{}
	ys := strconv.Itoa(yi)
	ms := strconv.Itoa(mi)
	ds := strconv.Itoa(di)

	values = append(values, ys)
	values = append(values, ms)
	values = append(values, ds)
	result := strings.Join(values, "-")

	return result

}

func getInternTimeByStatusByDay(c *gin.Context, internID string, date string) int {
	attend := getInternStatusByDay(c, internID, date)
	status := attend.Status
	// if status ==  {
	// 	return 0
	// }
	switch status {
	case "PP":
		return 8
	case "P":
		return 4
	case "PA":
		return 4
	case "AR":
		return 4
	default:
		// nil, A, ARR
		return 0
	}
}

// func TestDayUp()

func GetDataForDashBoard(c *gin.Context) {
	// attendanceDash
	mentorID := c.Param("mentorID")
	date := c.Param("date")
	view := c.Param("view")
	viewi, _ := strconv.Atoi(view)
	intern := getInternByMentorID(c, mentorID)

	//test
	// rw := getInternTimeByStatusByDay(c, "5cb59165da51e33a8c1a3af4", date)
	// fmt.Print(date)
	// x := dayUp(date)
	// fmt.Print(x)
	// m := dayUp("2019-11-30")
	// fmt.Print(m)
	//
	nattendanceDashList := []attendanceDash{}

	// ndata := data{}
	// nattendanceDash := attendanceDash{}
	for _, v := range intern {
		name := v.Name
		dataList := []data{}
		sid := v.ID.Hex()
		nday := date
		for i := 0; i < viewi; i++ {
			// fmt.Print(i, viewi)
			// day := nday
			sta := getInternTimeByStatusByDay(c, sid, nday)
			// fmt.Print(sta)

			if sta != 0 {
				// t := strconv.Itoa(sta)
				ndata := data{category: nday, value: sta}
				dataList = append(dataList, ndata)
				// c.JSON(http.StatusOK, dataList)

			}

			nday = dayUp(nday)
			// fmt.Print(nday, "\n")

		}
		// pagesJsondataList, _ := json.Marshal(dataList)

		// c.JSON(http.StatusOK, pagesJsondataList)
		// fmt.Print("\n", dataList)

		// _ = json.Unmarshal([]byte(dataList), &arr)

		// fmt.Print(name, "\n", dataList, "\n")

		nattendanceDash := attendanceDash{Name: name, data: dataList}
		fmt.Print(dataList)
		c.JSON(http.StatusOK, dataList)

		nattendanceDashList = append(nattendanceDashList, nattendanceDash)
	}
	// fmt.Print("\n", nattendanceDashList)
	// c.JSON(http.StatusOK, nattendanceDashList)

}

func getInternByMentorID(c *gin.Context, mentorID string) []models.Intern {
	database := c.MustGet("db").(*mgo.Database)
	cource := getCourcebyMentorID(c, mentorID)
	courseID := cource.ID
	intern := []models.Intern{}
	err := database.C(models.CollectionIntern).Find(bson.M{"CourseID": courseID}).All(&intern)
	common.CheckError(c, err)

	return intern
}

func getCourcebyMentorID(c *gin.Context, mentorID string) models.Course {

	database := c.MustGet("db").(*mgo.Database)
	oID := bson.ObjectIdHex(mentorID)
	course := models.Course{}

	err := database.C(models.CollectionCourse).Find(bson.M{"MentorID": oID}).One(&course)
	common.CheckError(c, err)

	return course
}
