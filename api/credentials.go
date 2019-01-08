package api

import (
	"encoding/json"
	"errors"
	"strconv"

	"github.com/mjarkk/wotnlclans/other"

	"github.com/mjarkk/wotnlclans/db"
)

// CheckToken checks a user token
func CheckToken(status, playerID, nickname, playerAccessToken string) (db.User, error) {
	if status != "ok" {
		return db.User{}, errors.New("Wargaming popup status not oke")
	}
	rawOut, err := CallRoute("playerInfoLogedIn", map[string]string{
		"playerID":          playerID,
		"playerAccessToken": playerAccessToken,
	})
	if err != nil {
		return db.User{}, other.NewErr("can't fetch user information", err)
	}
	var out PlayerInfoLogedIn
	json.Unmarshal([]byte(rawOut), &out)
	if out.Status != "ok" {
		return db.User{}, errors.New("Wargaming userinfo status is not oke")
	}
	if out.Data[playerID].NickName != nickname {
		return db.User{}, errors.New("Nicknames are not the same")
	}

	playerIDInt, err := strconv.ParseInt(playerID, 10, 64)
	if err != nil {
		return db.User{}, other.NewErr("Error while transforming userID to INT", err)
	}

	user, err := db.GetUser(int(playerIDInt), true)
	if err != nil {
		return db.User{}, other.NewErr("Can't get user data:", err)
	}

	return user, nil
}
