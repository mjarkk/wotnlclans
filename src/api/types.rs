use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Error {
  pub code: isize,
  pub message: String,
  pub field: Option<String>,
  pub value: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Meta {
  pub count: Option<i64>,
  pub total: Option<i64>,
}

/// The default data returned by the api
#[derive(Serialize, Deserialize, Clone)]
pub struct Response<T> {
  pub status: String,
  pub error: Option<Error>,
  pub meta: Option<Meta>,
  pub data: Option<T>,
}

impl<T: Clone> Response<T> {
  pub fn get_data(&self) -> Result<T, String> {
    if self.status != "ok" || self.data.is_none() {
      if let Some(err) = self.error.clone() {
        Err(format!("{:?}", err))
      } else {
        Err(String::from("Unknown error"))
      }
    } else {
      Ok(self.data.clone().unwrap())
    }
  }
}

/// TopClans is a structure for the tops clans route
pub type TopClans = Vec<TopClansData>;

#[derive(Serialize, Deserialize, Clone)]
pub struct TopClansData {
  pub clan_id: usize,
}

/// NicknameAndClan is a type for the nicknameAndClan route
pub type NicknameAndClan = HashMap<String, NicknameAndClanData>;

#[derive(Serialize, Deserialize, Clone)]
pub struct NicknameAndClanData {
  pub clan_id: Option<usize>,
  pub nickname: String,
}

/// ClanDiscription is a type for the clanDiscription route
pub type ClanDiscription = HashMap<String, ClanDiscriptionData>;

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanDiscriptionData {
  pub description: Option<String>,
  pub tag: Option<String>,
}

/// ClanData is a type for the clanData route
pub type ClanData = HashMap<String, ClanDataData>;

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanDataData {
  pub clan_id: usize,
  pub leader_id: usize,
  pub creator_id: usize,
  pub created_at: isize,
  pub updated_at: isize,
  pub renamed_at: isize,
  pub members_count: usize,
  pub accepts_join_requests: bool,
  pub is_clan_disbanded: bool,
  pub creator_name: String,
  pub tag: String,
  pub name: String,
  pub game: String,
  pub motto: String,
  pub color: String,
  pub old_tag: String,
  pub old_name: String,
  pub leader_name: String,
  pub description: String,
  pub description_html: String,
  pub emblems: ClanDataEmblems,
  pub members: Vec<ClanDataMembers>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanDataMembers {
  pub role: String,
  pub role_i18n: String,
  pub joined_at: isize,
  pub account_id: usize,
  pub account_name: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanDataEmblems {
  pub x32: ClanDataEmblemsOnlyPortal,
  pub x24: ClanDataEmblemsOnlyPortal,
  pub x256: ClanDataEmblemsX256,
  pub x64: ClanDataEmblemsX64,
  pub x195: ClanDataEmblemsOnlyPortal,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanDataEmblemsX64 {
  pub wot: String,
  pub portal: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanDataEmblemsX256 {
  pub wowp: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanDataEmblemsOnlyPortal {
  pub portal: String,
}

/// ClanRating is a type for the clanRating route
pub type ClanRating = HashMap<String, ClanRatingData>;

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanRatingData {
  pub clan_id: usize,
  pub clan_name: String,
  pub clan_tag: String,
  pub battles_count_avg: ClanRatingGeneralRating,
  pub battles_count_avg_daily: ClanRatingGeneralRating,
  pub efficiency: ClanRatingGeneralRating,
  pub exclude_reasons: HashMap<String, String>,
  pub fb_elo_rating: ClanRatingGeneralRating,
  pub fb_elo_rating_10: ClanRatingGeneralRating,
  pub fb_elo_rating_6: ClanRatingGeneralRating,
  pub fb_elo_rating_8: ClanRatingGeneralRating,
  pub global_rating_avg: ClanRatingGeneralRating,
  pub global_rating_weighted_avg: ClanRatingGeneralRating,
  pub gm_elo_rating: ClanRatingGeneralRating,
  pub gm_elo_rating_10: ClanRatingGeneralRating,
  pub gm_elo_rating_6: ClanRatingGeneralRating,
  pub gm_elo_rating_8: ClanRatingGeneralRating,
  pub rating_fort: ClanRatingGeneralRating,
  pub v10l_avg: ClanRatingGeneralRating,
  pub wins_ratio_avg: ClanRatingGeneralRating,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ClanRatingGeneralRating {
  pub rank_delta: Option<isize>,
  pub rank: Option<usize>,
  pub value: Option<f64>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PlayerInfoLogedInDataPrivate {
  restrictions: PlayerInfoLogedInDataPrivateRestrictions,
  gold: isize,
  free_xp: isize,
  ban_time: isize,
  is_bound_to_phone: bool,
  is_premium: bool,
  credits: isize,
  premium_expires_at: isize,
  bonds: isize,
  battle_life_time: isize,
  ban_info: isize,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PlayerInfoLogedInDataPrivateRestrictions {
  chat_ban_time: isize,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PlayerInfoLogedInData {
  client_language: String,
  last_battle_time: isize,
  account_id: usize,
  created_at: isize,
  updated_at: isize,
  global_rating: isize,
  clan_id: usize,
  nickname: String,
  logout_at: isize,
  private: PlayerInfoLogedInDataPrivate,
  statistics: PlayerInfoLogedInDataStatistics,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PlayerInfoLogedInDataStatistics {
  trees_cut: Option<isize>,
  clan: Option<PlayerInfoLogedInDataStatisticsClan>,
  all: Option<PlayerInfoLogedInDataStatisticsAll>,
  regular_team: Option<PlayerInfoLogedInDataStatisticsRegularTeam>,
  historical: Option<PlayerInfoLogedInDataStatisticsHistorical>,
  stronghold_defense: Option<PlayerInfoLogedInDataStatisticsStrongholdDefense>,
  stronghold_skirmish: Option<PlayerInfoLogedInDataStatisticsStrongholdSkirmish>,
  team: Option<PlayerInfoLogedInDataStatisticsTeam>,
  frags: Option<HashMap<String, isize>>,
}

#[derive(Serialize, Deserialize, Clone)]
struct PlayerInfoLogedInDataStatisticsClan {
  spotted: f64,
  battles_on_stunning_vehicles: f64,
  avg_damage_blocked: f64,
  direct_hits_received: f64,
  explosion_hits: f64,
  piercings_received: f64,
  piercings: f64,
  xp: f64,
  survived_battles: f64,
  dropped_capture_points: f64,
  hits_percents: f64,
  draws: f64,
  battles: f64,
  damage_received: f64,
  avg_damage_assisted: f64,
  avg_damage_assisted_track: f64,
  frags: f64,
  stun_number: f64,
  avg_damage_assisted_radio: f64,
  capture_points: f64,
  stun_assisted_damage: f64,
  hits: f64,
  battle_avg_xp: f64,
  wins: f64,
  losses: f64,
  damage_dealt: f64,
  no_damage_direct_hits_received: f64,
  shots: f64,
  explosion_hits_received: f64,
  tanking_factor: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct PlayerInfoLogedInDataStatisticsAll {
  avg_damage_assisted: f64,
  avg_damage_assisted_radio: f64,
  avg_damage_assisted_track: f64,
  avg_damage_blocked: f64,
  battle_avg_xp: f64,
  battles: f64,
  battles_on_stunning_vehicles: f64,
  capture_points: f64,
  damage_dealt: f64,
  damage_received: f64,
  direct_hits_received: f64,
  draws: f64,
  dropped_capture_points: f64,
  explosion_hits: f64,
  explosion_hits_received: f64,
  frags: f64,
  hits: f64,
  hits_percents: f64,
  losses: f64,
  max_damage: f64,
  max_damage_tank_id: f64,
  max_frags: f64,
  max_frags_tank_id: f64,
  max_xp: f64,
  max_xp_tank_id: f64,
  no_damage_direct_hits_received: f64,
  piercings: f64,
  piercings_received: f64,
  shots: f64,
  spotted: f64,
  stun_assisted_damage: f64,
  stun_number: f64,
  survived_battles: f64,
  tanking_factor: f64,
  wins: f64,
  xp: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct PlayerInfoLogedInDataStatisticsRegularTeam {
  avg_damage_assisted: f64,
  avg_damage_assisted_radio: f64,
  avg_damage_assisted_track: f64,
  avg_damage_blocked: f64,
  battle_avg_xp: f64,
  battles: f64,
  battles_on_stunning_vehicles: f64,
  capture_points: f64,
  damage_dealt: f64,
  damage_received: f64,
  direct_hits_received: f64,
  draws: f64,
  dropped_capture_points: f64,
  explosion_hits: f64,
  explosion_hits_received: f64,
  frags: f64,
  hits: f64,
  hits_percents: f64,
  losses: f64,
  max_damage: f64,
  max_damage_tank_id: f64,
  max_frags: f64,
  max_frags_tank_id: f64,
  max_xp: f64,
  max_xp_tank_id: f64,
  no_damage_direct_hits_received: f64,
  piercings: f64,
  piercings_received: f64,
  shots: f64,
  spotted: f64,
  stun_assisted_damage: f64,
  stun_number: f64,
  survived_battles: f64,
  tanking_factor: f64,
  wins: f64,
  xp: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct PlayerInfoLogedInDataStatisticsHistorical {
  avg_damage_assisted: f64,
  avg_damage_assisted_radio: f64,
  avg_damage_assisted_track: f64,
  avg_damage_blocked: f64,
  battle_avg_xp: f64,
  battles: f64,
  battles_on_stunning_vehicles: f64,
  capture_points: f64,
  damage_dealt: f64,
  damage_received: f64,
  direct_hits_received: f64,
  draws: f64,
  dropped_capture_points: f64,
  explosion_hits: f64,
  explosion_hits_received: f64,
  frags: f64,
  hits: f64,
  hits_percents: f64,
  losses: f64,
  max_damage: f64,
  max_damage_tank_id: f64,
  max_frags: f64,
  max_frags_tank_id: f64,
  max_xp: f64,
  max_xp_tank_id: f64,
  no_damage_direct_hits_received: f64,
  piercings: f64,
  piercings_received: f64,
  shots: f64,
  spotted: f64,
  stun_assisted_damage: f64,
  stun_number: f64,
  survived_battles: f64,
  tanking_factor: f64,
  wins: f64,
  xp: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct PlayerInfoLogedInDataStatisticsStrongholdDefense {
  battle_avg_xp: f64,
  battles: f64,
  battles_on_stunning_vehicles: f64,
  capture_points: f64,
  damage_dealt: f64,
  damage_received: f64,
  direct_hits_received: f64,
  draws: f64,
  dropped_capture_points: f64,
  explosion_hits: f64,
  explosion_hits_received: f64,
  frags: f64,
  hits: f64,
  hits_percents: f64,
  losses: f64,
  max_damage: f64,
  max_damage_tank_id: f64,
  max_frags: f64,
  max_frags_tank_id: f64,
  max_xp: f64,
  max_xp_tank_id: f64,
  no_damage_direct_hits_received: f64,
  piercings: f64,
  piercings_received: f64,
  shots: f64,
  spotted: f64,
  stun_assisted_damage: f64,
  stun_number: f64,
  survived_battles: f64,
  tanking_factor: f64,
  wins: f64,
  xp: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct PlayerInfoLogedInDataStatisticsStrongholdSkirmish {
  battle_avg_xp: f64,
  battles: f64,
  battles_on_stunning_vehicles: f64,
  capture_points: f64,
  damage_dealt: f64,
  damage_received: f64,
  direct_hits_received: f64,
  draws: f64,
  dropped_capture_points: f64,
  explosion_hits: f64,
  explosion_hits_received: f64,
  frags: f64,
  hits: f64,
  hits_percents: f64,
  losses: f64,
  max_damage: f64,
  max_damage_tank_id: f64,
  max_frags: f64,
  max_frags_tank_id: f64,
  max_xp: f64,
  max_xp_tank_id: f64,
  no_damage_direct_hits_received: f64,
  piercings: f64,
  piercings_received: f64,
  shots: f64,
  spotted: f64,
  stun_assisted_damage: f64,
  stun_number: f64,
  survived_battles: f64,
  tanking_factor: f64,
  wins: f64,
  xp: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct PlayerInfoLogedInDataStatisticsTeam {
  avg_damage_assisted: f64,
  avg_damage_assisted_radio: f64,
  avg_damage_assisted_track: f64,
  avg_damage_blocked: f64,
  battle_avg_xp: f64,
  battles: f64,
  battles_on_stunning_vehicles: f64,
  capture_points: f64,
  damage_dealt: f64,
  damage_received: f64,
  direct_hits_received: f64,
  draws: f64,
  dropped_capture_points: f64,
  explosion_hits: f64,
  explosion_hits_received: f64,
  frags: f64,
  hits: f64,
  hits_percents: f64,
  losses: f64,
  max_damage: f64,
  max_damage_tank_id: f64,
  max_frags: f64,
  max_frags_tank_id: f64,
  max_xp: f64,
  max_xp_tank_id: f64,
  no_damage_direct_hits_received: f64,
  piercings: f64,
  piercings_received: f64,
  shots: f64,
  spotted: f64,
  stun_assisted_damage: f64,
  stun_number: f64,
  survived_battles: f64,
  tanking_factor: f64,
  wins: f64,
  xp: f64,
}
