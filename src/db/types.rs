use std::collections::HashMap;

pub struct ClanStats {
	pub tag: String,
	pub name: String,
	pub color: String,
	pub members: usize,
	pub description: String,
	pub motto: String,
	pub id: String,
	pub emblems: HashMap<String, String>,
	pub blocked: bool,
	pub stats: HistoryClanStats,
}

// HistoryClanStats this is what to be exepected to get back per clan from the database when requesting old clan data
pub struct HistoryClanStats {
	pub tag: String,
	pub name: String,
	pub id: String,
	pub members: usize,
	pub battles: f64,
	pub dailybattles: f64,
	pub efficiency: f64,
	pub fbelo10: f64,
	pub fbelo8: f64,
	pub fbelo6: f64,
	pub fbelo: f64,
	pub gmelo10: f64,
	pub gmelo8: f64,
	pub gmelo6: f64,
	pub gmelo: f64,
	pub globrating: f64,
	pub globRatingweighted: f64,
	pub winratio: f64,
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
	pub globalWeighted: isize,
	pub global: isize,
	pub gmelo: isize,
	pub gmelo6: isize,
	pub gmelo8: isize,
	pub gmelo10: isize,
	pub fbelo: isize,
	pub fbelo6: isize,
	pub fbelo8: isize,
	pub fbelo10: isize,
	pub efficiency: isize,
	pub dailybattles: isize,
	pub battles: isize,
	pub members: isize,
}

// ClanNameAndTag is a type that has the tag, name and id of a clan
pub struct ClanNameAndTag {
	pub tag: String,
	pub name: String,
}
