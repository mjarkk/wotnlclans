use super::clan_data::get_current_stats;
use super::types::{ClanPositionEvery, ClanStats, HistoryClanStats};
use std::cmp::Ordering;
use std::collections::HashMap;
use std::sync::{Mutex, MutexGuard};

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

impl Into<String> for SortOn {
  fn into(self) -> String {
    String::from(match self {
      Self::Members => "Members",
      Self::Battles => "Battles",
      Self::Dailybattles => "Dailybattles",
      Self::Efficiency => "Efficiency",
      Self::Fbelo10 => "Fbelo10",
      Self::Fbelo8 => "Fbelo8",
      Self::Fbelo6 => "Fbelo6",
      Self::Fbelo => "Fbelo",
      Self::Gmelo10 => "Gmelo10",
      Self::Gmelo8 => "Gmelo8",
      Self::Gmelo6 => "Gmelo6",
      Self::Gmelo => "Gmelo",
      Self::Globrating => "Globrating",
      Self::GlobRatingweighted => "GlobRatingweighted",
      Self::Winratio => "Winratio",
      Self::V10l => "V10l",
    })
  }
}

impl From<String> for SortOn {
  fn from(name: String) -> Self {
    match name.as_str() {
      "Members" => Self::Members,
      "Battles" => Self::Battles,
      "Dailybattles" => Self::Dailybattles,
      "Efficiency" => Self::Efficiency,
      "Fbelo10" => Self::Fbelo10,
      "Fbelo8" => Self::Fbelo8,
      "Fbelo6" => Self::Fbelo6,
      "Fbelo" => Self::Fbelo,
      "Gmelo10" => Self::Gmelo10,
      "Gmelo8" => Self::Gmelo8,
      "Gmelo6" => Self::Gmelo6,
      "Gmelo" => Self::Gmelo,
      "Globrating" => Self::Globrating,
      "GlobRatingweighted" => Self::GlobRatingweighted,
      "Winratio" => Self::Winratio,
      "V10l" => Self::V10l,
      _ => Self::Efficiency,
    }
  }
}

impl SortOn {
  pub fn sort(&self, a: &HistoryClanStats, b: &HistoryClanStats) -> Ordering {
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
    }
    .unwrap()
  }
  fn set_stat(&self, stats: &mut ClanPositionEvery, rank: u32) {
    match self {
      Self::Members => stats.members = rank,
      Self::Battles => stats.battles = rank,
      Self::Dailybattles => stats.daily_battles = rank,
      Self::Efficiency => stats.efficiency = rank,
      Self::Fbelo10 => stats.fb_elo10 = rank,
      Self::Fbelo8 => stats.fb_elo8 = rank,
      Self::Fbelo6 => stats.fb_elo6 = rank,
      Self::Fbelo => stats.fb_elo = rank,
      Self::Gmelo10 => stats.gm_elo10 = rank,
      Self::Gmelo8 => stats.gm_elo8 = rank,
      Self::Gmelo6 => stats.gm_elo6 = rank,
      Self::Gmelo => stats.gm_elo = rank,
      Self::Globrating => stats.global = rank,
      Self::GlobRatingweighted => stats.global_weighted = rank,
      Self::Winratio => stats.winratio = rank,
      Self::V10l => stats.v10l = rank,
    };
  }
  fn get_stat_value(&self, stats: &ClanPositionEvery) -> u32 {
    match self {
      Self::Members => stats.members,
      Self::Battles => stats.battles,
      Self::Dailybattles => stats.daily_battles,
      Self::Efficiency => stats.efficiency,
      Self::Fbelo10 => stats.fb_elo10,
      Self::Fbelo8 => stats.fb_elo8,
      Self::Fbelo6 => stats.fb_elo6,
      Self::Fbelo => stats.fb_elo,
      Self::Gmelo10 => stats.gm_elo10,
      Self::Gmelo8 => stats.gm_elo8,
      Self::Gmelo6 => stats.gm_elo6,
      Self::Gmelo => stats.gm_elo,
      Self::Globrating => stats.global,
      Self::GlobRatingweighted => stats.global_weighted,
      Self::Winratio => stats.winratio,
      Self::V10l => stats.v10l,
    }
  }
  fn all() -> Vec<Self> {
    vec![
      Self::Members,
      Self::Battles,
      Self::Dailybattles,
      Self::Efficiency,
      Self::Fbelo10,
      Self::Fbelo8,
      Self::Fbelo6,
      Self::Fbelo,
      Self::Gmelo10,
      Self::Gmelo8,
      Self::Gmelo6,
      Self::Gmelo,
      Self::Globrating,
      Self::GlobRatingweighted,
      Self::Winratio,
      Self::V10l,
    ]
  }
}

// SortClanIds makes a pre sorted list of all clans
pub fn sort_clan_ids() {
  let mut clans: Vec<ClanStats> = Vec::new();
  let mut out: HashMap<String, ClanPositionEvery> = HashMap::new();

  let current_stats = get_current_stats();
  for (_, clan) in current_stats.iter() {
    clans.push(clan.clone());
  }
  drop(current_stats);

  for sort_item in SortOn::all() {
    clans.sort_by(|a, b| sort_item.sort(&a.stats, &b.stats));

    for (rank_nmbr, clan) in clans.iter().enumerate() {
      if let Some(data) = out.get_mut(&clan.id) {
        sort_item.set_stat(data, rank_nmbr as u32);
      } else {
        let mut new_stats = ClanPositionEvery::empty();
        sort_item.set_stat(&mut new_stats, rank_nmbr as u32);
        out.insert(clan.id.clone(), new_stats);
      }
    }
  }

  let mut sorted_ratings = get_sorted_ratings();
  *sorted_ratings = out;
}

// LightClanPositions does mostly the same as sortClanIds
// this one tells per clan the posstion instaid of per cataory every clan's possition
pub fn light_clan_positions(item_to_get: SortOn) -> HashMap<String, u32> {
  let sorted_ratings = get_sorted_ratings();
  let mut res: HashMap<String, u32> = HashMap::new();

  for (clan_id, stats) in sorted_ratings.iter() {
    let value = item_to_get.get_stat_value(stats);
    res.insert(clan_id.clone(), value);
  }

  res
}

#[derive(Serialize)]
pub struct LightClanPositionsAll {
  pub stats: HashMap<String, Vec<u32>>,
  pub data_mapping: Vec<&'static str>,
}

pub fn light_clan_positions_all() -> LightClanPositionsAll {
  let sorted_ratings = get_sorted_ratings();
  let mut all_clan_stats: HashMap<String, Vec<u32>> = HashMap::new();

  for (clan_id, stats) in sorted_ratings.iter() {
    all_clan_stats.insert(
      clan_id.clone(),
      vec![
        stats.members,
        stats.battles,
        stats.daily_battles,
        stats.efficiency,
        stats.fb_elo10,
        stats.fb_elo8,
        stats.fb_elo6,
        stats.fb_elo,
        stats.gm_elo10,
        stats.gm_elo8,
        stats.gm_elo8,
        stats.gm_elo,
        stats.global,
        stats.global_weighted,
        stats.winratio,
        stats.v10l,
      ],
    );
  }

  let data_mapping: Vec<&'static str> = vec![
    "members",
    "battles",
    "daily_battles",
    "efficiency",
    "fb_elo10",
    "fb_elo8",
    "fb_elo6",
    "fb_elo",
    "gm_elo10",
    "gm_elo8",
    "gm_elo8",
    "gm_elo",
    "global",
    "global_weighted",
    "winratio",
    "v10l",
  ];

  LightClanPositionsAll {
    stats: all_clan_stats,
    data_mapping: data_mapping,
  }
}
