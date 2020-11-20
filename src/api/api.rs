use super::routes::{call_route, Routes};
use super::types::{self, DataHelper};
use crate::other::{ConfAndFlags,remove_all_quotes};
use crate::db;
use std::collections::HashMap;

pub fn search_for_clan_ids(config: &ConfAndFlags, is_init: bool) -> Result<(), String> {
    if is_init && config.flags().skip_startup_indexing {
        return Ok(());
    }

    let mut clans = get_all_clan_ids(config)?;
    if config.is_dev() {
        println!("Fetched {} clan ids", clans.len())
    }

    clans = filter_out_clans(config, clans);
    if config.is_dev() {
        println!("Filtered clans, output = {} clans", clans.len())
    }

    // // TODO: Removes blacklisted clans and add extra clans to the clans list
    clans = remove_duplicates(clans);
    if config.is_dev() {
        println!("Removed duplicate clans, output = {} clans", clans.len())
    }

    db::set_clan_ids(clans);

    // when this is ran for the first time make sure to get clan list
    get_clan_data(config, Some(clans));

    Ok(())
}

// GetClanData returns all needed information about clans
// includedClans is not required
fn get_clan_data(config: &ConfAndFlags, included_clans: Option<Vec<String>>) -> Result<(), String> {
    let mut clan_ids: Vec<String> = included_clans.unwrap_or(db::get_clan_ids());

    let blocked_clans: HashMap<String, ()> = db::get_blocked_clans();
    let extra_clans: HashMap<String, ()> = db::get_extra_clans();

    let mut extraAddClans: Vec<bool> = Vec::new();
    for (i, _) in extra_clans {
        extraAddClans.push(true);
    }

    for clan_id in &clan_ids {
        extra_clans.remove(clan_id);
    }
    for (id, _) in extra_clans {
        clan_ids.push(id);
    }

    let to_save: Vec<db::ClanStats> = Vec::new();
    let to_fetch = split_to_chucks(clan_ids);

    for chunk in to_fetch {
        let (info, rating, clans_to_remove_from_ids) =
            match get_clan_data_try(config, chunk, None) {
                Ok(v) => v,
                Err(e) => {
                    println!("get_clan_data error check get_clan_data_try: error: {}", e);
                    continue;
                }
            };

        db.remove_clan_ids(clans_to_remove_from_ids);

        for (id, item) in info {
            let rating = if let Some(rating) = rating.get(&id) {
                rating
            } else {
                continue;
            };
            let is_blocked = blocked_clans.get(&id).is_some();

            if item.tag.len() < 2 {
                continue;
            }

            let emblems: HashMap<String, String> = HashMap::new();
            emblems.insert(String::from("X256.Wowp"), item.emblems.x256.wowp);
            emblems.insert(String::from("X195.Portal"), item.emblems.x195.portal);
            emblems.insert(String::from("X64.Portal"), item.emblems.x64.portal);
            emblems.insert(String::from("X64.Wot"), item.emblems.x64.wot);
            emblems.insert(String::from("X32.Portal"), item.emblems.x32.portal);
            emblems.insert(String::from("X24.Portal"), item.emblems.x24.portal);

            let stats = db::HistoryClanStats {
                tag: item.tag.clone(),
                name: item.name.clone(),
                id: id,
                members: item.members_count,
                battles: rating.battles_count_avg.value,
                daily_battles: rating.battles_count_avg_daily.value,
                efficiency: rating.efficiency.value,
                fb_elo10: rating.fb_elo_rating_10.value,
                fb_elo8: rating.fb_elo_rating_8.value,
                fb_elo6: rating.fb_elo_rating_6.value,
                fb_elo: rating.fb_elo_rating.value,
                gm_elo10: rating.gm_elo_rating_10.value,
                gm_elo8: rating.gm_elo_rating_8.value,
                gm_elo6: rating.gm_elo_rating_6.value,
                gm_elo: rating.gm_elo_rating.value,
                glob_rating: rating.global_rating_avg.value,
                glob_rating_weighted: rating.global_rating_weighted_avg.value,
                win_ratio: rating.wins_ratio_avg.value,
                v10l: rating.v10l_avg.value,
            };

            to_save.push(db::ClanStats {
                blocked: is_blocked,
                tag: item.tag,
                name: item.name,
                color: item.color,
                members: item.members_count,
                description: item.description_html,
                motto: item.motto,
                id: id,
                emblems: emblems,
                stats: stats,
            });
        }
    }
    db.set_current_clans_data(to_save);

    Ok(())
}

// GetClanDataTry is a helper function that retries when the api reports on invalid clan IDs
fn get_clan_data_try(config: &ConfAndFlags, mut chunk: Vec<String>, removed_ids: Option<Vec<String>>) -> Result<(HashMap<String, types::ClanDataData>, HashMap<String, types::ClanRatingData>, Vec<String>), String> {
	chunk = remove_all_quotes(chunk);

    let info: types::ClanData = call_route(Routes::ClanData(chunk), config)?;
    let info_data = match info.get_data() {
        Ok(v) => v,
        Err(e) => {
            if let Some(error_meta) = info.error {
                if error_meta.field == "clan_id" && error_meta.message == "INVALID_CLAN_ID" && error_meta.value != "" {
                    let mut new_chunk: Vec<String> = Vec::new();
                    let to_exclude: Vec<&str> = error_meta.value.split(",").collect();
                    let to_exclude_strings: Vec<String> = to_exclude.iter().map(|id_str| id_str.to_string()).collect();
                    let mut new_removed_ids = removed_ids.unwrap_or(Vec::new());
                    new_removed_ids.append(&mut to_exclude_strings);

                    'outer: for clan_id in chunk {
                        for item in to_exclude {
                            if item == clan_id {
                                continue 'outer;
                            }
                        }
                        new_chunk.push(clan_id);
                    }

                    return get_clan_data_try(config, new_chunk, Some(new_removed_ids));
                }
            }

            return Err(e);
        }
    }

    let rating: types::ClanRating  = call_route(Routes::ClanRating(chunk), config)?;
    let rating_data = rating.get_data()?;

	if info_data.len() != rating_data.len() {
		Err(String::from("No clans in response"))
	} else {
        Ok((info_data, rating_data, removed_ids.unwrap_or(Vec::new())))
    }
}

// removes duplicates from an array
fn remove_duplicates(input: Vec<String>) -> Vec<String> {
    let mut output: Vec<String> = Vec::new();
    for input_item in input {
        let mut exsists = false;
        for output_item in output {
            if input_item == output_item {
                exsists = true;
                break;
            }
        }
        if !exsists {
            output.push(input_item);
        }
    }
    output
}

// FilterOutClans filters out all not dutch clans out of a input list
fn filter_out_clans(config: &ConfAndFlags, clan_ids: Vec<String>) -> Vec<String> {
    let tofetch = split_to_chucks(clan_ids);
    let mut to_return: Vec<String> = Vec::new();
    for ids in tofetch {
        let out: types::ClanDiscription = match call_route(Routes::ClanDiscription(ids), config) {
            Ok(v) => v,
            Err(e) => {
                println!("filter_out_clans api call failed, error: {}", e);
                continue;
            }
        };
        let data = match out.get_data() {
            Ok(v) => v,
            Err(e) => {
                println!("filter_out_clans api call failed, error: {}", e);
                continue;
            }
        };

        for (clan_id, clan) in data {
            if is_spesified_lang(config, clan.description) {
                to_return.push(clan_id);
                if config.is_dev() {
                    println!("found clan: {}", clan.tag);
                }
            }
        }
    }
    to_return
}

// SplitToChucks splits up a input list in arrays of 100
// This makes it easy to request a lot of things at the same time from the wargaming api
fn split_to_chucks(list: Vec<String>) -> Vec<Vec<String>> {
    let mut res: Vec<Vec<String>> = vec![];
    for item in list {
        let mut out = res.last_mut().unwrap();
        if out.len() == 100 {
            res.push(vec![item]);
        } else {
            out.push(item);
        }
    }
    res
}

// GetAllClanIds returns all clan ids
fn get_all_clan_ids(config: &ConfAndFlags) -> Result<Vec<String>, String> {
    let mut ids: Vec<String> = Vec::new();
    let mut page = 0;

    loop {
        page += 1;
        if page > config.flags().get_max_index_pages() {
            break;
        }

        let out: types::TopClans = call_route(Routes::TopClans(page), config)?;
        let data = out.get_data()?;

        if data.len() == 0 {
            break;
        }

        for clan in data {
            ids.push(clan.clan_id.to_string());
        }

        if page % 10 == 1 {
            if config.is_dev() {
                println!("Fetched {} clans", ids.len());
            }
        }
    }

    Ok(ids)
}

// IsSpesifiedLang checks a setence for allowed and disallowed words
fn is_spesified_lang(config: &ConfAndFlags, input: String) -> bool {
    if input.len() == 0 {
        return false;
    }
    let formatted_input = input
        .to_lowercase()
        .replace("\n", " ")
        .replace("\t", " ")
        .replace("\r", " ")
        .replace("  ", " ");
    let formatted_input_parts: Vec<&str> = formatted_input.split(" ").collect();

    let inner_conf = config.conf();

    let mut res = false;
    for mut word in formatted_input_parts {
        word = word.trim();
        if word == "" {
            continue;
        }

        for disallowed_word in &inner_conf.disallowed_words {
            if word.contains(disallowed_word.trim()) {
                return false;
            }
        }

        if !res {
            for allowed_word in &inner_conf.allowed_words {
                if word.contains(allowed_word.trim()) {
                    res = true;
                    break;
                }
            }
        }
    }

    return res;
}