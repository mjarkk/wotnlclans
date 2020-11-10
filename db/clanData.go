package db

import (
	"errors"
	"strings"
	"sync"

	"github.com/mjarkk/wotclans/other"
)

// clanNameAndTags is a list of all clan info this can be used for search
var clanNameAndTagsLock sync.Mutex
var clanNameAndTags = map[string]ClanNameAndTag{}

var currentStatsLock sync.Mutex
var currentStats = map[string]ClanStats{}

// refillClanNameAndTags places data in the clanNameAndTags var
func refillClanNameAndTags() {
	clans := GetCurrentClansData()

	clanNameAndTagsLock.Lock()
	defer clanNameAndTagsLock.Unlock()

	clanNameAndTags = map[string]ClanNameAndTag{}
	for _, clan := range clans {
		clanNameAndTags[clan.ID] = ClanNameAndTag{
			Name: clan.Name,
			Tag:  clan.Tag,
		}
	}
}

// GetCurrentClansData returns all clan data
func GetCurrentClansData() map[string]ClanStats {
	currentStatsLock.Lock()
	defer currentStatsLock.Unlock()

	return currentStats
}

// GetCurrentClansByID filter the list with spesific IDs
func GetCurrentClansByID(ids ...string) ([]ClanStats, error) {
	toReturn := []ClanStats{}
	if len(ids) > 200 {
		return toReturn, errors.New("Too many IDs")
	}
	if len(ids) == 0 {
		return toReturn, nil
	}
	clans := GetCurrentClansData()
	for _, id := range ids {
		clan, ok := clans[id]
		if ok {
			toReturn = append(toReturn, clan)
		}
	}

	return toReturn, nil
}

// GetCurrentClansTop returns the top of some amound of clans
func GetCurrentClansTop(maxAmound int) ([]ClanStats, error) {
	toReturn := make([]ClanStats, len(sortedRating))
	clansMapped := map[string]ClanStats{}

	clans := GetCurrentClansData()
	for _, clan := range clans {
		clansMapped[clan.ID] = clan
	}

	for clanID, positions := range sortedRating {
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
	filteredStats := map[string]ClanStats{}

	for _, stat := range stats {
		if len(stat.ID) > 1 && len(stat.Tag) > 1 {
			filteredStats[stat.ID] = stat
		}
	}

	if len(filteredStats) == 0 {
		return errors.New("SetCurrentClansData got a empty array")
	}

	currentStatsLock.Lock()
	defer currentStatsLock.Unlock()

	currentStats = filteredStats

	SortClanIds()
	refillClanNameAndTags()

	return nil
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

	clanNameAndTagsLock.Lock()
	defer clanNameAndTagsLock.Unlock()
	for _, clanID := range sorted {
		clanNameAndTag, ok := clanNameAndTags[clanID]
		if !ok {
			continue
		}

		formattedQuery := other.FormatSearch(query)
	checkList:
		for _, check := range []string{clanNameAndTag.Name, clanNameAndTag.Tag} {
			if strings.Contains(other.FormatSearch(check), formattedQuery) {
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
