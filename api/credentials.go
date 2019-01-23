package api

import (
	"encoding/json"
	"errors"
	"strconv"

	"github.com/mjarkk/wotnlclans/other"

	"github.com/mjarkk/wotnlclans/db"
)

// CheckToken checks a user token
func CheckToken(status, playerID, nickname, playerAccessToken string) (user db.User, token string, err error) {
	if status != "ok" {
		return db.User{}, "", errors.New("Wargaming popup status not \"ok\"")
	}
	rawOut, err := CallRoute("playerInfoLogedIn", map[string]string{
		"playerID":          playerID,
		"playerAccessToken": playerAccessToken,
	})
	if err != nil {
		return db.User{}, "", other.NewErr("can't fetch user information", err)
	}
	var out PlayerInfoLogedIn
	json.Unmarshal([]byte(rawOut), &out)
	if out.Status != "ok" {
		return db.User{}, "", errors.New("Wargaming userinfo status is not oke")
	}
	APIUser, ok := out.Data[playerID]
	if !ok {
		return db.User{}, "", errors.New(playerID + " is not inside output data")
	}
	if APIUser.NickName != nickname {
		return db.User{}, "", errors.New("Nicknames are not the same")
	}

	playerIDInt, err := strconv.ParseInt(playerID, 10, 64)
	if err != nil {
		return db.User{}, "", other.NewErr("Error while transforming userID from string to INT", err)
	}

	user, err = db.GetUser(int(playerIDInt), true, db.User{
		NickName: nickname,
		Rights:   "user",
		UserID:   int(playerIDInt),
		Tokens:   map[string]db.UserToken{},
	})
	if err != nil {
		return db.User{}, "", other.NewErr("Can't get user data", err)
	}

	token, err = user.GetToken()
	if err != nil {
		return db.User{}, "", other.NewErr("user.GetToken failed", err)
	}

	return user, token, nil
}
