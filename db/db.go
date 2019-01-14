package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/mjarkk/wotnlclans/other"

	"github.com/mongodb/mongo-go-driver/bson"
	"github.com/mongodb/mongo-go-driver/mongo"
)

// DB is the mongodb database
var DB *mongo.Database

// Setup connect to a database
func Setup() error {
	fmt.Println("Trying to connect to mongodb...")
	mongoUIR := other.Flags.MongoUIR
	mongoDataBase := other.Flags.MongoDataBase
	if len(mongoUIR) == 0 {
		return errors.New("Mongodb url not defined use `./wotnlclans -help` for more information")
	}
	if len(mongoDataBase) == 0 {
		return errors.New("Mongodb database not defined use `./wotnlclans -help` for more information")
	}
	client, err := mongo.Connect(C(), mongoUIR)
	if err != nil {
		return other.NewErr("mongo.Connect", err)
	}
	err = client.Ping(C(), nil)
	if err != nil {
		return other.NewErr("client.Ping", err)
	}

	DB = client.Database(mongoDataBase)
	fmt.Println("Connected to MongoDB!")
	return nil
}

// C returns a context
func C() context.Context {
	return context.Background()
}

// GetClanIDs returns the clans ids that where found after searching for new clans
func GetClanIDs() []string {
	collection := DB.Collection("clanIDs")
	cur, err := collection.Find(C(), nil)
	if err != nil {
		return []string{}
	}

	toReturn := []string{}

	defer cur.Close(C())
	for cur.Next(C()) {
		raw, err := cur.DecodeBytes()
		if err != nil {
			continue
		}
		// Background: do something with output
		els, err := raw.Elements()
		if err != nil {
			continue
		}
		for _, dat := range els {
			key := dat.Key()
			if key == "id" {
				toReturn = append(toReturn, dat.Value().String())
			}
		}
	}

	return toReturn
}

// SetClanIDs saves a list of clan id's in the database
func SetClanIDs(toSave []string) {
	toInsert := make([]interface{}, len(toSave))
	for i, item := range toSave {
		toInsert[i] = struct{ ID string }{
			ID: item,
		}
	}
	collection := DB.Collection("clanIDs")
	collection.Drop(C())
	collection.InsertMany(C(), toInsert)
}

// GetCurrentClansData returns all clan data
func GetCurrentClansData() ([]ClanStats, error) {
	collection := DB.Collection("currentStats")
	cur, err := collection.Find(C(), bson.M{"tag": bson.M{"$exists": true}})
	toReturn := []ClanStats{}
	if err != nil {
		return toReturn, other.NewErr("log 1", err)
	}
	defer cur.Close(C())
	for cur.Next(C()) {
		var toAdd ClanStats
		err := cur.Decode(&toAdd)
		if err != nil {
			return toReturn, other.NewErr("log 2", err)
		}
		toReturn = append(toReturn, toAdd)
	}

	return toReturn, nil
}

// SetCurrentClansData saves the latest clan data in the database
func SetCurrentClansData(stats []ClanStats) error {
	if len(stats) == 0 {
		return errors.New("SetCurrentClansData got a empty array")
	}
	toInsert := make([]interface{}, len(stats))
	toInsertHistory := make([]interface{}, len(stats))
	for i, item := range stats {
		toInsert[i] = item
		toInsertHistory[i] = item.Stats
	}
	collection := DB.Collection("currentStats")
	collection.Drop(C())
	_, err := collection.InsertMany(C(), toInsert)
	return err
}
