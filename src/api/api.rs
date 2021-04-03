use super::routes::{call_route, Routes};
use super::types::{
    ClanData, ClanDataData, ClanDiscription, ClanRating, ClanRatingData, Response, TopClans,
};
use crate::db;
use crate::other::{remove_all_quotes, ConfAndFlags};
use futures::Future;
use std::collections::HashMap;
use std::pin::Pin;

pub async fn search_for_clan_ids(config: &ConfAndFlags) -> Result<(), String> {
    let mut clans = get_all_clan_ids(config).await?;
    println!("Fetched {} clan ids", clans.len());

    clans = filter_out_clans(config, clans).await;
    println!("Filtered clans, output = {} clans", clans.len());

    // // TODO: Removes blacklisted clans and add extra clans to the clans list
    clans = remove_duplicates(clans);
    println!("Removed duplicate clans, output = {} clans", clans.len());

    db::set_clan_ids(&clans);

    // when this is ran for the first time make sure to get clan list
    get_clan_data(config, Some(clans)).await?;

    Ok(())
}

// GetClanData returns all needed information about clans
// includedClans is not required
pub async fn get_clan_data(
    config: &ConfAndFlags,
    included_clans: Option<Vec<String>>,
) -> Result<(), String> {
    let mut clan_ids: HashMap<String, ()> = if let Some(ids) = included_clans {
        let mut res: HashMap<String, ()> = HashMap::new();
        for id in ids {
            res.insert(id, ());
        }
        res
    } else {
        db::get_clan_ids().clone()
    };

    let blocked_clans = db::get_blocked_clans_ids().clone();
    let mut extra_clans = db::get_extra_clans_ids().clone();

    for (clan_id, _) in &clan_ids {
        extra_clans.remove(clan_id);
    }
    for (id, _) in extra_clans {
        clan_ids.insert(id, ());
    }

    let mut to_save: Vec<db::ClanStats> = Vec::new();
    let to_fetch = split_map_to_chucks(clan_ids);

    for chunk in to_fetch {
        let res = get_clan_data_try(config.clone(), chunk, None).await;
        let (info, rating, clans_to_remove_from_ids) = match res {
            Ok(v) => v,
            Err(e) => {
                println!("get_clan_data error check get_clan_data_try: error: {}", e);
                continue;
            }
        };

        db::remove_clan_ids(clans_to_remove_from_ids);

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

            let emblems = db::ClanStatsEmblems {
                x256_wowp: item.emblems.x256.wowp,
                x195_portal: item.emblems.x195.portal,
                x64_portal: item.emblems.x64.portal,
                x64_wot: item.emblems.x64.wot,
                x32_portal: item.emblems.x32.portal,
                x24_portal: item.emblems.x24.portal,
            };

            let stats = db::HistoryClanStats {
                tag: item.tag.clone(),
                name: item.name.clone(),
                id: id.clone(),
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
                id: id.clone(),
                emblems: emblems,
                stats: stats,
            });
        }
    }
    db::set_current_clans_data(to_save)?;

    Ok(())
}

fn get_clan_data_try_re(
    config: ConfAndFlags,
    chunk_input: Vec<String>,
    removed_ids: Option<Vec<String>>,
) -> Pin<
    Box<
        dyn Future<
                Output = Result<
                    (
                        HashMap<String, ClanDataData>,
                        HashMap<String, ClanRatingData>,
                        Vec<String>,
                    ),
                    String,
                >,
            > + Send,
    >,
> {
    Box::pin(
        async move { get_clan_data_try(config, chunk_input.clone(), removed_ids.clone()).await },
    )
}

// GetClanDataTry is a helper function that retries when the api reports on invalid clan IDs
async fn get_clan_data_try(
    config: ConfAndFlags,
    chunk_input: Vec<String>,
    removed_ids: Option<Vec<String>>,
) -> Result<
    (
        HashMap<String, ClanDataData>,
        HashMap<String, ClanRatingData>,
        Vec<String>,
    ),
    String,
> {
    let chunk = remove_all_quotes(chunk_input);

    let clan_data_route = Routes::ClanData(chunk.clone());
    let info: Response<ClanData> = call_route(clan_data_route, &config).await?;
    let info_data = match info.get_data() {
        Ok(v) => v,
        Err(e) => {
            if let Some(meta) = info.error {
                match (meta.field, meta.value) {
                    (Some(field), Some(value)) => {
                        if field == "clan_id" && meta.message == "INVALID_CLAN_ID" && value != "" {
                            let mut new_chunk: Vec<String> = Vec::new();
                            let mut to_exclude: Vec<String> =
                                value.split(",").map(|id_str| id_str.to_string()).collect();

                            'outer: for clan_id in chunk {
                                for item in &to_exclude {
                                    if item == &clan_id {
                                        continue 'outer;
                                    }
                                }
                                new_chunk.push(clan_id);
                            }
                            let mut new_removed_ids = removed_ids.unwrap_or(Vec::new());
                            new_removed_ids.append(&mut to_exclude);

                            return get_clan_data_try_re(config, new_chunk, Some(new_removed_ids))
                                .await;
                        }
                    }
                    _ => {}
                }
            }

            return Err(e);
        }
    };

    let clan_rating_route = Routes::ClanRating(chunk);
    let rating: Response<ClanRating> = call_route(clan_rating_route, &config).await?;
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
        for output_item in output.iter() {
            if &input_item == output_item {
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
async fn filter_out_clans(config: &ConfAndFlags, clan_ids: Vec<String>) -> Vec<String> {
    let tofetch = split_to_chucks(clan_ids);
    let mut to_return: Vec<String> = Vec::new();
    for ids in tofetch {
        let route = Routes::ClanDiscription(ids);
        let out: Response<ClanDiscription> = match call_route(route, config).await {
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
            let (description, tag) = match (clan.description, clan.tag) {
                (Some(des), Some(tag)) => (des, tag),
                _ => continue,
            };
            if !is_spesified_lang(config, description) {
                continue;
            }

            to_return.push(clan_id);
            if config.is_dev() {
                println!("found clan: {}", tag);
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
        if let Some(out) = res.last_mut() {
            if out.len() < 100 {
                out.push(item);
                continue;
            }
        }
        res.push(vec![item]);
    }
    res
}

fn split_map_to_chucks<T>(list: HashMap<String, T>) -> Vec<Vec<String>> {
    let mut res: Vec<Vec<String>> = vec![];
    for (item, _) in list {
        if let Some(out) = res.last_mut() {
            if out.len() < 100 {
                out.push(item);
                continue;
            }
        }
        res.push(vec![item]);
    }
    res
}

// GetAllClanIds returns all clan ids
async fn get_all_clan_ids(config: &ConfAndFlags) -> Result<Vec<String>, String> {
    let mut ids: Vec<String> = Vec::new();
    let mut page = 0;

    loop {
        page += 1;
        if page > config.flags().get_max_index_pages() {
            break;
        }

        let out: Response<TopClans> = call_route(Routes::TopClans(page), config).await?;
        let data = out.get_data()?;

        if data.len() == 0 {
            break;
        }

        for clan in data {
            ids.push(clan.clan_id.to_string());
        }

        if config.is_dev() {
            if page % 10 == 1 {
                println!("Fetched {} clans", ids.len());
            }
        } else {
            if page % 50 == 1 {
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
