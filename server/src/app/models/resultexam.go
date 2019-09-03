package models

import (
	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionResult = "resultexamination"
)

type ResultExamination struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Row       string        `bson:"Row"`
	Value     string        `bson:"Value"`
	IsDeleted bool          `bson:"IsDeleted"`
}
