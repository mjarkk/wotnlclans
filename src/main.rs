#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate actix_web;
#[macro_use]
extern crate serde;

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
	spawn(async move {
		let discord_setup_res = discord::setup(thread_config).await;
		if let Err(e) = discord_setup_res {
			println!("{}", e);
			// No not exit here as this is more of a report than an error
		}
	});

	let api_config_copy = config.clone();
	spawn(async move {
		let setup_res = api::setup(api_config_copy).await;
		if let Err(e) = setup_res {
			println!("Api error: {}", e);
			exit(1);
		}
	});

	println!("Running server on {}", config.webserver_location());
	let res = web_server::serve(config).await;
	if let Err(e) = res {
		println!("Web server error: {}", e);
	} else {
		println!("Webserver stopped unexpectedly without any errors");
	}
	exit(1);
}
