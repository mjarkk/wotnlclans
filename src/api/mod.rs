pub mod routes;
pub mod types;
pub mod api;

use super::other::ConfAndFlags;
use routes::{call_route, Routes};

pub fn setup(config: ConfAndFlags) -> Result<(), String> {
  println!("setting up the api...");
  if config.get_wg_key().len() == 0 {
    return Err(String::from("No wargaming api key defined"));
  }

  check_api(&config)?;

  println!("Running api...");
  api::search_for_clan_ids(&config, true)?
  // GetIcons()
  // RunSchedule(config)

  Ok(())
}

fn check_api(config: &ConfAndFlags) -> Result<types::NicknameAndClan, String> {
  let res: types::NicknameAndClan =
    call_route(Routes::NicknameAndClan("516673968".into()), config)?;

  Ok(res)
}
