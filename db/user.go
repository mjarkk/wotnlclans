package db

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/mjarkk/wotnlclans/other"
	"github.com/mongodb/mongo-go-driver/bson"
	sr "github.com/tuvistavie/securerandom"
)

// IsLogedIN returns true if the user is logged in
func IsLogedIN(userID, key string) (bool, User) {
	if len(userID) == 0 || len(key) == 0 {
		return false, User{}
	}
	user, err := GetUserString(userID, false)
	if err != nil {
		return false, User{}
	}

	currentTime := time.Now()

	for token, tokenItem := range user.Tokens {
		if token == key {
			parsedTime, err := time.Parse(time.RFC3339, tokenItem.ValidTo)
			if err != nil {
				continue
			}
			if parsedTime.UnixNano() < currentTime.UnixNano() {
				delete(user.Tokens, token)
				user.UpdateInDB()
				return false, User{}
			}
			return true, user
		}
	}

	return false, User{}
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

// GetUserString this is mostly the same as GetUser except with this one it's possible to use a string as id
func GetUserString(id string, canCreateNew bool, newUser ...User) (User, error) {
	idInt64, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return User{}, errors.New("can't convert userID string to Int")
	}
	return GetUser(int(idInt64), canCreateNew, newUser...)
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

// IsAdmin returns true if the user has admin rights
func (u *User) IsAdmin() bool {
	return u.Rights == "admin"
}
