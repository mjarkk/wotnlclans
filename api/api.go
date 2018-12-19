package api

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/mjarkk/wotnlclans/other"
)

// SetupAPI sets up the api for fetching data from the wargaming api
func SetupAPI() error {
	flags := other.Flags
	fmt.Println("setting up the api...")
	if len(flags.WGKey) == 0 {
		return errors.New("No wargaming api key defined use `./wotnlclans -help` to get more info")
	}
	GetDataFromAPI()
	return nil
}

// GetDataFromAPI fetches all data from the api
func GetDataFromAPI() error {
	GetAllClanIds()
	return nil
}

// GetAllClanIds returns all clan ids
func GetAllClanIds() ([]string, error) {
	ids := []string{}
	page := 0

	for {
		page++
		var out TopClans
		outString, err := CallRoute("topClans", map[string]string{
			"pageNum": fmt.Sprintf("%v", page),
		})

		json.Unmarshal([]byte(outString), &out)

		if err != nil {
			return ids, err
		}

		if out.Status != "ok" {
			return ids, errors.New(out.Error.Message)
		}

		if len(out.Data) == 0 {
			break
		}

		for _, clan := range out.Data {
			ids = append(ids, clan.ClanID)
		}

		fmt.Println(page)
	}
	return ids, nil
}
