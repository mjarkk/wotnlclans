package discord

import (
	"fmt"
	"strings"

	"github.com/bwmarrin/discordgo"
)

// onMessage handles every incomming message
func onMessage(s *discordgo.Session, m *discordgo.MessageCreate) {
	if m.Author.ID == s.State.User.ID {
		return
	}

	msg := strings.Split(m.Content, " ")

	hasPrefix := false
	prefixIs := ""
	if len(msg) > 0 {
		fmt.Println("test1", msg)
		hasPrefix = msg[0] == "w" || msg[0] == "!" || msg[0] == "?"
		prefixIs = msg[0]
		if len(msg) > 1 {
			msg = msg[1:]
		} else {
			msg = []string{}
		}
	} else {

	}

	if !hasPrefix {
		return
	}

	if len(msg) == 0 {
		s.ChannelMessageSend(m.ChannelID, "Did you mean `"+prefixIs+" help`")
	} else {
		s.ChannelMessageSend(m.ChannelID, strings.Join(msg, ","))
	}
}
