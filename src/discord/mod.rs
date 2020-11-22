pub mod commands;
pub mod events;
pub mod parser;

pub use commands::*;
pub use events::*;
pub use parser::*;

use crate::other::ConfAndFlags;
use serenity::async_trait;
use serenity::client::{Client, Context, EventHandler};
use serenity::framework::standard::{
    macros::{command, group},
    CommandResult, StandardFramework,
};
use serenity::model::channel::Message;
use std::sync::Mutex;

// IsEnabled shows if the discord bot is enabled
lazy_static! {
    static ref IS_ENABLED: Mutex<bool> = Mutex::new(false);
}

// AuthURL is a url to add a bot your discord
const AUTH_URL: &'static str = "https://discordapp.com/oauth2/authorize?client_id=536542444154519552&permissions=522304&scope=bot";

pub struct Handler;

#[async_trait]
impl EventHandler for Handler {}

// Setup sets up the discord part
pub async fn setup(config: ConfAndFlags) -> Result<(), String> {
    println!("Settings up the discord api...");
    if config.conf().discord_auth_token.len() == 0 {
        return Err(String::from("No key spesified, Skipping the discord bot"));
    }

    let framework = StandardFramework::new().configure(|c| c.prefix("w"));

    let mut client = Client::builder(&config.conf().discord_auth_token)
        .event_handler(Handler)
        .framework(framework)
        .await
        .or_else(|e| Err(format!("Unable to setup discod bot, error: {}", e)))?;

    client
        .start()
        .await
        .or_else(|e| Err(format!("Unable to run discord bot, error: {}", e)))?;

    Err(format!("Discord bot stopped unexpected"))
}
