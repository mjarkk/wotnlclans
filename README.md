# WotNlClans site
[![Site version](https://img.shields.io/badge/Site%20version-V3-blue.svg)](https://wotnlclans.unknownclouds.com/)

## About
This contains the code/container for [wotnlbeclans.eu](https://wotnlbeclans.eu/).
On this site you can see all Dutch & Belgium clans ranked.

| Item | Used |
|---|---|
| Backend | Golang |
| Frondend | Javascript (React/Preact) |

## Run
1. Make sure you have installed [docker](https://docs.docker.com/install/)
2. `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
3. Configure `config.json`
4. `docker build -t wotclans:latest .`
5. Run the command under here and edit what needs to change
```sh
docker run \
  --restart always \
  --name wotclans \
  -d \
  -p 8282:8282 \
  wotclans:latest
```

**Discord:**
1. Generate a new application here: https://discordapp.com/developers/applications/
2. Set a icon and after that go to the **Bot** tab
3. Click the copy button
4. add this to the docker run command: `-e DISCORDAUTHTOKEN=DiscordBotTokenHere`
*NOTE: The community tab has a static discord bot invite link that is from the production build*

## Development setup
1. Make sure you have installed [golang](https://golang.org/doc/install) and [nodejs](https://nodejs.org/en/) also Make sure that golang is setted up correctly with a working gopath
2. `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
3. `go get`
4. Configure `config.json`
5. Read [web_static/README.md](./web_static/README.md)
5. `./buildAndRun.sh -wgkey "yourWargamingApiKey"`

