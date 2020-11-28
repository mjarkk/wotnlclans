mod api;
mod icons;
mod routes;
mod types;

use super::other::ConfAndFlags;
use routes::{call_route, Routes};
use tokio::time::{delay_for, Duration};

pub async fn setup(config: ConfAndFlags) -> Result<(), String> {
  println!("setting up the api...");
  if config.get_wg_key().len() == 0 {
    return Err(String::from("No wargaming api key defined"));
  }

  check_api(&config).await?;

  println!("Running api...");
  api::search_for_clan_ids(&config).await?;
  icons::get().await?;
  run_schedule(&config).await;

  Ok(())
}

async fn check_api(config: &ConfAndFlags) -> Result<types::NicknameAndClan, String> {
  let res: types::NicknameAndClan =
    call_route(Routes::NicknameAndClan("516673968".into()), config).await?;

  Ok(res)
}

// RunSchedule runs GetClanData every few hours
async fn run_schedule(config: &ConfAndFlags) {
  let mut count: u8 = 0;
  loop {
    let timeout_4_hours = Duration::from_secs(60 * 60 * 4);
    delay_for(timeout_4_hours).await;

    count += 1;
    if count == 12 {
      count = 0;
      if let Err(e) = api::search_for_clan_ids(config).await {
        println!("ERROR: [search_for_clan_ids]: {}", e);
      }
    } else {
      if let Err(e) = api::get_clan_data(config, None).await {
        println!("ERROR: [get_clan_data]: {}", e);
      }
    }
    if let Err(e) = icons::get().await {
      println!("ERROR: [icons::get]: {}", e);
    }
  }
}
