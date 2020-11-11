package main

import (
	"fmt"
	"os"

	"github.com/mjarkk/wotclans/api"
	"github.com/mjarkk/wotclans/discord"
	"github.com/mjarkk/wotclans/other"
	"github.com/mjarkk/wotclans/server"
)

func main() {
	fmt.Println("------------------------")
	fmt.Println(" press CTRL + C to exit ")
	fmt.Println("------------------------")
	fmt.Println()

	config, err := other.SetupFlagsAndConfig()
	if err != nil {
		fmt.Println("Setup error:", err)
		os.Exit(1)
	}

	go func(config other.FlagsAndConfig) {
		discord.Setup(config)
	}(config)

	go func(config other.FlagsAndConfig) {
		err := api.SetupAPI(config)
		if err != nil {
			fmt.Println("Api error:", err.Error())
			os.Exit(1)
		}
	}(config)

	r := server.SetupRouter()
	fmt.Println("Running server on", config.WebserverLocation)
	fmt.Println("ERROR:", r.Run(config.WebserverLocation))
}
