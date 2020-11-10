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
	fmt.Printf("------------------------\n press CTRL + C to exit \n------------------------\n\n")

	err := other.SetupFlagsAndConfig()
	if err != nil {
		fmt.Println("Setup error:", err)
		os.Exit(1)
	}

	go func() {
		discord.Setup()
	}()

	go func() {
		err := api.SetupAPI()
		if err != nil {
			fmt.Println("Api error:", err.Error())
			os.Exit(1)
		}
	}()

	r := server.SetupRouter()
	addr := other.GetConfig().WebserverLocation
	fmt.Println("Running server on", addr)
	fmt.Println("ERROR:", r.Run(addr))
}
