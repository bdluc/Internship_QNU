package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionExamination = "examination"
)

type Examination struct {
	ID         bson.ObjectId `bson:"_id,omitempty"`
	Name       string        `bson:"Name"`
	Date       time.Time     `bson:"DayofBirth"`
	Department string        `bson:"Department"`
	IsDeleted  bool          `bson:"IsDeleted"` // true: deleted, false: not

}
