package other

import (
	"flag"
	"os"
	"os/exec"
	"strings"
)

// FlagsType is the interface for the program flags
type FlagsType struct {
	Debug               bool
	Dev                 bool
	SkipBuild           bool
	WGKey               string
	MaxIndexPages       int
	SkipStartupIndexing bool
}

// Flags have some global settings for the program
var Flags FlagsType

// SetupFlags sets up the Flags var
func SetupFlags() {
	debug := flag.Bool("debug", false, "debug the program")
	dev := flag.Bool("dev", false, "launch the project in dev mode")
	skipBuild := flag.Bool("skipBuild", false, "skip the build process")
	maxIndexPages := flag.Int("maxindexpages", 2000, "the amound of pages of clans that will be searched through (every page contains 100 clans)") // currently there are around 700 pages
	skipStartupIndexing := flag.Bool("skipstartupindexing", false, "skip the indexing of clans on start")

	wgKey := os.Getenv("WARGAMINGAPIKEY")
	wgKeyOverWrite := flag.String("wgkey", "", "select the wargaming api key (or use the shell var: WARGAMINGAPIKEY)")

	flag.Parse()

	if len(*wgKeyOverWrite) > 0 {
		wgKey = *wgKeyOverWrite
	}

	Flags = FlagsType{
		Debug:               *debug,
		Dev:                 *dev,
		SkipBuild:           *skipBuild,
		WGKey:               wgKey,
		MaxIndexPages:       *maxIndexPages,
		SkipStartupIndexing: *skipStartupIndexing,
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
