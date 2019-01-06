package db

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/mjarkk/wotnlclans/other"

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
	client, err := mongo.Connect(context.Background(), mongoUIR)
	if err != nil {
		return err
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		return err
	}

	DB = client.Database(mongoDataBase)
	fmt.Println("Connected to MongoDB!")
	return nil
}

// GetClanIDs returns the clans ids that where found after searching for new clans
func GetClanIDs() []string {
	collection := DB.Collection("clanIDs")
	cur, err := collection.Find(context.Background(), nil)
	if err != nil {
		return []string{}
	}

	toReturn := []string{}

	defer cur.Close(context.Background())
	for cur.Next(context.Background()) {
		raw, err := cur.DecodeBytes()
		if err != nil {
			log.Fatal(err)
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
	collection.Drop(context.Background())
	collection.InsertMany(context.Background(), toInsert)
}

// GetCurrentClansData returns all clan data
func GetCurrentClansData() ([]ClanStats, error) {
	collection := DB.Collection("currentStats")
	cur, err := collection.Find(context.Background(), nil)
	toReturn := []ClanStats{}
	if err != nil {
		return toReturn, errors.New("log 1: " + err.Error())
	}
	defer cur.Close(context.Background())
	for cur.Next(context.Background()) {
		var toAdd ClanStats
		err := cur.Decode(&toAdd)
		if err != nil {
			return toReturn, err
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
	collection.Drop(context.Background())
	_, err := collection.InsertMany(context.Background(), toInsert)
	return err
}
