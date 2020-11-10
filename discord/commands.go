package discord

import (
	"errors"
	"fmt"
	"strings"

	"github.com/mjarkk/wotclans/db"
)

// Option is a command for the list
type Option struct {
	ToMatch     string                                            // is the command
	Discription string                                            // the discription of the command
	Command     func([]Option, string, ...string) (string, error) // is the command that will be executed when the command happends
}

// PrintClanLine returns a printable stats line for discord for a clan
func PrintClanLine(clan db.ClanStats, clanPosition int, withExtras bool) string {
	realClanPos := "**"
	if clanPosition != 0 {
		realClanPos = strings.TrimSpace(fmt.Sprintf("%v", clanPosition)) + "**"
		if withExtras {
			if clanPosition == 1 {
				realClanPos = realClanPos + " *Best clan*:100:"
			} else if clanPosition <= 5 {
				realClanPos = realClanPos + " *Top 5 clan*:star:"
			}
		}
	}
	toReturn := fmt.Sprintf(
		"**[%v] #%v, ClanRating: **%v**, Winrate: **%v**, Strongholds: **%v**, Global Tier 10: **%v**",
		clan.Tag,
		realClanPos,
		clan.Stats.Efficiency,
		clan.Stats.WinRatio,
		clan.Stats.FbElo,
		clan.Stats.FbElo10,
	)
	if withExtras {
		toReturn = toReturn + "\n" + "https://wotnlbeclans.eu/#/clan/" + clan.ID
	}
	return toReturn
}

// OptionsList is a list of available commands
var OptionsList = []Option{
	{
		ToMatch:     "top clans",
		Discription: "List the current top clans",
		Command: func(currentOptions []Option, prefix string, args ...string) (string, error) {
			clanStats := db.GetCurrentClansData()
			top10 := make([]db.ClanStats, 10)
			sortedRatings := db.GetSortedRating()
			for _, clan := range clanStats {
				clanPos, ok := sortedRatings[clan.ID]
				if !ok {
					continue
				}
				eff := clanPos.Efficiency
				if eff >= 10 {
					continue
				}
				top10[eff] = clan
			}
			toReturn := "Top 10 clans:"
			for pos, clan := range top10 {
				toReturn = toReturn + "\n" + PrintClanLine(clan, pos+1, false)
			}
			return toReturn, nil
		},
	},
	{
		ToMatch:     "clan {{clanTag}} stats",
		Discription: "Show the stats and position of a spesific clan",
		Command: func(currentOptions []Option, prefix string, args ...string) (string, error) {
			if len(args) == 0 {
				return "", errors.New("Not enough arguments spesified")
			}
			if args[0] == "" {
				return ":confused: Heu?? No clans found", nil
			}
			clanStats := db.GetCurrentClansData()
			sortedRatings := db.GetSortedRating()
			for _, clan := range clanStats {
				if strings.ToLower(clan.Tag) == strings.ToLower(strings.TrimSpace(args[0])) {
					clanPos, ok := sortedRatings[clan.ID]
					realClanPos := 0
					if ok {
						realClanPos = clanPos.Efficiency + 1
					}
					return PrintClanLine(clan, realClanPos, true), nil
				}
			}
			return ":eyes: We have looked everyware but cloud not found the clan you are looking for", nil
		},
	},
	{
		ToMatch:     "help",
		Discription: "Show the help menu",
		Command: func(currentOptions []Option, prefix string, args ...string) (string, error) {
			out := ""
			for _, option := range currentOptions {
				out = out + "\n" + prefix + " " + option.ToMatch + "\n   > " + option.Discription
			}

			return "Beep boop this is what i can do:\n```" + out + "\n```", nil
		},
	},
}
