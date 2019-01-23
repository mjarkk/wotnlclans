package discord

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/mjarkk/wotnlclans/other"
)

// IsEnabled shows if the discord bot is enabled
var IsEnabled = false

// AuthURL is a url to add a bot your discord
const AuthURL = "https://discordapp.com/oauth2/authorize?client_id=536542444154519552&permissions=522304&scope=bot"

// Setup sets up the discord part
func Setup() {
	fmt.Println("Settings up the discord api...")
	key := other.Flags.DiscordAuthToken
	if len(key) == 0 {
		fmt.Println("No key spesified, Skipping the discord bot")
		return
	}
	discord, err := discordgo.New("Bot " + key)
	if err != nil {
		fmt.Println("Can't createa a discord bot, err:", err.Error())
	}

	discord.AddHandler(onMessage)

	err = discord.Open()
	if err != nil {
		fmt.Println("Can't connect to discord, err:", err)
		return
	}

	IsEnabled = true
	fmt.Println("Discord bot is now setted up")

	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc
	go func() {
		discord.Close()
		os.Exit(1)
	}()
	time.Sleep(time.Millisecond * 250)
	os.Exit(1)
}
