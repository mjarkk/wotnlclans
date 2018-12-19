package api

import (
	"errors"
	"fmt"

	"github.com/mjarkk/wotnlclans/other"
)

// SetupAPI sets up the api for fetching data from the wargaming api
func SetupAPI() error {
	flags := other.Flags
	fmt.Println("setting up the api...")
	if len(flags.WGKey) == 0 {
		return errors.New("No wargaming api key defined use `./wotnlclans -help` to get more info")
	}
	GetDataFromAPI()
	return nil
}

// GetDataFromAPI fetches all data from the api
func GetDataFromAPI() error {
	for i := 0; i < 1000; i++ {
		go func(i int) {
			cb, err := Jobs.Add("Max", "me", map[string]string{"playerID": fmt.Sprintf("%v", i)})
			if err != nil {
				fmt.Println("ERROR:", err.Error())
			}
			fmt.Println(<-cb)
		}(i)
	}

	return nil
}
