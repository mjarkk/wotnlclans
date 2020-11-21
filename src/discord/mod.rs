pub mod commands;
pub mod events;
pub mod parser;

pub use commands::*;
pub use events::*;
pub use parser::*;

use crate::other::ConfAndFlags;
use std::sync::Mutex;

// IsEnabled shows if the discord bot is enabled
lazy_static! {
    static ref IS_ENABLED: Mutex<bool> = Mutex::new(false);
}

// AuthURL is a url to add a bot your discord
const AUTH_URL: &'static str = "https://discordapp.com/oauth2/authorize?client_id=536542444154519552&permissions=522304&scope=bot";

// Setup sets up the discord part
pub fn setup(config: ConfAndFlags) {
    // fmt.Println("Settings up the discord api...")
    // if len(config.DiscordAuthToken) == 0 {
    // 	fmt.Println("No key spesified, Skipping the discord bot")
    // 	return
    // }
    // discord, err := discordgo.New("Bot " + config.DiscordAuthToken)
    // if err != nil {
    // 	fmt.Println("Can't createa a discord bot, err:", err.Error())
    // }

    // discord.AddHandler(onMessage)

    // err = discord.Open()
    // if err != nil {
    // 	fmt.Println("Can't connect to discord, err:", err)
    // 	return
    // }

    // IsEnabled = true
    // fmt.Println("Discord bot is now setted up")

    // sc := make(chan os.Signal, 1)
    // signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
    // <-sc
    // go func() {
    // 	discord.Close()
    // 	os.Exit(1)
    // }()
    // time.Sleep(time.Millisecond * 250)
    // os.Exit(1)
}
