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
		discord::setup(thread_config).await;
	});

	let api_config_copy = config.clone();
	let _ = spawn(async move {
		let setup_res = api::setup(api_config_copy).await;
		if let Err(err) = setup_res {
			println!("Api error: {}", err);
			exit(1);
		}
	})
	.await;

	// r := server.SetupRouter()
	// fmt.Println("Running server on", config.WebserverLocation)
	// fmt.Println("ERROR:", r.Run(config.WebserverLocation))
}
