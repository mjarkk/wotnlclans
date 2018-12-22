package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/mjarkk/wotnlclans/other"
)

// SetupAPI sets up the api for fetching data from the wargaming api
func SetupAPI() error {
	err := CheckAPI()
	if err != nil {
		return err
	}
	flags := other.Flags
	fmt.Println("setting up the api...")
	if len(flags.WGKey) == 0 {
		return errors.New("No wargaming api key defined use `./wotnlclans -help` to get more info")
	}
	fmt.Println("Running api...")
	GetDataFromAPI(flags, true)
	return nil
}

// GetDataFromAPI fetches all data from the wargaming api
func GetDataFromAPI(flags other.FlagsType, isInit bool) error {
	if isInit && flags.SkipStartupIndexing {
		return nil
	}

	clans, err := GetAllClanIds(flags)
	if err == nil {
		other.DevPrint("Fetched", len(clans), "clan ids")
		clans = FilterOutClans(clans)
		other.DevPrint("Filtered out all dutch clans, ", len(clans), "clans")
		// TODO: Add blacklisted clans and extra clans to the clans list
		clans = RemovedDuplicates(clans)
	}

	return nil
}

// FilterOutClans gets the clan informations about the clans
func FilterOutClans(clanList []string) []string {
	tofetch := [][]string{}
	for _, id := range clanList {
		if len(tofetch) == 0 || len(tofetch[len(tofetch)-1]) == 100 {
			tofetch = append(tofetch, []string{})
		}
		where := len(tofetch) - 1
		tofetch[where] = append(tofetch[where], id)
	}
	toReturn := []string{}
	for _, ids := range tofetch {
		rawOut, err := CallRoute("clanDiscription", map[string]string{"clanID": strings.Join(ids, "%2C")}) // %2C = ,
		if err != nil {
			continue
		}
		var out ClanDiscription
		json.Unmarshal([]byte(rawOut), &out)
		fmt.Println(out)
	}
	// for i, clanID := range clanList {
	// 	rawOut, err := CallRoute("clanDiscription", map[string]string{"clanID": clanID})
	// 	if err != nil {
	// 		continue
	// 	}
	// 	fmt.Println(i, rawOut)
	// 	toReturn = append(toReturn, clanID)
	// }
	return toReturn
}

// RemovedDuplicates removes duplicates from an array
func RemovedDuplicates(input []string) (output []string) {
	output = []string{}
	for _, inputItem := range input {
		exsists := false
	checkArr:
		for _, outputItem := range output {
			if inputItem == outputItem {
				exsists = true
				break checkArr
			}
		}
		if !exsists {
			output = append(output, inputItem)
		}
	}
	return output
}

// GetAllClanIds returns all clan ids
func GetAllClanIds(flags other.FlagsType) ([]string, error) {
	ids := []string{}
	page := 0

	for {
		page++
		if page > flags.MaxIndexPages {
			break
		}
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
			ids = append(ids, fmt.Sprintf("%v", clan.ClanID))
		}

		if page%10 == 1 {
			other.DevPrint("Fetched", len(ids), "Clans")
		}
	}
	return ids, nil
}
