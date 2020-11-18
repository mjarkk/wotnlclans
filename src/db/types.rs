use std::collections::HashMap;

struct ClanStats {
	tag: String,
	name: String,
	color: String,
	members: usize,
	description: String,
	motto: String,
	id: String,
	emblems: HashMap<String, String>,
	blocked: bool,
	stats: HistoryClanStats,
}

// HistoryClanStats this is what to be exepected to get back per clan from the database when requesting old clan data
struct HistoryClanStats {
	tag: String,
	name: String,
	id: String,
	members: usize,
	battles: f64,
	dailybattles: f64,
	efficiency: f64,
	fbelo10: f64,
	fbelo8: f64,
	fbelo6: f64,
	fbelo: f64,
	gmelo10: f64,
	gmelo8: f64,
	gmelo6: f64,
	gmelo: f64,
	globrating: f64,
	globRatingweighted: f64,
	winratio: f64,
	v10l: f64,
}

// HistoryCollectionItem is what the contens is of 1 hisotry colleciton item
struct HistoryCollectionItem {
	date: String,
	stats: Vec<HistoryClanStats>,
}

// User defines what a user is
struct User {
	rights: String,
	userid: isize,
	nickname: String,
}

// ClanPositionEvery this shows the clan possition in all type stats
struct ClanPositionEvery {
	v10l: isize,
	winratio: isize,
	globalWeighted: isize,
	global: isize,
	gmelo: isize,
	gmelo6: isize,
	gmelo8: isize,
	gmelo10: isize,
	fbelo: isize,
	fbelo6: isize,
	fbelo8: isize,
	fbelo10: isize,
	efficiency: isize,
	dailybattles: isize,
	battles: isize,
	members: isize,
}

// ClanNameAndTag is a type that has the tag, name and id of a clan
struct ClanNameAndTag {
	tag: String,
	name: String,
}
