use crate::other::ConfAndFlags;
use futures::Future;
use hyper::{body, Client, Uri};
use hyper_tls::HttpsConnector;
use serde::de::DeserializeOwned;
use serde_json::from_str;
use std::pin::Pin;

pub enum Routes {
  NicknameAndClan(/*player_id*/ String),
  TopClans(/*page_num*/ usize),
  ClanDiscription(/*clan_ids*/ Vec<String>),
  ClanData(/*clan_ids*/ Vec<String>),
  ClanRating(/*clan_ids*/ Vec<String>),
  // ClanIcon(/*clan_id*/ String),
  // PlayerInfoLogedIn(/*player_id*/ String, /*playerAccessToken*/ String),
  // PlayerInfo(/*player_id*/ String),
  // ClanTag(/*clan_id*/ String),
}

impl Routes {
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
  call_route_inner(route, config, false).await
}

pub async fn call_route_inner<T: DeserializeOwned>(
  route: Routes,
  config: &ConfAndFlags,
  is_retry: bool,
) -> Result<T, String> {
  let url = String::from("https://api.worldoftanks.eu") + &route.get_url_path(config.get_wg_key());

  let https = HttpsConnector::new();
  let client = Client::builder().build::<_, hyper::Body>(https);

  let parsed_url: Uri = match url.parse() {
    Ok(v) => v,
    Err(e) => return Err(format!("Invalid url: {}, error: {}", url, e)),
  };

  let resp = match client.get(parsed_url).await {
    Ok(v) => v,
    Err(e) => return Err(format!("Unable to fetch url: {}, error: {}", url, e)),
  };

  let resp_bytes = match body::to_bytes(resp).await {
    Ok(v) => v,
    Err(e) => return Err(format!("Unable to fetch url: {}, error: {}", url, e)),
  };

  let resp_u8 = resp_bytes.as_ref();
  let resp_string = String::from_utf8_lossy(resp_u8).to_string();

  let e = match from_str(&resp_string) {
    Ok(parsed_response) => return Ok(parsed_response),
    Err(e) => e,
  };

  if is_retry {
    return Err(format!(
      "Failed to parse response from: {} with error: {}",
      &url, e
    ));
  }

  println!(
    "Failed to parse response from: {}, error: {}, response: {}",
    &url, e, &resp_string
  );
  return call_route_inner_re(route, config.clone()).await;
}

fn call_route_inner_re<T: DeserializeOwned>(
  route: Routes,
  config: ConfAndFlags,
) -> Pin<Box<dyn Future<Output = Result<T, String>> + Send>> {
  Box::pin(async move { call_route_inner(route, &config, true).await })
}
