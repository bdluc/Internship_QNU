package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"time"
	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	gomail "gopkg.in/gomail.v2"
	mgo "gopkg.in/mgo.v2"
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

// update intern
func UpdateIntern(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	intern := models.Intern{}
	buf, _ := c.GetRawData()
	err := json.Unmarshal(buf, &intern)
	if common.CheckError(c, err) {
		return
	}
	intern.ID = bson.ObjectIdHex(c.Param("id"))
	fmt.Println(intern)

	err = database.C(models.CollectionIntern).UpdateId(intern.ID, intern)
	if common.CheckError(c, err) {
		return
	}

	// update User
	user := models.User{}
	err = database.C(models.CollectionUser).FindId(intern.ID).One(&user)
	if common.CheckError(c, err) {
		return
	}
	user.UserName = intern.Email
	user.ID = intern.ID
	// fmt.Println(user)
	err = database.C(models.CollectionUser).UpdateId(intern.ID, user)
	if common.CheckError(c, err) {
		return
	}
	c.JSON(http.StatusOK, nil)
}

// list InternById
func ListInternByID(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	id := bson.ObjectIdHex(c.Param("id"))
	intern := models.Intern{}
	err := database.C(models.CollectionIntern).Find(bson.M{"_id": id}).One(&intern)
	if common.CheckError(c, err) {
		return
	}
	course := models.Course{}
	internResp := Intern{}
	database.C(models.CollectionCourse).Find(bson.M{"_id": intern.CourseID, "IsDeleted": false}).One(&course)
	internResp.Intern = intern
	internResp.Course = course.CourseName
	c.JSON(http.StatusOK, internResp)

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
	resp := []Intern{}
	for _, v := range intern {
		course := models.Course{}
		internResp := Intern{}
		database.C(models.CollectionCourse).Find(bson.M{"_id": v.CourseID, "IsDeleted": false}).One(&course)
		internResp.Intern = v
		internResp.Course = course.CourseName
		resp = append(resp, internResp)
	}
	c.JSON(http.StatusOK, resp)
}

type Intern struct {
	Intern models.Intern
	Course string
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

//list
func GetInternA(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	query := []bson.M{

		// {
		// 	"$unwind": "$MentorID",
		// },
		{
			"$lookup": bson.M{
				"from":         "intern",
				"localField":   "InternID",
				"foreignField": "_id",
				"as":           "Intern",
			}},
		{
			"$unwind": "$Intern",
		},
		{
			"$match": bson.M{
				"IsDeleted": false,
				"Status":    "A",
			}},
		{
			"$project": bson.M{
				"Email":      "$Intern.Email",
				"Status":     1,
				"Date":       1,
				"InternName": "$Intern.Name",
			}},
	}

	pipe := database.C(models.CollectionAttendance).Pipe(query)
	resp := []bson.M{}
	err := pipe.All(&resp)

	common.CheckError(c, err)
	c.JSON(http.StatusOK, resp)
}

//list Current Day
func GetCurrentDayAbsent(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)
	date := time.Now()
	dateafter := time.Now().AddDate(0, 0, -1)
	fmt.Print(date)
	query := []bson.M{

		// {
		// 	"$unwind": "$MentorID",
		// },
		{
			"$lookup": bson.M{
				"from":         "intern",
				"localField":   "InternID",
				"foreignField": "_id",
				"as":           "Intern",
			}},
		{
			"$unwind": "$Intern",
		},
		{
			"$match": bson.M{
				"IsDeleted": false,
				"Status":    "A",
				"Date": bson.M{
					"$gt": dateafter,
					"$lt": date,
				},
			}},
		{
			"$project": bson.M{
				"Email":      "$Intern.Email",
				"Status":     1,
				"Date":       1,
				"InternName": "$Intern.Name",
			}},
	}

	pipe := database.C(models.CollectionAttendance).Pipe(query)
	resp := []bson.M{}
	err := pipe.All(&resp)

	common.CheckError(c, err)
	c.JSON(http.StatusOK, resp)
}
func SendReport(c *gin.Context) {
	//Read data from request
	body, errReading := ioutil.ReadAll(c.Request.Body)
	if errReading != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			common.Status:  common.Error,
			common.Message: common.ErrReadingRequestData,
		})
		return
	}

	//Parse json data to struct
	report := &models.Report{}
	errParsing := json.Unmarshal(body, report)
	if errParsing != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			common.Status:  common.Error,
			common.Message: common.ErrReadingRequestData,
		})
		return
	}

	//Get mentor's emails
	err, trainee := getInternByID(c, c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  common.NotFound,
			common.Message: common.TraineeNotFound,
		})
		return
	}
	fmt.Println("running")
	course := getCourseByID(c, string(trainee.CourseID.Hex()))
	for _, v := range course.MentorID {
		err, mentor := getMentorByID(c, string(v.Hex()))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				common.Status:  common.NotFound,
				common.Message: common.MentorNotFound,
			})
			return
		}
		//Send email to mentor
		email := &models.Email{
			From:     common.User,
			To:       mentor.Email,
			Subject:  report.Subject,
			Body:     report.Body,
			Username: common.User,
			Password: common.Password}
		errSending := models.SendEMail(*email)
		if errSending != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				common.Status:  common.Failed,
				common.Message: common.ErrSendMail,
			})
			return
		}
	}
	reportDetail := models.ReportDetail{
		Subject:   report.Subject,
		Body:      report.Body,
		Date:      time.Now(),
		InternID:  trainee.ID,
		Type:      1,
		IsDeleted: false}
	database := c.MustGet("db").(*mgo.Database)
	errr := database.C(models.CollectionReport).Insert(reportDetail)
	if errr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			common.Status:  common.Failed,
			common.Message: common.ErrSendMail,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		common.Status:  common.Success,
		common.Message: common.SendMailSuccess,
	})
}

func SendReportWeek(c *gin.Context) {
	//Read file from request
	file, errfile := c.FormFile("file")
	if errfile != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", errfile.Error()))
		return
	}
	//Get mentor's emailss
	err, trainee := getInternByID(c, c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			common.Status:  common.NotFound,
			common.Message: common.TraineeNotFound,
		})
		return
	}
	fmt.Println("running")
	course := getCourseByID(c, string(trainee.CourseID.Hex()))
	for _, v := range course.MentorID {
		err, mentor := getMentorByID(c, string(v.Hex()))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				common.Status:  common.NotFound,
				common.Message: common.MentorNotFound,
			})
			return
		}
		//Send email to mentor
		email := &models.Email{
			From:     common.User,
			To:       mentor.Email,
			Subject:  trainee.Name,
			Body:     "Report per week",
			Username: common.User,
			Password: common.Password}
		m := gomail.NewMessage()
		m.SetHeader("From", email.From)
		m.SetHeader("To", email.To)
		m.SetHeader("Subject", email.Subject)
		m.SetBody("text/html", email.Body)
		filename := filepath.Base(file.Filename)
		if err := c.SaveUploadedFile(file, filename); err != nil {
			c.String(http.StatusBadRequest, fmt.Sprintf("upload file err: %s", err.Error()))
			return
		}
		m.Attach(filename) // attach your file's name
		d := gomail.NewDialer("smtp.gmail.com", 587, email.Username, email.Password)
		errSend := d.DialAndSend(m)
		if errSend != nil {
			return
		}
	}
	reportDetail := models.ReportDetail{
		Subject:   trainee.Name,
		Body:      file.Filename,
		Date:      time.Now(),
		InternID:  trainee.ID,
		Type:      2,
		IsDeleted: false}
	database := c.MustGet("db").(*mgo.Database)
	errr := database.C(models.CollectionReport).Insert(reportDetail)
	if errr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			common.Status:  common.Failed,
			common.Message: common.ErrSendMail,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		common.Status:  common.Success,
		common.Message: common.SendMailSuccess,
	})
}

func GetHistoryAbsentByInternID(c *gin.Context) {
	database := c.MustGet("db").(*mgo.Database)

	query := []bson.M{

		// {
		// 	"$unwind": "$MentorID",
		// },
		{
			"$lookup": bson.M{
				"from":         "intern",
				"localField":   "InternID",
				"foreignField": "_id",
				"as":           "Intern",
			}},
		{
			"$unwind": "$Intern",
		},
		{
			"$match": bson.M{
				"IsDeleted": false,
				// "$or": [bson.M{ "Status": 'A' }, bson.M{ "Status": 'AR' }],
				"Status": bson.M{
					"$ne": "PP",
				},
				"InternID": bson.ObjectIdHex(c.Param("id")),
			}},
		{
			"$project": bson.M{
				"Status":     1,
				"Date":       1,
				"Email":      1,
				"InternName": "$Intern.Name",
			}},
	}

	pipe := database.C(models.CollectionAttendance).Pipe(query)
	resp := []bson.M{}
	err := pipe.All(&resp)

	common.CheckError(c, err)
	c.JSON(http.StatusOK, resp)
}
