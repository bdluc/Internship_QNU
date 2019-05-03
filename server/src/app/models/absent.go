package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionAbsent = "absent"
)

type Absent struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Message   string        `bson:"Message"`
	Date      time.Time     `bson:"Date"`
	InternID  bson.ObjectId `bson:"InternID"`
	Status    int           `bson:"Status"` // 1 : sent , 2 : sent & have denied, 3 : sent & have agreed
	IsDeleted bool          `bson:"IsDeleted"`
}
