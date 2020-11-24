#[derive(Clone, Serialize)]
pub struct ClanStats {
	pub tag: String,
	pub name: String,
	pub color: String,
	pub members: usize,
	pub description: String,
	pub motto: String,
	pub id: String,
	pub emblems: ClanStatsEmblems,
	pub blocked: bool,
	pub stats: HistoryClanStats,
}

impl ClanStats {
	pub fn empty() -> Self {
		Self {
			tag: String::new(),
			name: String::new(),
			color: String::new(),
			members: 0,
			description: String::new(),
			motto: String::new(),
			id: String::new(),
			emblems: ClanStatsEmblems::empty(),
			blocked: true,
			stats: HistoryClanStats::empty(),
		}
	}
}

#[derive(Clone, Serialize)]
pub struct ClanStatsEmblems {
	pub x256_wowp: String,
	pub x195_portal: String,
	pub x64_portal: String,
	pub x64_wot: String,
	pub x32_portal: String,
	pub x24_portal: String,
}

impl ClanStatsEmblems {
	pub fn empty() -> Self {
		Self {
			x256_wowp: String::new(),
			x195_portal: String::new(),
			x64_portal: String::new(),
			x64_wot: String::new(),
			x32_portal: String::new(),
			x24_portal: String::new(),
		}
	}
}

// HistoryClanStats this is what to be exepected to get back per clan from the database when requesting old clan data
#[derive(Clone, Serialize)]
pub struct HistoryClanStats {
	pub tag: String,
	pub name: String,
	pub id: String,
	pub members: usize,
	pub battles: Option<f64>,
	pub daily_battles: Option<f64>,
	pub efficiency: Option<f64>,
	pub fb_elo10: Option<f64>,
	pub fb_elo8: Option<f64>,
	pub fb_elo6: Option<f64>,
	pub fb_elo: Option<f64>,
	pub gm_elo10: Option<f64>,
	pub gm_elo8: Option<f64>,
	pub gm_elo6: Option<f64>,
	pub gm_elo: Option<f64>,
	pub glob_rating: Option<f64>,
	pub glob_rating_weighted: Option<f64>,
	pub win_ratio: Option<f64>,
	pub v10l: Option<f64>,
}

impl HistoryClanStats {
	pub fn empty() -> Self {
		Self {
			tag: String::new(),
			name: String::new(),
			id: String::new(),
			members: 0,
			battles: None,
			daily_battles: None,
			efficiency: None,
			fb_elo10: None,
			fb_elo8: None,
			fb_elo6: None,
			fb_elo: None,
			gm_elo10: None,
			gm_elo8: None,
			gm_elo6: None,
			gm_elo: None,
			glob_rating: None,
			glob_rating_weighted: None,
			win_ratio: None,
			v10l: None,
		}
	}
}

// HistoryCollectionItem is what the contens is of 1 hisotry colleciton item
#[derive(Clone, Serialize)]
pub struct HistoryCollectionItem {
	pub date: String,
	pub stats: Vec<HistoryClanStats>,
}

// User defines what a user is
#[derive(Clone, Serialize)]
pub struct User {
	pub rights: String,
	pub userid: isize,
	pub nickname: String,
}

// ClanPositionEvery this shows the clan possition in all type stats
#[derive(Clone, Serialize)]
pub struct ClanPositionEvery {
	pub v10l: u32,
	pub winratio: u32,
	pub global_weighted: u32,
	pub global: u32,
	pub gm_elo: u32,
	pub gm_elo6: u32,
	pub gm_elo8: u32,
	pub gm_elo10: u32,
	pub fb_elo: u32,
	pub fb_elo6: u32,
	pub fb_elo8: u32,
	pub fb_elo10: u32,
	pub efficiency: u32,
	pub daily_battles: u32,
	pub battles: u32,
	pub members: u32,
}

impl ClanPositionEvery {
	pub fn empty() -> Self {
		Self {
			v10l: 0,
			winratio: 0,
			global_weighted: 0,
			global: 0,
			gm_elo: 0,
			gm_elo6: 0,
			gm_elo8: 0,
			gm_elo10: 0,
			fb_elo: 0,
			fb_elo6: 0,
			fb_elo8: 0,
			fb_elo10: 0,
			efficiency: 0,
			daily_battles: 0,
			battles: 0,
			members: 0,
		}
	}
}

// ClanNameAndTag is a type that has the tag, name and id of a clan
#[derive(Clone, Serialize)]
pub struct ClanNameAndTag {
	pub tag: String,
	pub name: String,
}
