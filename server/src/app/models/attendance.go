package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionAttendance = "attendance"
)

type Attendance struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Date      time.Time     `bson:"Date"`
	InternID  bson.ObjectId `bson:"InternID"`
	Status    string        `bson:"Status"`
	IsDeleted bool          `bson:"IsDeleted"` // true: deleted, false: not
}
