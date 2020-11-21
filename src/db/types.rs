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

pub struct ClanStatsEmblems {
	pub x256_wowp: String,
	pub x195_portal: String,
	pub x64_portal: String,
	pub x64_wot: String,
	pub x32_portal: String,
	pub x24_portal: String,
}

// HistoryClanStats this is what to be exepected to get back per clan from the database when requesting old clan data
pub struct HistoryClanStats {
	pub tag: String,
	pub name: String,
	pub id: String,
	pub members: usize,
	pub battles: f64,
	pub daily_battles: f64,
	pub efficiency: f64,
	pub fb_elo10: f64,
	pub fb_elo8: f64,
	pub fb_elo6: f64,
	pub fb_elo: f64,
	pub gm_elo10: f64,
	pub gm_elo8: f64,
	pub gm_elo6: f64,
	pub gm_elo: f64,
	pub glob_rating: f64,
	pub glob_rating_weighted: f64,
	pub win_ratio: f64,
	pub v10l: f64,
}

// HistoryCollectionItem is what the contens is of 1 hisotry colleciton item
pub struct HistoryCollectionItem {
	pub date: String,
	pub stats: Vec<HistoryClanStats>,
}

// User defines what a user is
pub struct User {
	pub rights: String,
	pub userid: isize,
	pub nickname: String,
}

// ClanPositionEvery this shows the clan possition in all type stats
pub struct ClanPositionEvery {
	pub v10l: isize,
	pub winratio: isize,
	pub global_weighted: isize,
	pub global: isize,
	pub gm_elo: isize,
	pub gm_elo6: isize,
	pub gm_elo8: isize,
	pub gm_elo10: isize,
	pub fb_elo: isize,
	pub fb_elo6: isize,
	pub fb_elo8: isize,
	pub fb_elo10: isize,
	pub efficiency: isize,
	pub daily_battles: isize,
	pub battles: isize,
	pub members: isize,
}

// ClanNameAndTag is a type that has the tag, name and id of a clan
pub struct ClanNameAndTag {
	pub tag: String,
	pub name: String,
}
