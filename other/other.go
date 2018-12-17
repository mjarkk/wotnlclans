package other

import (
	"flag"
	"os/exec"
	"strings"
)

// Flags is the interface for the program flags
type Flags struct {
	Debug     bool
	Dev       bool
	SkipBuild bool
}

// GetFlags returns the program's flags
func GetFlags() Flags {
	debug := flag.Bool("debug", false, "debug the program")
	dev := flag.Bool("dev", false, "launch the project in dev mode")
	skipBuild := flag.Bool("skipBuild", false, "skip the build process")
	flag.Parse()
	return Flags{
		Debug:     *debug,
		Dev:       *dev,
		SkipBuild: *skipBuild,
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
