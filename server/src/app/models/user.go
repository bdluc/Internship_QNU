package models

import "gopkg.in/mgo.v2/bson"

//User :binding from JSON data
const (
	CollectionUser = "user"
)

type User struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	UserName  string        `bson:"UserName"`
	Password  string        `bson:"Password"`
	Role      int           `bson:"Role"` //1:Trainee, 2:Mentor, 3:Sup
	RoleID    bson.ObjectId `bson:"RoleId"`
	IsDeleted bool          `bson:"IsDeleted"` // true: deleted, false: no
}
