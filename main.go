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

	if other.Flags.CreateServiceFile {
		err := other.MakeServiceFile()
		if err != nil {
			fmt.Println("The MakeServiceFile function got an error:", err.Error())
			os.Exit(1)
		}
		os.Exit(0)
	}

	err := db.Setup()
	if err != nil {
		fmt.Println("Database error:" + err.Error())
		os.Exit(1)
	}

	go func() {
		discord.Setup()
	}()

	go func() {
		err := api.SetupAPI()
		if err != nil {
			fmt.Println("Api error:" + err.Error())
			os.Exit(1)
		}
	}()

	other.BuildWebStatic()

	r := server.SetupRouter()
	webLoc := other.Flags.WebServerLocation
	fmt.Println("Running server on", webLoc)
	r.Run(webLoc)
}
