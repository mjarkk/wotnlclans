package other

import (
	"flag"
	"os"
	"os/exec"
	"strings"
)

// FlagsType is the interface for the program flags
type FlagsType struct {
	Debug                bool
	Dev                  bool
	WGKey                string
	MaxIndexPages        int
	SkipStartupIndexing  bool
	ForceStartupIndexing bool
	MongoUIR             string
	MongoDataBase        string
	WebServerLocation    string
	DiscordAuthToken     string
}

// Flags have some global settings for the program
var Flags FlagsType

var defaultWebServerLocation = "localhost:8282"

// SetupFlags sets up the Flags var
func SetupFlags() {
	debug := fBool("debug", "debug the program")
	dev := fBool("dev", "launch the project in dev mode")
	maxIndexPages := fInt("maxindexpages", 4000, "the amound of pages of clans that will be searched through (every page contains 100 clans)") // currently there are around 700 pages
	skipStartupIndexing := fBool("skipstartupindexing", "skip the indexing of clans on start (only for development)")
	forceStartupIndexing := fBool("forcestartupindexing", "force indexing at startup")
	webServerLocation := fString("webserverLocation", defaultWebServerLocation, "On with address and port to create a webserver")
	discordAuthToken := fString("discordAuthToken", "", "Spesifi the discord api authentication token")

	mongoURI := os.Getenv("MONGOURI")
	mongoURIOverWrite := fString("mongoURI", "mongodb://localhost:27017", "the mongodb connection uri (shell var: MONGOURI)")

	mongoDataBase := os.Getenv("MONGODATABASE")
	mongoDataBaseOverWrite := fString("mongoDatabase", "wotnlclans", "the mongodb database to use (shell var: MONGODATABASE)")

	wgKey := os.Getenv("WARGAMINGAPIKEY")
	wgKeyOverWrite := fString("wgkey", "", "select the wargaming api key (shell var: WARGAMINGAPIKEY)")

	flag.Parse()

	discordAuthTokenOverwrite := *discordAuthToken
	if len(discordAuthTokenOverwrite) == 0 {
		discordAuthTokenOverwrite = os.Getenv("DISCORDAUTHTOKEN")
	}

	if len(mongoURI) == 0 || (*mongoURIOverWrite != "mongodb://localhost:27017" && *mongoURIOverWrite != "") {
		mongoURI = *mongoURIOverWrite
	}

	if len(mongoURI) == 0 {
		mongoURI = "mongodb://localhost:27017" // use the default mongodb url
	}

	if len(mongoDataBase) == 0 || (*mongoDataBaseOverWrite != "wotnlclans" && *mongoDataBaseOverWrite != "") {
		mongoDataBase = *mongoDataBaseOverWrite
	}

	if len(mongoDataBase) == 0 {
		mongoDataBase = "wotnlclans" // use the default mongodb database
	}

	if len(*wgKeyOverWrite) > 0 {
		wgKey = *wgKeyOverWrite
	}

	if len(wgKey) == 0 && *dev {
		wgKey = "7e5ce7007256737daa79dbec35f4f072" // my wargaming key for development, i can only use this at home
	}

	if *dev && *maxIndexPages == 4000 {
		*maxIndexPages = 30 // limit this to 30 to make it faster to debug
	}

	Flags = FlagsType{
		Debug:                *debug,
		Dev:                  *dev,
		WGKey:                wgKey,
		MaxIndexPages:        *maxIndexPages,
		SkipStartupIndexing:  *skipStartupIndexing,
		ForceStartupIndexing: *forceStartupIndexing,
		MongoUIR:             mongoURI,
		MongoDataBase:        mongoDataBase,
		WebServerLocation:    *webServerLocation,
		DiscordAuthToken:     discordAuthTokenOverwrite,
	}
}

// Run runs a command
func Run(input string, executeingDir string) error {
	command := strings.Split(input, " ")

	cmd := exec.Command(command[0], command[1:]...)
	if len(executeingDir) > 0 {
		cmd.Dir = executeingDir
	}
	err := cmd.Run()
	return err
}

// fBool can set a boolean flag
func fBool(name string, usage string) *bool {
	return flag.Bool(name, false, usage)
}

// fString can set a string flag
func fString(name, value, usage string) *string {
	return flag.String(name, value, usage)
}

// fInt can set a int flag
func fInt(name string, value int, usage string) *int {
	return flag.Int(name, value, usage)
}
