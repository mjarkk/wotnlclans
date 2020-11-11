package other

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"os/exec"
	"strings"
	"sync"
)

type ConfigType struct {
	AllowedWords      []string `json:"allowedWords"`
	DisallowedWords   []string `json:"disallowedWords"`
	BlockedClans      []string `json:"blockedClans"`
	ExtraClans        []string `json:"extraClans"`
	WargamingKey      string   `json:"wargamingKey"`
	DiscordAuthToken  string   `json:"discordAuthToken"`
	WebserverLocation string   `json:"webserverLocation"`
}

// FlagsType is the interface for the program flags
type FlagsType struct {
	Debug                bool
	Dev                  bool
	MaxIndexPages        int
	SkipStartupIndexing  bool
	ForceStartupIndexing bool
}

var flags FlagsType
var flagsLock sync.Mutex

func GetFlags() FlagsType {
	flagsLock.Lock()
	defer flagsLock.Unlock()
	return flags
}

var config ConfigType
var configLock sync.Mutex

// GetConfig returns the config
func GetConfig() ConfigType {
	configLock.Lock()
	defer configLock.Unlock()
	return config
}

// SetupFlagsAndConfig sets up the Flags and config var
func SetupFlagsAndConfig() error {
	config, err := ioutil.ReadFile("./config.json")
	if err != nil {
		return err
	}

	configLock.Lock()
	defer configLock.Unlock()
	err = json.Unmarshal(config, &flags)
	if err != nil {
		return err
	}

	debug := fBool("debug", "debug the program")
	dev := fBool("dev", "launch the project in dev mode")
	maxIndexPages := fInt("maxindexpages", 4000, "the amound of pages of clans that will be searched through (every page contains 100 clans)") // currently there are around 700 pages
	skipStartupIndexing := fBool("skipstartupindexing", "skip the indexing of clans on start (only for development)")
	forceStartupIndexing := fBool("forcestartupindexing", "force indexing at startup")

	flag.Parse()

	if *dev && *maxIndexPages == 4000 {
		*maxIndexPages = 30 // limit this to 30 to make it faster to debug
	}

	flagsLock.Lock()
	defer flagsLock.Unlock()
	flags = FlagsType{
		Debug:                *debug,
		Dev:                  *dev,
		MaxIndexPages:        *maxIndexPages,
		SkipStartupIndexing:  *skipStartupIndexing,
		ForceStartupIndexing: *forceStartupIndexing,
	}

	return nil
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
