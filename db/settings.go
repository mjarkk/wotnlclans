package db

import (
	"fmt"
	"strconv"

	"github.com/mongodb/mongo-go-driver/bson"
)

// BlockedClans is a list of blocked clans
type BlockedClans []string

// ExtraClans is a list of extra clans
type ExtraClans []string

// BlockedClanDB is what a database entery contains
type BlockedClanDB struct {
	ID int `json:"id"`
}

// ExtraClanDB is what a database entery contains
type ExtraClanDB struct {
	ID int `json:"id"`
}

// PostBlockedClans is post data type for the web server
type PostBlockedClans struct {
	UserID  string       `json:"userID"`
	UserKey string       `json:"userKey"`
	Clans   BlockedClans `json:"clans"`
}

// PostExtraClans is post data type for the web server
type PostExtraClans struct {
	UserID  string     `json:"userID"`
	UserKey string     `json:"userKey"`
	Clans   ExtraClans `json:"clans"`
}

// GetExtraClans retruns a list of extra clans from the database
func GetExtraClans() (ExtraClans, error) {
	toReturn := ExtraClans{}
	collection := DB.Collection("extraClans")

	cur, err := collection.Find(C(), bson.M{"id": bson.M{"$exists": true}})
	if err != nil {
		return toReturn, err
	}

	defer cur.Close(C())
	for cur.Next(C()) {
		var toAdd BlockedClanDB
		err := cur.Decode(&toAdd)
		if err != nil {
			return toReturn, err
		}
		toReturn = append(toReturn, fmt.Sprintf("%v", toAdd.ID))
	}

	return toReturn, nil
}

// GetBlockedClans retruns a list of blocked clans from the database
func GetBlockedClans() (BlockedClans, error) {
	toReturn := BlockedClans{}
	collection := DB.Collection("blockedClans")

	cur, err := collection.Find(C(), bson.M{"id": bson.M{"$exists": true}})
	if err != nil {
		return toReturn, err
	}

	defer cur.Close(C())
	for cur.Next(C()) {
		var toAdd BlockedClanDB
		err := cur.Decode(&toAdd)
		if err != nil {
			return toReturn, err
		}
		toReturn = append(toReturn, fmt.Sprintf("%v", toAdd.ID))
	}

	return toReturn, nil
}

// UpdateInDB updates the blocked clans list in the database
func (c *BlockedClans) UpdateInDB() error {
	collection := DB.Collection("blockedClans")
	collection.Drop(C())
	toInsert := make([]interface{}, len(*c))
	for i, item := range *c {
		idInt, err := strconv.ParseInt(item, 10, 64)
		if err != nil {
			return err
		}
		toInsert[i] = BlockedClanDB{
			ID: int(idInt),
		}
	}
	collection.InsertMany(C(), toInsert)
	return nil
}

// UpdateInDB updates the blocked clans list in the database
func (c *ExtraClans) UpdateInDB() error {
	collection := DB.Collection("extraClans")
	collection.Drop(C())
	toInsert := make([]interface{}, len(*c))
	for i, item := range *c {
		idInt, err := strconv.ParseInt(item, 10, 64)
		if err != nil {
			return err
		}
		toInsert[i] = ExtraClanDB{
			ID: int(idInt),
		}
	}
	collection.InsertMany(C(), toInsert)
	return nil
}
