package other

import (
	"flag"
	"os"
	"os/exec"
	"strings"
)

// FlagsType is the interface for the program flags
type FlagsType struct {
	Debug     bool
	Dev       bool
	SkipBuild bool
	WGKey     string
}

// Flags have some global settings for the program
var Flags FlagsType

// Setup sets up the Flags var
func SetupFlags() {
	debug := flag.Bool("debug", false, "debug the program")
	dev := flag.Bool("dev", false, "launch the project in dev mode")
	skipBuild := flag.Bool("skipBuild", false, "skip the build process")

	wgKey := os.Getenv("WARGAMINGAPIKEY")
	wgKeyOverWrite := flag.String("wgkey", "", "select the wargaming api key (or use the shell var: WARGAMINGAPIKEY)")

	flag.Parse()

	if len(*wgKeyOverWrite) > 0 {
		wgKey = *wgKeyOverWrite
	}

	Flags = FlagsType{
		Debug:     *debug,
		Dev:       *dev,
		SkipBuild: *skipBuild,
		WGKey:     wgKey,
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
