use std::collections::HashMap;
use std::sync::{Mutex, MutexGuard};

lazy_static! {
  static ref BLOCKED_CLANS_IDS: Mutex<HashMap<String, ()>> = Mutex::new(HashMap::new());
  static ref EXTRA_CLANS_IDS: Mutex<HashMap<String, ()>> = Mutex::new(HashMap::new());
}

pub fn get_blocked_clans_ids<'a>() -> MutexGuard<'a, HashMap<String, ()>> {
  BLOCKED_CLANS_IDS.lock().unwrap()
}

pub fn get_extra_clans_ids<'a>() -> MutexGuard<'a, HashMap<String, ()>> {
  EXTRA_CLANS_IDS.lock().unwrap()
}
