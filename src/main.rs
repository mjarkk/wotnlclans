#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate futures;

use std::process::exit;
use tokio::spawn;
use tokio::time::{sleep, Duration};

pub mod api;
pub mod db;
pub mod discord;
pub mod other;

#[tokio::main]
async fn main() {
	println!("------------------------");
	println!(" press CTRL + C to exit ");
	println!("------------------------");
	println!();

	let config = other::ConfAndFlags::setup();

	let thread_config = config.clone();
	spawn(async move { discord::setup(thread_config) });

	let api_config_copy = config.clone();
	spawn(async move {
		let setup_res = api::setup(api_config_copy).await;
		if let Err(err) = setup_res {
			println!("Api error: {}", err);
			exit(1);
		}
	});

	loop {
		sleep(Duration::from_secs(10)).await;
	}

	// r := server.SetupRouter()
	// fmt.Println("Running server on", config.WebserverLocation)
	// fmt.Println("ERROR:", r.Run(config.WebserverLocation))
}
