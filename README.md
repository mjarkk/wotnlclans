# WotNlClans site
[![Site version](https://img.shields.io/badge/Site%20version-V3-blue.svg)](https://wotnlclans.unknownclouds.com/)
[![Build Status](https://drone.unknownclouds.com/api/badges/mjarkk/wotnlclans/status.svg)](https://drone.unknownclouds.com/mjarkk/wotnlclans)

## About
This is the code for [wotnlbeclans.eu](https://wotnlbeclans.eu/).  

| Item | Used |
|---|---|
| Backend | Golang |
| Frondend | Javascript (React/Preact) |
| Database | Mongodb and a view arrays in memory |

## Dev Setup
1. Make sure you have installed [golang](https://golang.org/doc/install), [mongodb](https://docs.mongodb.com/manual/installation/) and [nodejs](https://nodejs.org/en/) also Make sure that golang is setted up correctly with a working gopath
2. `mkdir -p $GOPATH/src/github.com/mjarkk && cd $GOPATH/src/github.com/mjarkk`
3. `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
4. `go get`
5. `./buildAndRun.sh -wgkey "yourWargamingApiKey"` (if mongodb is not located at `mongodb://localhost:27017` make sure to add the `-mongoURI` pram)

## Release Setup
1. Follow step 1 to 4 from [#Dev Setup](#Dev%20Setup)
2. `go build`
3. `./wotnlclans -wgkey "yourWargamingApiKey"` or `WARGAMINGAPIKEY=yourWargamingApiKey ./wotnlclans`

### Systemctl service file.
1. Follow step 1 to 4 from [#Dev Setup](#Release%20Setup)
2. `./wotnlclans -generateDotService`

### Enable the discord bot
1. Follow step 1 to 4 from [#Dev Setup](#Release%20Setup)
2. Generate a new application here: https://discordapp.com/developers/applications/
3. Set a icon and after that go to the **Bot** tab
4. Click the copy button
5. `./wotnlclans -discordAuthToken DiscordBotTokenHere` or `DISCORDAUTHTOKEN=DiscordBotTokenHere ./wotnlclans`
6. If you don't want to do this every time add the `DISCORDAUTHTOKEN=DiscordBotTokenHere` to your bashrc
*NOTE: The community tab has a static discord bot invite link that is from the production build*
