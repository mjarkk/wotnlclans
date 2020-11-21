use super::types::{ClanNameAndTag, ClanStats};
use std::collections::HashMap;
use std::sync::{Mutex, MutexGuard};

lazy_static! {
  static ref CLAN_NAME_AND_TAGS: Mutex<HashMap<String, ClanNameAndTag>> =
    Mutex::new(HashMap::new());
  static ref CURRENT_STATS: Mutex<HashMap<String, ClanStats>> = Mutex::new(HashMap::new());
}

pub fn get_current_stats<'a>() -> MutexGuard<'a, HashMap<String, ClanStats>> {
  CURRENT_STATS.lock().unwrap()
}

pub fn get_clan_name_and_tags<'a>() -> MutexGuard<'a, HashMap<String, ClanNameAndTag>> {
  CLAN_NAME_AND_TAGS.lock().unwrap()
}

// refillClanNameAndTags places data in the clanNameAndTags var
pub fn refill_clan_name_and_tags() {
  let mut current_stats = get_current_stats();
  let mut clan_name_and_tags = get_clan_name_and_tags();

  for (_, clan) in current_stats.iter() {
    clan_name_and_tags.insert(
      clan.id,
      ClanNameAndTag {
        name: clan.name,
        tag: clan.tag,
      },
    );
  }
}

// // GetCurrentClansByID filter the list with spesific IDs
// func GetCurrentClansByID(ids ...string) ([]ClanStats, error) {
// 	toReturn := []ClanStats{}
// 	if len(ids) > 200 {
// 		return toReturn, errors.New("Too many IDs")
// 	}
// 	if len(ids) == 0 {
// 		return toReturn, nil
// 	}

// 	currentStats, unlock := GetCurrentStats()
// 	for _, id := range ids {
// 		clan, ok := currentStats[id]
// 		if ok {
// 			toReturn = append(toReturn, clan)
// 		}
// 	}
// 	unlock()

// 	return toReturn, nil
// }

// // GetCurrentClansTop returns the top of some amound of clans
// func GetCurrentClansTop(maxAmound int) ([]ClanStats, error) {
// 	toReturn := make([]ClanStats, len(SortedRating))
// 	clansMapped := map[string]ClanStats{}

// 	currentStats, unlock := GetCurrentStats()
// 	for _, clan := range currentStats {
// 		clansMapped[clan.ID] = clan
// 	}
// 	unlock()

// 	for clanID, positions := range SortedRating {
// 		toReturn[positions.Efficiency] = clansMapped[clanID]
// 	}

// 	toReturnWithMax := []ClanStats{}

// 	for i, item := range toReturn {
// 		if i >= maxAmound {
// 			break
// 		}
// 		toReturnWithMax = append(toReturnWithMax, item)
// 	}

// 	return toReturnWithMax, nil
// }

// // SetCurrentClansData saves the latest clan data in the database
// func SetCurrentClansData(stats []ClanStats) error {
// 	filteredStats := map[string]ClanStats{}

// 	for _, stat := range stats {
// 		if len(stat.ID) > 1 && len(stat.Tag) > 1 {
// 			filteredStats[stat.ID] = stat
// 		}
// 	}

// 	if len(filteredStats) == 0 {
// 		return errors.New("SetCurrentClansData got a empty array")
// 	}

// 	_, unlock := GetCurrentStats()
// 	currentStats = filteredStats
// 	unlock()

// 	SortClanIds()
// 	refillClanNameAndTags()

// 	return nil
// }

// // SearchClans returns the top 20 found using a search query
// func SearchClans(query, sortOn string) ([]string, error) {
// 	toReturn := []string{}

// 	if sortOn == "all" {
// 		return toReturn, errors.New("Can't filter on \"all\"")
// 	}
// 	sortedRatingsByTagRaw, err := LightClanPositions(sortOn)
// 	if err != nil {
// 		return toReturn, err
// 	}
// 	sortedRatingsByTag := sortedRatingsByTagRaw["actualData"].(map[string]int)
// 	sorted := make([]string, len(sortedRatingsByTag))
// 	for clanID, pos := range sortedRatingsByTag {
// 		sorted[pos] = clanID
// 	}

// 	clanNameAndTagsLock.Lock()
// 	defer clanNameAndTagsLock.Unlock()
// 	for _, clanID := range sorted {
// 		clanNameAndTag, ok := clanNameAndTags[clanID]
// 		if !ok {
// 			continue
// 		}

// 		formattedQuery := other.FormatSearch(query)
// 	checkList:
// 		for _, check := range []string{clanNameAndTag.Name, clanNameAndTag.Tag} {
// 			if strings.Contains(other.FormatSearch(check), formattedQuery) {
// 				toReturn = append(toReturn, clanID)
// 				break checkList
// 			}
// 		}
// 		if len(toReturn) == 20 {
// 			break
// 		}
// 	}

// 	return toReturn, nil
// }
