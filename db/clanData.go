package db

import (
	"errors"
	"strings"

	"github.com/mjarkk/wotnlclans/other"
	"github.com/mongodb/mongo-go-driver/bson"
)

// ClanNameAndTags is a list of all clan info this can be used for search
var ClanNameAndTags = map[string]ClanNameAndTag{}

// refillClanNameAndTags places data in the ClanNameAndTags var
func refillClanNameAndTags() error {
	clans, err := GetCurrentClansData()
	if err != nil {
		return err
	}

	ClanNameAndTags = map[string]ClanNameAndTag{}
	for _, clan := range clans {
		ClanNameAndTags[clan.ID] = ClanNameAndTag{
			Name: clan.Name,
			Tag:  clan.Tag,
		}
	}

	return nil
}

// GetCurrentClansData returns all clan data
func GetCurrentClansData() ([]ClanStats, error) {
	collection := DB.Collection("currentStats")
	query := bson.M{
		"tag":     bson.M{"$exists": true, "$ne": ""},
		"members": bson.M{"$gt": 1},
		"blocked": false,
	}
	cur, err := collection.Find(C(), query)
	toReturn := []ClanStats{}
	if err != nil {
		return toReturn, other.NewErr("collection.Find", err)
	}
	defer cur.Close(C())
	for cur.Next(C()) {
		var toAdd ClanStats
		err := cur.Decode(&toAdd)
		if err != nil {
			return toReturn, other.NewErr("cur.Decode", err)
		}
		toReturn = append(toReturn, toAdd)
	}

	return toReturn, nil
}

// GetCurrentClansByID filter the list with spesific IDs
func GetCurrentClansByID(ids ...string) ([]ClanStats, error) {
	toReturn := []ClanStats{}
	if len(ids) > 200 {
		return toReturn, errors.New("To menny id's")
	}
	if len(ids) == 0 {
		return toReturn, nil
	}
	clans, err := GetCurrentClansData()
	if err != nil {
		return toReturn, err
	}
	for _, clan := range clans {
		for _, id := range ids {
			if clan.ID == id {
				toReturn = append(toReturn, clan)
			}
		}
	}
	return toReturn, nil
}

// CurrentDefaultFiltered returnes the default filtered item
func CurrentDefaultFiltered() string {
	return "efficiency"
}

// GetCurrentClansTop returns the top of some amound of clans
func GetCurrentClansTop(maxAmound int) ([]ClanStats, error) {
	toReturn := make([]ClanStats, len(SortedRating))
	clansMapped := map[string]ClanStats{}

	clans, err := GetCurrentClansData()
	if err != nil {
		return toReturn, err
	}

	for _, clan := range clans {
		clansMapped[clan.ID] = clan
	}

	for clanID, positions := range SortedRating {
		toReturn[positions.Efficiency] = clansMapped[clanID]
	}

	toReturnWithMax := []ClanStats{}

	for i, item := range toReturn {
		if i >= maxAmound {
			break
		}
		toReturnWithMax = append(toReturnWithMax, item)
	}

	return toReturnWithMax, nil
}

// SetCurrentClansData saves the latest clan data in the database
func SetCurrentClansData(stats []ClanStats) error {
	filteredStats := []ClanStats{}

	for _, stat := range stats {
		if len(stat.ID) > 1 && len(stat.Tag) > 1 {
			filteredStats = append(filteredStats, stat)
		}
	}

	if len(filteredStats) == 0 {
		return errors.New("SetCurrentClansData got a empty array")
	}
	toInsert := make([]interface{}, len(filteredStats))
	toInsertHistory := make([]interface{}, len(filteredStats))
	for i, item := range filteredStats {
		toInsert[i] = item
		toInsertHistory[i] = item.Stats
	}
	collection := DB.Collection("currentStats")
	collection.Drop(C())
	_, err := collection.InsertMany(C(), toInsert)

	sortClanIds()
	refillClanNameAndTags()

	return err
}

// SearchClans returns the top 20 found using a search query
func SearchClans(query, sortOn string) ([]string, error) {
	toReturn := []string{}

	if sortOn == "all" {
		return toReturn, errors.New("Can't filter on \"all\"")
	}
	sortedRatingsByTagRaw, err := LightClanPositions(sortOn)
	if err != nil {
		return toReturn, err
	}
	sortedRatingsByTag := sortedRatingsByTagRaw["actualData"].(map[string]int)
	sorted := make([]string, len(sortedRatingsByTag))
	for clanID, pos := range sortedRatingsByTag {
		sorted[pos] = clanID
	}

	for _, clanID := range sorted {
		clanNameAndTag, ok := ClanNameAndTags[clanID]
		if !ok {
			continue
		}

		formattedQuery := strings.Replace(
			strings.Replace(
				strings.Replace(
					strings.ToLower(query),
					"1",
					"i",
					-1,
				),
				"3",
				"e",
				-1,
			),
			"0",
			"o",
			-1,
		)
	checkList:
		for _, check := range []string{clanNameAndTag.Name, clanNameAndTag.Tag} {
			if strings.Contains(strings.ToLower(check), formattedQuery) {
				toReturn = append(toReturn, clanID)
				break checkList
			}
		}
		if len(toReturn) == 20 {
			break
		}
	}

	return toReturn, nil
}
