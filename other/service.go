package other

import (
	"errors"
	"fmt"
	"os"
	"strings"
)

// MakeServiceFile creates the contents of a .service file and logs it plus tips to install it
func MakeServiceFile() error {
	wotnlclansBinary := Ask("Where is the wotnlclans script? (Full path to binary)")

	devAgree := Ask("Is this used for devlopment? (Y) to agree")
	dev := devAgree == "Y" || devAgree == "y"
	if _, err := os.Stat(wotnlclansBinary); os.IsNotExist(err) {
		return errors.New("Wrong location to binary, " + wotnlclansBinary)
	}
	pathToBin := strings.Split(wotnlclansBinary, "/")
	pathToBin = pathToBin[0 : len(wotnlclansBinary)-2]
	if dev {
		wotnlclansBinary = wotnlclansBinary + " -dev"
	}

	webServer := Ask("What is the webserver location? (if empty it uses the default: " + defaultWebServerLocation + ")")
	if len(webServer) > 0 {
		wotnlclansBinary = wotnlclansBinary + " -webserverLocation " + webServer
	} else {
		wotnlclansBinary = wotnlclansBinary + " -webserverLocation " + defaultWebServerLocation
	}

	wgKey := Ask("What is your wargaming key?")
	if len(wgKey) == 0 {
		return errors.New("No wargaming key given")
	}

	discordAPIToken := Ask("What is your discord api token? (leave empty to disable the discord bot)")

	wotnlclansBinary = wotnlclansBinary + " -wgkey " + wgKey

	service := `
[Unit]
Description=Wot nl/be clans server
After=network-online.target
Wants=network-online.target systemd-networkd-wait-online.service

[Service]
ExecStart=` + wotnlclansBinary + ` -skipBuild
ExecReload=/bin/kill -USR1 $MAINPID
WorkingDirectory=` + strings.Join(pathToBin, "/") + `
KillMode=mixed
KillSignal=SIGQUIT
LimitAS=infinity
LimitRSS=infinity
LimitCORE=infinity
LimitNOFILE=65536
TimeoutStopSec=8s
Environment="DISCORDAUTHTOKEN=` + discordAPIToken + `"

[Install]
WantedBy=multi-user.target`

	serviceName := "wotnlclans"
	if dev {
		serviceName = "wotnlclans-dev"
	}

	fmt.Println("----------------------\n" + service + "\n----------------------")
	fmt.Println("Copy the contents from above between the ---- into /etc/systemd/system/" + serviceName + ".service")
	fmt.Println("Start it after that using `sudo systemctl start " + serviceName + "`")
	fmt.Println("You can also directly start it after startup using `sudo systemctl enable " + serviceName + "`")
	return nil
}

// Ask aks something to the user and returns the answer
func Ask(what string) string {
	fmt.Print(what + "\n> ")
	var input string
	fmt.Scanln(&input)
	return input
}
