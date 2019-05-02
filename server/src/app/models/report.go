package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	CollectionReport = "report"
)

type Report struct {
	Subject string
	Body    string
}
type ReportDetail struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Subject   string        `bson:"Subject"`
	Body      string        `bson:"Body"`
	Date      time.Time     `bson:"Date"`
	InternID  bson.ObjectId `bson:"InternID"`
	Type      int           `bson:"Type"` // 1 : report per day , 2 : report per week , 3 : report per month
	IsDeleted bool          `bson:"IsDeleted"`
}
