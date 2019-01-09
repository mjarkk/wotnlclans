package db

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/mjarkk/wotnlclans/other"

	"github.com/mongodb/mongo-go-driver/bson"
	"github.com/mongodb/mongo-go-driver/mongo"

	sr "github.com/tuvistavie/securerandom"
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
		return other.NewErr("mongo.Connect", err)
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		return other.NewErr("client.Ping", err)
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
	collection.Drop(context.Background())
	collection.InsertMany(context.Background(), toInsert)
}

// GetCurrentClansData returns all clan data
func GetCurrentClansData() ([]ClanStats, error) {
	collection := DB.Collection("currentStats")
	cur, err := collection.Find(context.Background(), bson.M{"tag": bson.M{"$exists": true}})
	toReturn := []ClanStats{}
	if err != nil {
		return toReturn, other.NewErr("log 1", err)
	}
	defer cur.Close(context.Background())
	for cur.Next(context.Background()) {
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
	collection.Drop(context.Background())
	_, err := collection.InsertMany(context.Background(), toInsert)
	return err
}

// GetUser returns the data of a spesific user or creates one
func GetUser(id int, canCreateNew bool, newUser ...User) (User, error) {
	if canCreateNew && len(newUser) != 1 {
		return User{}, errors.New("newUser must be defined as 1 argument")
	}
	collection := DB.Collection("users")
	res := collection.FindOne(context.Background(), bson.M{"userid": id})
	err := res.Err()
	if err != nil {
		fmt.Println("FindOne error:", err.Error())
		return User{}, err
	}

	var toReturn User
	err = res.Decode(&toReturn)

	if err != nil && canCreateNew {
		_, err = collection.InsertOne(context.Background(), newUser[0])
		if err != nil {
			return User{}, err
		}
		return newUser[0], nil
	}
	if err != nil {
		fmt.Println("DecodeBytes error:", err.Error())
		return User{}, err
	}

	return toReturn, nil
}

// UpdateInDB can update a user in the database
func (u *User) UpdateInDB() error {
	if u.UserID < 1000 {
		return errors.New("A user id cannot be less than 1000")
	}
	collection := DB.Collection("users")
	collection.FindOneAndReplace(context.Background(), bson.M{"userid": u.UserID}, u)
	return nil
}

// GetToken returns a valid token to use for a user
func (u *User) GetToken(nois ...string) (WGToken string, err error) {
	toReturn := ""
	currentTime := time.Now()

	for key, tokenItem := range u.Tokens {
		parsedTime, err := time.Parse(time.RFC3339, tokenItem.ValidTo)
		if err != nil {
			delete(u.Tokens, key)
			continue
		}
		if parsedTime.UnixNano() < currentTime.UnixNano() {
			delete(u.Tokens, key)
			continue
		}
		if parsedTime.UnixNano() > currentTime.Add(time.Hour*24*3).UnixNano() {
			toReturn = key
			tokenItem.LastUsed = currentTime.Format(time.RFC3339)
			u.Tokens[key] = tokenItem
			break
		}
	}

	if len(toReturn) == 0 {
		token, err := sr.UrlSafeBase64(30, true)
		if err != nil {
			return "", other.NewErr("Base64 random string error", err)
		}
		u.Tokens[token] = UserToken{
			Key:      token,
			LastUsed: currentTime.Format(time.RFC3339),
			ValidTo:  currentTime.Add(time.Hour * 24 * 7).Format(time.RFC3339), // max 1 week
		}
		toReturn = token
	}
	err = u.UpdateInDB()
	return toReturn, err
}
