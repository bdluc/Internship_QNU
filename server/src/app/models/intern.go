package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionIntern = "intern"
)

type Intern struct {
	ID          bson.ObjectId `bson:"_id,omitempty"`
	Name        string        `bson:"Name"`
	PhoneNumber string        `bson:"PhoneNumber"`
	Email       string        `bson:"Email"`
	Gender      bool          `bson:"Gender"` //true: Male, false: Female
	DoB         time.Time     `bson:"DayofBirth"`
	University  string        `bson:"University"`
	Faculty     string        `bson:"Faculty"`
	CourseID    bson.ObjectId `bson:"CourseID,omitempty"`
	IsDeleted   bool          `bson:"IsDeleted"` // true: deleted, false: not
}
