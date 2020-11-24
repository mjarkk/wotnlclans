use super::{ok_res, HTTPError, Res};
use crate::db;
use crate::other::ConfAndFlags;
use actix_web::web::{scope, Path, ServiceConfig};
use actix_web::HttpResponse;

pub fn routes(app: &mut ServiceConfig) {
	app.service(
		scope("")
			.service(clan_data)
			.service(clan_data_ids)
			.service(search_query_sorton)
			.service(clan_ids_to_get)
			.service(clan_description_clan_id)
			.service(discord),
	);
}

#[get("/clanData")]
pub async fn clan_data() -> Res {
	let mut data = db::get_current_clans_top(50)?;

	for item in data.iter_mut() {
		item.description = String::new();
	}

	ok_res(data)
}

#[get("/clanData/{ids}")]
pub async fn clan_data_ids(Path(ids): Path<String>) -> Res {
	let parsed_ids: Vec<String> = ids.split("+").map(|d| d.to_string()).collect();

	let mut stats = db::get_current_clans_by_id(parsed_ids)
		.or_else(|e| HTTPError::new(format!("Failed to get clans by ID, error: {}", e)))?;

	for item in stats.iter_mut() {
		item.description = String::new();
	}

	ok_res(stats)
}

#[get("/search/{query}/{sort_on}")]
pub async fn search_query_sorton(Path((query, sort_on)): Path<(String, String)>) -> Res {
	let parsed_sort_on: db::SortOn = sort_on.clone().into();

	if query.len() < 1 {
		return Err("the query param must be longer than 1 caracter \"/search/:query/:sortOn\"".into());
	}

	let list = db::search_clans(query.clone(), parsed_sort_on).or_else(|_| {
		Err(format!(
			"Failed to search for clans using query: {}, and sorting on: {}",
			&query, &sort_on
		))
	})?;

	ok_res(list)
}

#[derive(Serialize)]
struct ClanIdsToGetAllOut<T> {
	status: bool,
	data: T,
	default: String,
}

#[get("/clanIDs/{sort_on}")]
pub async fn clan_ids_to_get(Path(sort_on): Path<String>) -> Res {
	if sort_on == "all" {
		let res = db::light_clan_positions_all();

		Ok(HttpResponse::Ok().json(ClanIdsToGetAllOut {
			status: true,
			data: res,
			default: String::from("Efficiency"),
		}))
	} else {
		let sort_on_parsed: db::SortOn = sort_on.into();
		let res = db::light_clan_positions(sort_on_parsed);

		Ok(HttpResponse::Ok().json(ClanIdsToGetAllOut {
			status: true,
			data: res,
			default: String::from("Efficiency"),
		}))
	}
}

#[get("/clanDescription/{clan_id}")]
pub async fn clan_description_clan_id(Path(clan_id): Path<String>) -> Res {
	let stats = db::get_current_clans_by_id(vec![clan_id])?;
	if let Some(clan) = stats.get(0) {
		ok_res(clan.description.clone())
	} else {
		Err("Clan not found".into())
	}
}

#[derive(Serialize)]
struct DiscordRes {
	status: bool,
	enabled: bool,
	invite_link: Option<String>,
}

#[get("/discord")]
pub async fn discord(config: ConfAndFlags) -> Res {
	let inner_conf = config.conf();

	let res = if inner_conf.discord_auth_token.len() > 0 {
		DiscordRes {
			status: true,
			enabled: false,
			invite_link: None,
		}
	} else {
		DiscordRes {
			status: true,
			enabled: true,
			invite_link: Some(config.conf().discord_auth_url.clone()),
		}
	};

	Ok(HttpResponse::Ok().json(res))
}
