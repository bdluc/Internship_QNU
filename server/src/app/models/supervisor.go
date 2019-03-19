package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionSupervisor = "supervisor"
)

type Supervisor struct {
	ID          bson.ObjectId `bson:"_id,omitempty"`
	Name        string        `bson:"Name"`
	PhoneNumber string        `bson:"PhoneNumber"`
	Email       string        `bson:"Email"`
	Gender      bool          `bson:"Gender"` //true: Male, false: Female
	DoB         time.Time     `bson:"DayofBirth"`
	Department  string        `bson:"Department"`
	Position    string        `bson:"Position"`
	IsDeleted   bool          `bson:"IsDeleted"` // true: deleted, false: not
}
