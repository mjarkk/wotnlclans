package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/mjarkk/wotclans/db"
	"github.com/mjarkk/wotclans/other"
)

// SetupAPI sets up the api for fetching data from the wargaming api
func SetupAPI() error {
	err := CheckAPI()
	if err != nil {
		return err
	}
	flags := other.GetFlags()
	config := other.GetConfig()

	fmt.Println("setting up the api...")
	if len(config.WargamingKey) == 0 {
		return errors.New("No wargaming api key defined use `./wotnlclans -help` to get more info")
	}
	fmt.Println("Running api...")
	GetIcons()
	clanIds := db.GetClanIDs()
	if len(clanIds) == 0 || flags.ForceStartupIndexing {
		err := SearchForClanIds(flags, config, true)
		if err != nil {
			fmt.Println("ERROR: [SearchForClanIds]:", err.Error())
			return err
		}
	} else {
		GetClanData(config.WargamingKey, clanIds)
	}
	GetIcons()
	RunSchedule()

	return nil
}

// RunSchedule runs GetClanData every few hours
func RunSchedule() {
	go func() {
		count := 0
		for {
			time.Sleep(time.Hour * 4)
			count++
			config := other.GetConfig()
			if count == 12 {
				count = 0
				err := SearchForClanIds(other.GetFlags(), config, false)
				if err != nil {
					apiErr("RunSchedule", err, "error check SearchForClanIds")
					other.DevPrint("ERROR: [SearchForClanIds]:", err.Error())
				}
			} else {
				err := GetClanData(config.WargamingKey)
				if err != nil {
					apiErr("RunSchedule", err, "error check GetClanData")
					other.DevPrint("ERROR: [GetClanData]:", err.Error())
				}
			}
			GetIcons()
		}
	}()
}

func apiErr(functionName string, err error, meta ...string) {
	if err == nil {
		return
	}
	insertMeta := ""
	if len(meta) > 0 {
		insertMeta = meta[0]
	}
	fmt.Println("Recived ERROR (API."+functionName+"):", err.Error(), insertMeta)
}

// SearchForClanIds searches through all clans for dutch clans and after that saves them in the database
func SearchForClanIds(flags other.FlagsType, config other.ConfigType, isInit bool) error {
	if isInit && flags.SkipStartupIndexing {
		return nil
	}

	clans, err := GetAllClanIds(flags, config)
	if err != nil {
		return err
	}

	other.DevPrint("Fetched", len(clans), "clan ids")
	clans = FilterOutClans(clans, config.WargamingKey)
	other.DevPrint("Filtered out all dutch clans,", len(clans), "clans")
	// TODO: Removes blacklisted clans and add extra clans to the clans list
	clans = RemovedDuplicates(clans)
	other.DevPrint("Removed all duplicate clans")
	db.SetClanIDs(clans)

	// when this is ran for the first time make sure to get clan list
	GetClanData(config.WargamingKey, clans)

	return nil
}

// GetClanDataTry is a helper function that retries when the api reports on invalid clan IDs
func GetClanDataTry(chunk []string, toExclude []string, key string) (ClanData, ClanRating, []string, error) {
	chunk = other.RemoveAllQuotes(chunk)
	toInclude := map[string]string{"clanID": strings.Join(chunk, "%2C")}

	var info ClanData
	infoOut, err := CallRoute("clanData", toInclude, key)
	if err != nil {
		return ClanData{}, ClanRating{}, []string{}, err
	}
	json.Unmarshal([]byte(infoOut), &info)

	var rating ClanRating
	ratingOut, err := CallRoute("clanRating", toInclude, key)
	if err != nil {
		return ClanData{}, ClanRating{}, []string{}, err
	}
	json.Unmarshal([]byte(ratingOut), &rating)

	if info.Status != "ok" || rating.Status != "ok" {
		if info.Error.Field == "clan_id" && info.Error.Message == "INVALID_CLAN_ID" {
			newChunk := []string{}
			toExclude := append(toExclude, strings.Split(info.Error.Value, ",")...)
			for _, clanID := range chunk {
				canAdd := true
				for _, item := range toExclude {
					if item == clanID {
						canAdd = false
					}
				}
				if canAdd {
					newChunk = append(newChunk, clanID)
				}
			}
			return GetClanDataTry(newChunk, toExclude, key)
		}
		toReturnError := errors.New("Clans info message: " + info.Error.Message + ", Clans rating message: " + rating.Error.Message)
		return ClanData{}, ClanRating{}, []string{}, toReturnError
	}

	if len(info.Data) != len(rating.Data) {
		return ClanData{}, ClanRating{}, []string{}, errors.New("No clans in response")
	}

	return info, rating, toExclude, nil
}

// GetClanData returns all needed information about clans
// includedClans is not required
func GetClanData(key string, includedClans ...[]string) error {
	clanIDs := []string{}
	if len(includedClans) > 0 && len(includedClans[0]) > 0 {
		clanIDs = includedClans[0]
	} else {
		clanIDs = db.GetClanIDs()
	}

	blockedClans := db.GetBlockedClans()
	extraClans := db.GetExtraClans()

	extraAddClans := make([]bool, len(extraClans))
	for i := range extraAddClans {
		extraAddClans[i] = true
	}

	for _, clanID := range clanIDs {
		delete(extraClans, clanID)
	}
	for id := range extraClans {
		clanIDs = append(clanIDs, id)
	}

	toSave := []db.ClanStats{}
	toFetch := SplitToChucks(clanIDs)

	for _, chunk := range toFetch {
		info, rating, clansToRemoveFromIDs, err := GetClanDataTry(chunk, []string{}, key)

		if err != nil {
			apiErr("GetClanData", err, "error check GetClanDataTry")
			continue
		}
		db.RemoveClanIDs(clansToRemoveFromIDs)

	intoDBLoop:
		for id := range info.Data {
			cInfo := info.Data[id]
			cRating := rating.Data[id]
			_, isBlocked := blockedClans[id]

			if len(cInfo.Tag) < 2 {
				continue intoDBLoop
			}
			toSave = append(toSave, db.ClanStats{
				Blocked:     isBlocked,
				Tag:         cInfo.Tag,
				Name:        cInfo.Name,
				Color:       cInfo.Color,
				Members:     cInfo.MembersCount,
				Description: cInfo.DescriptionHTML,
				Motto:       cInfo.Motto,
				ID:          id,
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
					ID:                 id,
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
func FilterOutClans(clanList []string, key string) []string {
	tofetch := SplitToChucks(clanList)
	toReturn := []string{}
	for _, ids := range tofetch {
		rawOut, err := CallRoute("clanDiscription", map[string]string{"clanID": strings.Join(ids, "%2C")}, key) // %2C = ,
		if err != nil {
			apiErr("FilterOutClans", err, "error check CallRoute")
			continue
		}
		var out ClanDiscription
		json.Unmarshal([]byte(rawOut), &out)
		if out.Status != "ok" {
			apiErr("FilterOutClans", errors.New(out.Error.Message), "api status is not OK json.Unmarshal")
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
func GetAllClanIds(flags other.FlagsType, config other.ConfigType) ([]string, error) {
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
		}, config.WargamingKey)

		err = json.Unmarshal([]byte(outString), &out)
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
