package models

import (
	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionImage = "image"
)

type Image struct {
	ID   bson.ObjectId `bson:"_id,omitempty"`
	Name string        `bson:"Name"`
	Data []byte        `bson:"Data"`
}
