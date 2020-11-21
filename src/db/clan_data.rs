use super::sorting::{light_clan_positions, sort_clan_ids, SortOn};
use super::types::{ClanNameAndTag, ClanStats};
use crate::other::format_search;
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
  let current_stats = get_current_stats();
  let mut clan_name_and_tags = get_clan_name_and_tags();

  for (_, clan) in current_stats.iter() {
    clan_name_and_tags.insert(
      clan.id.clone(),
      ClanNameAndTag {
        name: clan.name.clone(),
        tag: clan.tag.clone(),
      },
    );
  }
}

// GetCurrentClansByID filter the list with spesific IDs
pub fn get_current_clans_by_id<'a>(ids: Vec<String>) -> Result<Vec<ClanStats>, String> {
  let mut res: Vec<ClanStats> = Vec::new();
  if ids.len() > 200 {
    return Err(String::from(
      "Too many IDs given to get_current_clans_by_id",
    ));
  }
  if ids.len() == 0 {
    return Ok(res);
  }

  let current_stats = get_current_stats();
  for id in ids {
    if let Some(clan) = current_stats.get(&id) {
      res.push(clan.clone());
    }
  }

  Ok(res)
}

// GetCurrentClansTop returns the top of some amound of clans
pub fn get_current_clans_top<'a>(max_amound: usize) -> Result<Vec<ClanStats>, String> {
  let current_stats: MutexGuard<'a, HashMap<String, ClanStats>> = get_current_stats::<'a>();

  let mut res: Vec<ClanStats> = Vec::new();
  for (_, clan) in current_stats.iter() {
    res.push(clan.clone());
  }

  res.sort_by(|a, b| a.stats.efficiency.partial_cmp(&b.stats.efficiency).unwrap());
  if res.len() > max_amound {
    res.resize(max_amound, ClanStats::empty());
  }

  Ok(res)
}

// SetCurrentClansData saves the latest clan data in the database
pub fn set_current_clans_data(stats: Vec<ClanStats>) -> Result<(), String> {
  let mut filtered_stats: HashMap<String, ClanStats> = HashMap::new();

  for stat in stats {
    if stat.id.len() > 1 && stat.tag.len() > 1 {
      filtered_stats.insert(stat.id.clone(), stat);
    }
  }

  if filtered_stats.len() == 0 {
    return Err(String::from("set_current_clans_data got a empty array"));
  }

  let mut stats = get_current_stats();
  *stats = filtered_stats;
  drop(stats);

  sort_clan_ids();
  refill_clan_name_and_tags();

  Ok(())
}

// SearchClans returns the top 20 found using a search query
pub fn search_clans(query: String, sort_on: SortOn) -> Result<Vec<String>, String> {
  let mut res: Vec<String> = Vec::new();

  let sorted_ratings_by_id = light_clan_positions(sort_on);
  let mut sorted: Vec<(u32, String)> = Vec::new();
  for (clan_id, pos) in sorted_ratings_by_id {
    sorted.push((pos, clan_id));
  }
  sorted.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());

  let clan_name_and_tags = get_clan_name_and_tags();
  for sorted_item in sorted {
    let clan_id = sorted_item.1;

    let clan_name_and_tag = match clan_name_and_tags.get(&clan_id) {
      Some(v) => v,
      None => continue,
    };

    let formatted_query = format_search(&query);
    let to_check_for = vec![
      clan_name_and_tag.name.clone(),
      clan_name_and_tag.tag.clone(),
    ];
    for check in to_check_for.iter() {
      let formatted_check = format_search(check);
      if formatted_check.contains(&formatted_query) {
        res.push(clan_id);
        break;
      }
    }
    if res.len() == 20 {
      break;
    }
  }

  Ok(res)
}
