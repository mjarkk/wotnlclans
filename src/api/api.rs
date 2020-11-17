use super::routes::{call_route, Routes};
use super::types::{self, DataHelper};
use crate::other::ConfAndFlags;

pub fn search_for_clan_ids(config: &ConfAndFlags, is_init: bool) -> Result<(), String> {
    if is_init && config.flags().skip_startup_indexing {
        return Ok(());
    }

    let mut clans = get_all_clan_ids(config)?;
    if config.is_dev() {
        println!("Fetched {} clan ids", clans.len())
    }
    clans = filter_out_clans(clans, config);

    // config.DevPrint("Filtered out all dutch clans,", len(clans), "clans")
    // // TODO: Removes blacklisted clans and add extra clans to the clans list
    // clans = RemovedDuplicates(clans)
    // config.DevPrint("Removed all duplicate clans")
    // db.SetClanIDs(clans)

    // // when this is ran for the first time make sure to get clan list
    // GetClanData(config.WargamingKey, clans)

    Ok(())
}

// FilterOutClans filters out all not dutch clans out of a input list
fn filter_out_clans(config: &ConfAndFlags, clan_ids: Vec<String>) {
    tofetch := SplitToChucks(clanList)
    toReturn := []string{}
    for _, ids := range tofetch {
    	rawOut, err := CallRoute("clanDiscription", map[string]string{"clanID": strings.Join(ids, "%2C")}, config.WargamingKey) // %2C = ,
    	if err != nil {
    		apiErr("FilterOutClans", err, "error check CallRoute")
    		continue
    	}
    	var out ClanDiscription
    	json.Unmarshal([]byte(rawOut), &out)
    	if out.Status != "ok" {
    		apiErr("FilterOutClans", errors.New(out.Error.Message), "api status is not OK json.Unmarshal")
    		continue
    	}
    	for clanID, clan := range out.Data {
    		if IsSpesifiedLang(clan.Description, config) {
    			toReturn = append(toReturn, clanID)
    			config.DevPrint("found clan:", clan.Tag)
    		}
    	}
    }
    return toReturn
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
