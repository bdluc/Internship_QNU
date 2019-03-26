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
	TraineeId bson.ObjectId `bson:"TraineeId"`
	Status    string        `bson:"Status"`
	IsDeleted bool          `bson:"IsDeleted"` // true: deleted, false: not
}
