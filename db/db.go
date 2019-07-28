package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/mjarkk/wotnlclans/other"
	"go.mongodb.org/mongo-driver/mongo/options"

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
	client, err := mongo.Connect(C(), options.Client().ApplyURI(mongoUIR))
	if err != nil {
		return other.NewErr("mongo.Connect", err)
	}
	err = client.Ping(C(), nil)
	if err != nil {
		return other.NewErr("client.Ping", err)
	}

	DB = client.Database(mongoDataBase)
	fmt.Println("Connected to MongoDB!")

	go sortClanIds()

	return nil
}

// C returns a context
func C() context.Context {
	return context.Background()
}

// RemoveClanIDs removes the "toRemove" from the clan IDs collection
func RemoveClanIDs(toRemove []string) {
	if len(toRemove) == 0 {
		return
	}
	toRemovedParsed := other.RemoveQuotes(toRemove)

	collection := DB.Collection("clanIDs")
	collection.DeleteMany(C(), bson.M{"id": bson.M{"$in": toRemovedParsed}})

	collection = DB.Collection("extraClans")
	collection.DeleteMany(C(), bson.M{"id": bson.M{"$in": toRemovedParsed}})
}

// GetClanIDs returns the clans ids that where found after searching for new clans
func GetClanIDs() []string {
	collection := DB.Collection("clanIDs")
	cur, err := collection.Find(C(), bson.M{})
	if err != nil {
		return []string{}
	}

	toReturn := []string{}

	defer cur.Close(C())
	for cur.Next(C()) {
		var item ClanID
		err := cur.Decode(&item)
		if err != nil {
			continue
		}
		toReturn = append(toReturn, item.ID)
	}

	return other.RemoveQuotes(toReturn)
}

// ClanID is the collection type for the clan IDs
type ClanID struct {
	ID string `bson:"id"`
}

// SetClanIDs saves a list of clan id's in the database
func SetClanIDs(toSave []string) {
	toInsert := make([]interface{}, len(toSave))
	for i, item := range toSave {
		toInsert[i] = ClanID{
			ID: item,
		}
	}
	collection := DB.Collection("clanIDs")
	collection.Drop(C())
	collection.InsertMany(C(), toInsert)
}
