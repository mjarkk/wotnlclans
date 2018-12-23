package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/mjarkk/wotnlclans/other"

	"github.com/mongodb/mongo-go-driver/mongo"
)

// Setup connect to a database
func Setup() error {
	fmt.Println("Trying to connect to mongodb...")
	mongoUIR := other.Flags.MongoUIR
	if len(mongoUIR) == 0 {
		return errors.New("Mongodb url not added use `./wotnlclans -help` for more options")
	}
	client, err := mongo.Connect(context.TODO(), mongoUIR)
	if err != nil {
		return err
	}
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return err
	}
	fmt.Println("Connected to MongoDB!")
	return nil
}

// GetClanIDs returns the clans ids that where found after searching for new clans
func GetClanIDs() []string {
	return []string{}
}

// SaveClanIDs saves a list of clan id's in the database
func SaveClanIDs(toSave []string) {

}
