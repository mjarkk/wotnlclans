package discord

import "errors"

// Option is a command for the list
type Option struct {
	ToMatch     string                          // is the command
	Discription string                          // the discription of the command
	Command     func(...string) (string, error) // is the command that will be executed when the command happends
}

// OptionsList is a list of available commands
var OptionsList = []Option{
	{
		ToMatch:     "top clans",
		Discription: "List the current top clans",
		Command: func(args ...string) (string, error) {
			return "", nil
		},
	},
	{
		ToMatch:     "clan {{clanTag}} stats",
		Discription: "Show the stats and position of a spesific clan",
		Command: func(args ...string) (string, error) {
			if len(args) == 0 {
				return "", errors.New("Not enough arguments spesified")
			}
			return "", nil
		},
	},
	{
		ToMatch:     "help",
		Discription: "Show the help menu",
		Command: func(args ...string) (string, error) {
			if len(args) == 0 {
				return "", errors.New("Not enough arguments spesified")
			}
			return "", nil
		},
	},
}
