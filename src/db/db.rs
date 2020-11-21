use crate::other::remove_quotes;
use std::collections::HashMap;
use std::sync::{Mutex, MutexGuard};

lazy_static! {
	static ref CLAN_IDS: Mutex<HashMap<String, ()>> = Mutex::new(HashMap::new());
	static ref EXTRA_CLAN_IDS: Mutex<HashMap<String, ()>> = Mutex::new(HashMap::new());
}

pub fn get_clan_ids<'a>() -> MutexGuard<'a, HashMap<String, ()>> {
	CLAN_IDS.lock().unwrap()
}

pub fn get_extra_clan_ids<'a>() -> MutexGuard<'a, HashMap<String, ()>> {
	EXTRA_CLAN_IDS.lock().unwrap()
}

// RemoveClanIDs removes the "toRemove" from the clan IDs collection
pub fn remove_clan_ids(to_remove_ids: Vec<String>) {
	if to_remove_ids.len() == 0 {
		return;
	}

	let mut clan_ids = get_clan_ids();
	let mut extra_clan_ids = get_extra_clan_ids();

	for id in to_remove_ids {
		let formatted_id = remove_quotes(&id);
		clan_ids.remove(&formatted_id);
		extra_clan_ids.remove(&formatted_id);
	}
}

pub fn set_clan_ids(ids: &Vec<String>) {
	let mut ids_map: HashMap<String, ()> = HashMap::new();
	for id in ids {
		ids_map.insert(id.to_string(), ());
	}

	let mut clan_ids = get_clan_ids();
	*clan_ids = ids_map;
}
