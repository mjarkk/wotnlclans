package main

import (
	"fmt"
	"os"

	"github.com/mjarkk/wotnlclans/api"
	"github.com/mjarkk/wotnlclans/other"
	"github.com/mjarkk/wotnlclans/server"
)

func main() {
	fmt.Printf("------------------------\n press CTRL + C to exit \n------------------------\n\n")

	go func() {
		err := api.SetupAPI()
		if err != nil {
			fmt.Println("Api error:" + err.Error())
			os.Exit(1)
		} else {
			fmt.Println("Running api...")
		}
	}()

	other.BuildWebStatic()

	r := server.SetupRouter()
	fmt.Println("Running server...")
	r.Run("localhost:8282")
}
