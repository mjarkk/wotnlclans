#[macro_use]
extern crate lazy_static;

use std::process::exit;
use tokio::spawn;

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
	spawn(async move {
		let discord_setup_res = discord::setup(thread_config).await;
		if let Err(e) = discord_setup_res {
			println!("{}", e);
			// No not exit here as this is more of a report than an error
		}
	});

	let api_config_copy = config.clone();
	let _ = spawn(async move {
		let setup_res = api::setup(api_config_copy).await;
		if let Err(e) = setup_res {
			println!("Api error: {}", e);
			exit(1);
		}
	})
	.await;

	// r := server.SetupRouter()
	// fmt.Println("Running server on", config.WebserverLocation)
	// fmt.Println("ERROR:", r.Run(config.WebserverLocation))
}
