#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate actix_web;
#[macro_use]
extern crate serde;
#[macro_use]
extern crate tokio;

use std::process::exit;
use tokio::spawn;

pub mod api;
pub mod db;
mod discord;
pub mod other;
mod web_server;

#[tokio::main]
async fn main() {
	let config = other::ConfAndFlags::setup();

	let thread_config = config.clone();
	let discord_task = spawn(async move {
		let discord_setup_res = discord::setup(thread_config).await;
		if let Err(e) = discord_setup_res {
			println!("{}", e);
			// No not exit here as this is more of a report than an error
		}
	});

	let api_config_copy = config.clone();
	let api_task = spawn(async move {
		let setup_res = api::setup(api_config_copy).await;
		if let Err(e) = setup_res {
			println!("Api error: {}", e);
			exit(1);
		}
	});

	let webserver_task = web_server::serve_unwrap(config);

	let _ = join!(discord_task, api_task, webserver_task);
}
