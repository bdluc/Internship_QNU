package controllers

import (
	"fmt"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
	"github.com/olahol/go-imageupload"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// type Image struct {
// 	ID   bson.ObjectId
// 	Name string
// 	Data []byte
// }

// // Save image to file.
// func (i *Image) Save(img string) error {
// 	return ioutil.WriteFile(img, i.Data, 0600)
// }

func UpFile(c *gin.Context) {
	img, err := imageupload.Process(c.Request, "file")
	fmt.Print(img)
	if err != nil {
		panic(err)
	}
	// thumb, err := imageupload.ThumbnailPNG(img, 300, 300)
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Print(thumb)
	// thumb.Write(c.Writer)
	// thumb.Save(fmt.Sprintf("%d.png", time.Now().Unix()))
	// c.Redirect(http.StatusMovedPermanently, "Users/Administrator/Desktop/react")

	database := c.MustGet("db").(*mgo.Database)
	image := models.Image{}
	image.ID = bson.ObjectIdHex(c.Param("id"))
	err = database.C(models.CollectionImage).Insert(image)
	if common.CheckError(c, err) {
		return
	}

}

func GetFile(c *gin.Context) {
	c.File("index.html")
}
