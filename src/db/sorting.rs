use super::clan_data::get_current_stats;
use super::types::{ClanPositionEvery, ClanStats, HistoryClanStats};
use std::collections::HashMap;
use std::sync::{Mutex, MutexGuard};
use std::cmp::Ordering;

lazy_static! {
  static ref SORTED_RATINGS: Mutex<HashMap<String, ClanPositionEvery>> = Mutex::new(HashMap::new());
}

pub fn get_sorted_ratings<'a>() -> MutexGuard<'a, HashMap<String, ClanPositionEvery>> {
  SORTED_RATINGS.lock().unwrap()
}

pub enum SortOn {
  Members,
  Battles,
  Dailybattles,
  Efficiency,
  Fbelo10,
  Fbelo8,
  Fbelo6,
  Fbelo,
  Gmelo10,
  Gmelo8,
  Gmelo6,
  Gmelo,
  Globrating,
  GlobRatingweighted,
  Winratio,
  V10l,
}

impl SortOn {
  fn Sort(&self, a: HistoryClanStats, b: HistoryClanStats) -> Ordering {
    match self {
      Self::Members => a.members.partial_cmp(&b.members),
      Self::Battles => a.battles.partial_cmp(&b.battles),
      Self::Dailybattles => a.daily_battles.partial_cmp(&b.daily_battles),
      Self::Efficiency => a.efficiency.partial_cmp(&b.efficiency),
      Self::Fbelo10 => a.fb_elo10.partial_cmp(&b.fb_elo10),
      Self::Fbelo8 => a.fb_elo8.partial_cmp(&b.fb_elo8),
      Self::Fbelo6 => a.fb_elo6.partial_cmp(&b.fb_elo6),
      Self::Fbelo => a.fb_elo.partial_cmp(&b.fb_elo),
      Self::Gmelo10 => a.gm_elo10.partial_cmp(&b.gm_elo10),
      Self::Gmelo8 => a.gm_elo8.partial_cmp(&b.gm_elo8),
      Self::Gmelo6 => a.gm_elo6.partial_cmp(&b.gm_elo6),
      Self::Gmelo => a.gm_elo.partial_cmp(&b.gm_elo),
      Self::Globrating => a.glob_rating.partial_cmp(&b.glob_rating),
      Self::GlobRatingweighted => a.glob_rating_weighted.partial_cmp(&b.glob_rating_weighted),
      Self::Winratio => a.win_ratio.partial_cmp(&b.win_ratio),
      Self::V10l => a.v10l.partial_cmp(&b.v10l),
    }.unwrap()
  }
}

// SortClanIds makes a pre sorted list of all clans
fn sort_clan_ids() {
  let mut clans: Vec<ClanStats> = Vec::new();
  let mut out: HashMap<String, ClanPositionEvery> = HashMap::new();

  let current_stats = get_current_stats();
  for (clan_id, clan) in current_stats.iter() {
    clans.push(*clan);
    out.insert(clan_id.to_string(), ClanPositionEvery::empty()); // map ever clan id to the map
  }
  drop(current_stats);

  for (id, filter_func) in items_to_sort {
    filter_func(clans)
    for i := 0; i < len(clans)/2; i++ {
      j := len(clans) - i - 1
      clans[i], clans[j] = clans[j], clans[i]
    }
    for rank, clan := range clans {
      newData := out[clan.ID]
      switch id {
      case "members":
        newData.Members = rank
      case "battles":
        newData.Battles = rank
      case "dailybattles":
        newData.Dailybattles = rank
      case "efficiency":
        newData.Efficiency = rank
      case "fbelo10":
        newData.Fbelo10 = rank
      case "fbelo8":
        newData.Fbelo8 = rank
      case "fbelo6":
        newData.Fbelo6 = rank
      case "fbelo":
        newData.Fbelo = rank
      case "gmelo10":
        newData.Gmelo10 = rank
      case "gmelo8":
        newData.Gmelo8 = rank
      case "gmelo6":
        newData.Gmelo6 = rank
      case "gmelo":
        newData.Gmelo = rank
      case "globrating":
        newData.Global = rank
      case "globRatingweighted":
        newData.GlobalWeighted = rank
      case "winratio":
        newData.Winratio = rank
      case "v10l":
        newData.V10l = rank
      }
      out[clan.ID] = newData
    }
  }

  // 	SortedRatingLock.Lock()
  // 	defer SortedRatingLock.Unlock()
  // 	SortedRating = out
  // }

  // // LightClanPositions does mostly the same as sortClanIds
  // // this one tells per clan the posstion instaid of per cataory every clan's possition
  // func LightClanPositions(item_to_get string) (map[string]interface{}, error) {
  // 	SortedRatingLock.Lock()
  // 	defer SortedRatingLock.Unlock()

  // 	toReturn := map[string]interface{}{}

  // 	if item_to_get == "all" {
  // 		toReturn["actualData"] = map[string][]int{}
  // 		for clanID, clan := range SortedRating {
  // 			toReturn["actualData"].(map[string][]int)[clanID] = []int{
  // 				clan.Members,
  // 				clan.Battles,
  // 				clan.Dailybattles,
  // 				clan.Efficiency,
  // 				clan.Fbelo10,
  // 				clan.Fbelo8,
  // 				clan.Fbelo6,
  // 				clan.Fbelo,
  // 				clan.Gmelo10,
  // 				clan.Gmelo8,
  // 				clan.Gmelo8,
  // 				clan.Gmelo,
  // 				clan.Global,
  // 				clan.GlobalWeighted,
  // 				clan.Winratio,
  // 				clan.V10l,
  // 			}
  // 		}
  // 		toReturn["dataMapping"] = []string{
  // 			"members",
  // 			"battles",
  // 			"dailybattles",
  // 			"efficiency",
  // 			"fbelo10",
  // 			"fbelo8",
  // 			"fbelo6",
  // 			"fbelo",
  // 			"gmelo10",
  // 			"gmelo8",
  // 			"gmelo6",
  // 			"gmelo",
  // 			"globrating",
  // 			"globRatingweighted",
  // 			"winratio",
  // 			"v10l",
  // 		}
  // 	} else {
  // 		toReturn["actualData"] = map[string]int{}
  // 		for clanID, clan := range SortedRating {
  // 			switch item_to_get {
  // 			case "members":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Members
  // 			case "battles":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Battles
  // 			case "dailybattles":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Dailybattles
  // 			case "efficiency":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Efficiency
  // 			case "fbelo10":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo10
  // 			case "fbelo8":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo8
  // 			case "fbelo6":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo6
  // 			case "fbelo":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo
  // 			case "gmelo10":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo10
  // 			case "gmelo8":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo8
  // 			case "gmelo6":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo6
  // 			case "gmelo":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo
  // 			case "globrating":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Global
  // 			case "globRatingweighted":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.GlobalWeighted
  // 			case "winratio":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.Winratio
  // 			case "v10l":
  // 				toReturn["actualData"].(map[string]int)[clanID] = clan.V10l
  // 			default:
  // 				return toReturn, errors.New("\"" + item_to_get + "\" can't be filterd on")
  // 			}
  // 		}
  // 	}
  // 	return toReturn, nil
  // }
}
