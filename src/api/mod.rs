pub mod routes;
pub mod types;

use super::other::ConfAndFlags;
use routes::{call_route, Routes};

pub fn setup(config: ConfAndFlags) -> Result<(), String> {
  check_api(config)?;

  // fmt.Println("setting up the api...")
  // if len(config.WargamingKey) == 0 {
  // 	return errors.New("No wargaming api key defined")
  // }
  // fmt.Println("Running api...")
  // GetIcons()
  // clanIds := db.GetClanIDs()
  // if len(clanIds) == 0 || config.ForceStartupIndexing {
  // 	err := SearchForClanIds(config, true)
  // 	if err != nil {
  // 		fmt.Println("ERROR: [SearchForClanIds]:", err.Error())
  // 		return err
  // 	}
  // } else {
  // 	GetClanData(config.WargamingKey, clanIds)
  // }
  // GetIcons()
  // RunSchedule(config)

  Ok(())
}

fn check_api(config: ConfAndFlags) -> Result<types::NicknameAndClan, String> {
  let res: types::NicknameAndClan = call_route(
    Routes::NicknameAndClan("516673968".into()),
    &config.conf().wargaming_key,
  )?;

  Ok(res)
}
