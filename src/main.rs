#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate futures;

use std::process::exit;
use std::thread;

pub mod api;
pub mod db;
pub mod other;

#[actix_web::main]
async fn main() {
	println!("------------------------");
	println!(" press CTRL + C to exit ");
	println!("------------------------");
	println!();

	let config = other::ConfAndFlags::setup();

	let thread_config = config.clone();
	thread::spawn(move || {
		// discord::setup(thread_config)
	});

	let api_config_copy = config.clone();
	thread::spawn(move || async move {
		if let Err(err) = api::setup(api_config_copy).await {
			println!("Api error: {}", err);
			exit(1);
		}
	});

	// r := server.SetupRouter()
	// fmt.Println("Running server on", config.WebserverLocation)
	// fmt.Println("ERROR:", r.Run(config.WebserverLocation))
}
