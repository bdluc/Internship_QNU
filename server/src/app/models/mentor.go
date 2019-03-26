package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionMentor = "mentor"
)

type Mentor struct {
	ID           bson.ObjectId `bson:"_id,omitempty"`
	Name         string        `bson:"Name"`
	PhoneNumber  string        `bson:"PhoneNumber"`
	Email        string        `bson:"Email"`
	Gender       bool          `bson:"Gender"` //true: Male, false: Female
	DoB          time.Time     `bson:"DayofBirth"`
	Department   string        `bson:"Department"`
	SupervisorID bson.ObjectId `bson:"SupervisorID"`
	//CourseIDs    []bson.ObjectId `bson:"CourseIDs"`
	IsDeleted bool `bson:"IsDeleted"` // true: deleted, false: not
}
