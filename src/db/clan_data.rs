use super::sorting::get_sorted_ratings;
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

// GetCurrentClansByID filter the list with spesific IDs
pub fn get_current_clans_by_id<'a>(ids: Vec<String>) -> Result<Vec<&'a ClanStats>, String> {
  let res: Vec<&'a ClanStats> = Vec::new();
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
      res.push(clan);
    }
  }

  Ok(res)
}

// GetCurrentClansTop returns the top of some amound of clans
fn het_current_clans_top<'a>(max_amound: usize) -> Result<Vec<&'a ClanStats>, String> {
  let sorted_rating = get_sorted_ratings();
  let current_stats = get_current_stats();

  let mut res: Vec<&'a ClanStats> = Vec::new();
  for (_, clan) in current_stats.iter() {
    res.push(clan);
  }

  res.sort_by(|a, b| a.stats.efficiency.partial_cmp(&b.stats.efficiency).unwrap());

  let mut res_with_max: Vec<&'a ClanStats> = Vec::new();

  for (i, clan) in res.iter().enumerate() {
    if i >= max_amound {
      break;
    }
    res_with_max.push(*clan);
  }

  Ok(res_with_max)
}

// SetCurrentClansData saves the latest clan data in the database
fn set_current_clans_data(stats: Vec<ClanStats>) -> Result<(), String> {
  let filtered_stats: HashMap<String, ClanStats> = HashMap::new();

  for stat in stats {
    if stat.id.len() > 1 && stat.tag.len() > 1 {
      filtered_stats.insert(stat.id, stat);
    }
  }

  if filtered_stats.len() == 0 {
    return Err(String::from("set_current_clans_data got a empty array"));
  }

  let stats = get_current_stats();
  *stats = filtered_stats;
  drop(stats);

  sort_clan_ids();
  refill_clan_name_and_tags();

  Ok(())
}

// SearchClans returns the top 20 found using a search query
fn search_clans(query: String, sort_on: String) -> Result<Vec<String>, String> {
  let mut res: Vec<String> = Vec::new();

  if sort_on == "all" {
    return Err(String::from("Can't filter on \"all\""));
  }

  let sorted_ratings_by_tag_raw = light_clan_positions(sortOn)?;
  let sortedRatings_by_tag: HashMap<String, usize> = sorted_ratings_by_tag_raw["actualData"];
  let mut sorted: Vec<(usize, String)> = Vec::new();
  for (clan_id, pos) in sortedRatings_by_tag {
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
