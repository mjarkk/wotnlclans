package api

import (
	"encoding/json"
	"errors"

	"github.com/mjarkk/wotclans/other"
)

// CheckAPI checks if the key is valid and if there are no other errors
func CheckAPI(config other.FlagsAndConfig) error {
	rawOut, err := CallRoute("nicknameAndClan", map[string]string{"playerID": "516673968"}, config.WargamingKey)
	if err != nil {
		return err
	}

	var output NicknameAndClan
	json.Unmarshal([]byte(rawOut), &output)

	if output.Status != "ok" {
		return errors.New("api returned error: " + output.Error.Message)
	}
	return nil
}
