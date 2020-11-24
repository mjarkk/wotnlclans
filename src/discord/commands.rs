use crate::db;
use std::collections::HashMap;

// Option is a command for the list
pub struct CommandOption {
  pub to_match: &'static str,    // is the command
  pub discription: &'static str, // the discription of the command
  pub handler: Box<dyn Fn(HashMap<String, String>) -> String>, // is the command that will be executed when the command happends
}

pub fn get_options() -> Vec<CommandOption> {
  vec![
    CommandOption {
      to_match: "top clans",
      discription: "List the current top clans",
      handler: Box::new(|_: HashMap<String, String>| -> String {
        let current_stats = db::get_current_stats();
        let sorted_ratings = db::get_sorted_ratings();

        let mut top10: Vec<db::ClanStats> = Vec::new();

        for (_, clan) in current_stats.iter() {
          if let Some(clan_pos) = sorted_ratings.get(&clan.id) {
            let eff = clan_pos.efficiency;
            if eff >= 10 {
              continue;
            }
            top10.push(clan.clone());
          }
        }

        let eff = db::SortOn::Efficiency;
        top10.sort_by(|a, b| eff.sort(&a.stats, &b.stats));

        let mut res = String::from("Top 10 clans:");
        for (pos, clan) in top10.iter().enumerate() {
          res = format!("{}\n{}", res, print_clan_line(&clan, pos as u32 + 1, false))
        }

        res
      }),
    },
    CommandOption {
      to_match: "clan {{clanTag}} stats",
      discription: "Show the stats and position of a spesific clan",
      handler: Box::new(|args: HashMap<String, String>| -> String {
        let empty_string = String::new();
        let tag = match args.get("clanTag") {
          Some(v) => v,
          None => &empty_string,
        };

        if tag.len() == 0 {
          return String::from("You must provide a clan tag to search for: clan {{clanTag}} stats");
        }

        let current_stats = db::get_current_stats();
        let sorted_ratings = db::get_sorted_ratings();

        for (_, clan) in current_stats.iter() {
          if clan.tag.to_lowercase() == tag.trim().to_string().to_lowercase() {
            let mut real_clan_pos = 0;
            if let Some(clan_pos) = sorted_ratings.get(&clan.id) {
              real_clan_pos = clan_pos.efficiency + 1
            };
            return print_clan_line(clan, real_clan_pos, true);
          }
        }

        String::from(
          ":eyes: We have looked everyware but cloud not found the clan you are looking for",
        )
      }),
    },
  ]
}

// PrintClanLine returns a printable stats line for discord for a clan
fn print_clan_line(clan: &db::ClanStats, clan_position: u32, with_extras: bool) -> String {
  let mut real_clan_pos = String::new();

  if clan_position != 0 {
    real_clan_pos = String::from(format!("**{}**", clan_position.to_string().trim()).trim());
    if with_extras {
      if clan_position == 1 {
        real_clan_pos += " *Best clan*:100:";
      } else if clan_position <= 5 {
        real_clan_pos += " *Top 5 clan*:star:";
      }
    }
  }

  let check_f64 = |d: Option<f64>| match d {
    Some(val) => val.to_string(),
    None => String::from("??"),
  };

  let mut res = format!(
    "**[{}] #{}, ClanRating: **{}**, Winrate: **{}**, Strongholds: **{}**, Global Tier 10: **{}**",
    clan.tag,
    real_clan_pos,
    check_f64(clan.stats.efficiency),
    check_f64(clan.stats.win_ratio),
    check_f64(clan.stats.fb_elo),
    check_f64(clan.stats.fb_elo10),
  );
  if with_extras {
    res = format!("{}\nhttps://wotnlbeclans.eu/#/clan/{}", res, clan.id);
  }

  res
}

pub fn get_help(prefix: &str) -> String {
  let mut out = String::new();
  for option in get_options() {
    out = format!(
      "{}\n{} {}\n   > {}",
      out, prefix, option.to_match, option.discription
    );
  }

  format!("Beep boop this is what i can do:\n```{}```", out)
}
