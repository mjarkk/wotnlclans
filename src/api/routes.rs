use crate::other::ConfAndFlags;
use reqwest::blocking::get;
use serde::de::DeserializeOwned;
use serde_json::from_str;

pub enum Routes<'a> {
  NicknameAndClan(/*player_id*/ String),
  TopClans(/*page_num*/ usize),
  ClanDiscription(/*clan_ids*/ &'a Vec<String>),
  ClanData(/*clan_ids*/ &'a Vec<String>),
  ClanRating(/*clan_ids*/ &'a Vec<String>),
  // ClanIcon(/*clan_id*/ String),
  // PlayerInfoLogedIn(/*player_id*/ String, /*playerAccessToken*/ String),
  // PlayerInfo(/*player_id*/ String),
  // ClanTag(/*clan_id*/ String),
}

impl<'a> Routes<'a> {
  pub fn get_url_path(&self, key: &str) -> String {
    match self {
      Self::NicknameAndClan(player_id) => format!(
        "/wot/account/info/?application_id={}&account_id={}&fields=nickname%2Cclan_id",
        key, player_id
      ),
      Self::TopClans(page_num) => format!(
        "/wgn/clans/list/?application_id={}&limit=100&game=wot&fields=clan_id&page_no={}",
        key, page_num
      ),
      Self::ClanDiscription(clan_ids) => format!(
        "/wgn/clans/info/?application_id={}&clan_id={}&fields=description%2Ctag",
        key,
        clan_ids.join("%2C")
      ),
      Self::ClanData(clan_ids) => format!(
        "/wgn/clans/info/?application_id={}&clan_id={}&game=wot",
        key,
        clan_ids.join("%2C")
      ),
      Self::ClanRating(clan_ids) => format!(
        "/wot/clanratings/clans/?application_id={}&clan_id={}",
        key,
        clan_ids.join("%2C")
      ),
      // Self::ClanIcon(clan_id) => format!(
      //   "/wgn/clans/info/?application_id={}&clan_id={}&fields=tag%2Ccolor%2Cemblems.x195",
      //   key, clan_id
      // ),
      // Self::PlayerInfoLogedIn(player_id, player_access_token) => format!(
      //   "/wot/account/info/?application_id={}&account_id={}&access_token={}",
      //   key, player_id, player_access_token
      // ),
      // Self::PlayerInfo(player_id) => format!(
      //   "/wot/account/info/?application_id={}&account_id={}",
      //   key, player_id
      // ),
      // Self::ClanTag(clan_id) => format!(
      //   "/wgn/clans/info/?application_id={}&clan_id={}&fields=tag",
      //   key, clan_id
      // ),
    }
  }
}

pub async fn call_route<T: DeserializeOwned>(
  route: Routes,
  config: &ConfAndFlags,
) -> Result<T, String> {
  let url = String::from("https://api.worldoftanks.eu") + &route.get_url_path(config.get_wg_key());

  let response = get(&url)
    .or_else(|e| Err(format!("Failed to get {} with error: {}", &url, e)))?
    .text()
    .or_else(|e| Err(format!("Failed to get {} with error: {}", &url, e)))?;

  let parsed_response: T = from_str(&response).or_else(|e| {
    Err(format!(
      "Failed to parse response from: {} with error: {}",
      &url, e
    ))
  })?;

  Ok(parsed_response)
}
