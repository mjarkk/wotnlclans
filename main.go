package main

import (
	"fmt"
	"os"

	"github.com/mjarkk/wotnlclans/api"
	"github.com/mjarkk/wotnlclans/db"
	"github.com/mjarkk/wotnlclans/discord"
	"github.com/mjarkk/wotnlclans/other"
	"github.com/mjarkk/wotnlclans/server"
)

func main() {
	fmt.Printf("------------------------\n press CTRL + C to exit \n------------------------\n\n")

	other.SetupFlags()

	err := db.Setup()
	if err != nil {
		fmt.Println("Database error:", err.Error())
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
	addr := other.Flags.WebServerLocation
	fmt.Println("Running server on", addr)
	fmt.Println("ERROR:", r.Run(addr))
}
