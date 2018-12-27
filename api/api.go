package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/mjarkk/wotnlclans/db"
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
	clanIds := db.GetClanIDs()
	if len(clanIds) == 0 {
		err := SearchForClanIds(flags, true)
		if err != nil {
			other.DevPrint("ERROR: [SearchForClanIds]:", err.Error())
		}
	} else {
		other.DevPrint("Skipping searching for clans")
		GetClanData(clanIds)
	}
	GetIcons()

	RunSchedule()

	return nil
}

// RunSchedule runs GetClanData every view hours
func RunSchedule() {
	go func() {
		count := 0
		for {
			time.Sleep(time.Hour * 4)
			count++
			if count == 12 {
				count = 0
				err := SearchForClanIds(other.Flags, false)
				if err != nil {
					other.DevPrint("ERROR: [SearchForClanIds]:", err.Error())
				}
			} else {
				err := GetClanData()
				if err != nil {
					other.DevPrint("ERROR: [GetClanData]:", err.Error())
				}
			}
			GetIcons()
		}
	}()
}

// SearchForClanIds searches through all clans for dutch clans and after that saves them in the database
func SearchForClanIds(flags other.FlagsType, isInit bool) error {
	if isInit && flags.SkipStartupIndexing {
		return nil
	}

	clans, err := GetAllClanIds(flags)
	if err != nil {
		return err
	}

	other.DevPrint("Fetched", len(clans), "clan ids")
	clans = FilterOutClans(clans)
	other.DevPrint("Filtered out all dutch clans,", len(clans), "clans")
	// TODO: Remove blacklisted clans and add extra clans to the clans list
	clans = RemovedDuplicates(clans)
	other.DevPrint("Removed all duplicate clans")
	db.SetClanIDs(clans)

	// when this is ran for the first time make sure to get clan list
	GetClanData(clans)

	return nil
}

// GetClanData returns all needed information about clans
// includedClans is not needed but if you have a database
func GetClanData(includedClans ...[]string) error {
	clans := []string{}
	if len(includedClans) > 0 && len(includedClans[0]) > 0 {
		clans = includedClans[0]
	} else {
		clans = db.GetClanIDs()
	}
	toSave := []db.ClanStats{}
	toFetch := SplitToChucks(clans)
	for _, chunk := range toFetch {
		toInclude := map[string]string{"clanID": strings.Join(chunk, "%2C")}

		var info ClanData
		infoOut, err := CallRoute("clanData", toInclude)
		if err != nil {
			continue
		}
		json.Unmarshal([]byte(infoOut), &info)

		var rating ClanRating
		ratingOut, err := CallRoute("clanRating", toInclude)
		if err != nil {
			continue
		}
		json.Unmarshal([]byte(ratingOut), &rating)

		if info.Status != "ok" || rating.Status != "ok" || len(info.Data) != len(rating.Data) {
			continue
		}

		for i := range info.Data {
			cInfo := info.Data[i]
			cRating := rating.Data[i]
			toSave = append(toSave, db.ClanStats{
				Tag:         cInfo.Tag,
				Name:        cInfo.Name,
				Color:       cInfo.Color,
				Members:     cInfo.MembersCount,
				Description: cInfo.DescriptionHTML,
				Motto:       cInfo.Motto,
				ID:          i,
				Emblems: map[string]string{
					"X256.Wowp":   cInfo.Emblems.X256.Wowp,
					"X195.Portal": cInfo.Emblems.X195.Portal,
					"X64.Portal":  cInfo.Emblems.X64.Portal,
					"X64.Wot":     cInfo.Emblems.X64.Wot,
					"X32.Portal":  cInfo.Emblems.X32.Portal,
					"X24.Portal":  cInfo.Emblems.X24.Portal,
				},
				Stats: db.HistoryClanStats{
					Tag:                cInfo.Tag,
					Name:               cInfo.Name,
					ID:                 i,
					Members:            cInfo.MembersCount,
					Battles:            cRating.BattlesCountAvg.Value,
					DailyBattles:       cRating.BattlesCountAvgDaily.Value,
					Efficiency:         cRating.Efficiency.Value,
					FbElo10:            cRating.FbEloRating10.Value,
					FbElo8:             cRating.FbEloRating8.Value,
					FbElo6:             cRating.FbEloRating6.Value,
					FbElo:              cRating.FbEloRating.Value,
					GmElo10:            cRating.GmEloRating10.Value,
					GmElo8:             cRating.GmEloRating8.Value,
					GmElo6:             cRating.GmEloRating6.Value,
					GmElo:              cRating.GmEloRating.Value,
					GlobRating:         cRating.GlobalRatingAvg.Value,
					GlobRatingWeighted: cRating.GlobalRatingWeightedAvg.Value,
					WinRatio:           cRating.WinsRatioAvg.Value,
					V10l:               cRating.V10lAvg.Value,
				},
			})
		}
	}
	db.SetCurrentClansData(toSave)
	return nil
}

// DutchWords is a list of words and small setences that are usualy in dutch clan descriptions
var DutchWords = []string{
	"verplicht", "menselijkheid", "pannenkoeken", "leeftijd", "minimale", "opzoek", "beginnende", "nederlandse", "spelers", "voldoen", "wij zijn", "gezelligheid", "ons op", "Kom erbij", "minimaal", "gemiddelde", "plezier", "samenwerking", "samenwerken", "aangezien", "toegelaten", "goedkeuring", "gebruik", "tijdens",
}

// BannedWords is a list of words that do usualy not exsits in a dutch clan descriptions
var BannedWords = []string{
	"équipe", "jeux", "ambiance", "rigolade",
}

// IsDutch detecst dutch words in setence
func IsDutch(input string) bool {
	if len(input) == 0 {
		return false
	}
	input = strings.ToLower(input)
	returnStatus := false
	for _, word := range DutchWords {
		if strings.Contains(input, word) {
			returnStatus = true
			break
		}
	}
	for _, word := range BannedWords {
		if strings.Contains(input, word) {
			returnStatus = false
			break
		}
	}
	return returnStatus
}

// SplitToChucks splits up a input list in arrays of 100
// This makes it easy to request a lot of things at the same time from the wargaming api
func SplitToChucks(list []string) [][]string {
	toReturn := [][]string{[]string{}}
	for _, item := range list {
		if len(toReturn[len(toReturn)-1]) == 100 {
			toReturn = append(toReturn, []string{})
		}
		where := len(toReturn) - 1
		toReturn[where] = append(toReturn[where], item)
	}
	return toReturn
}

// FilterOutClans filters out all not dutch clans out of a input list
func FilterOutClans(clanList []string) []string {
	tofetch := SplitToChucks(clanList)
	toReturn := []string{}
	for _, ids := range tofetch {
		rawOut, err := CallRoute("clanDiscription", map[string]string{"clanID": strings.Join(ids, "%2C")}) // %2C = ,
		if err != nil {
			continue
		}
		var out ClanDiscription
		json.Unmarshal([]byte(rawOut), &out)
		if out.Status != "ok" {
			continue
		}
		for clanID, clan := range out.Data {
			if IsDutch(clan.Description) {
				toReturn = append(toReturn, clanID)
				other.DevPrint("found clan:", clan.Tag)
			}
		}
	}
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
