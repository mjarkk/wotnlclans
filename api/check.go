package api

import (
	"encoding/json"
	"errors"
)

// CheckAPI checks if the key is valid and if there are no other errors
func CheckAPI() error {
	rawOut, err := CallRoute("nicknameAndClan", map[string]string{"playerID": "516673968"})
	if err != nil {
		return nil
	}

	var output NicknameAndClan
	json.Unmarshal([]byte(rawOut), &output)

	if output.Status != "ok" {
		return errors.New("api returned error: " + output.Error.Message)
	}
	return nil
}
