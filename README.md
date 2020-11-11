# Wot (NL/BE) Clans site
[![Site version](https://img.shields.io/badge/Site%20version-V3-blue.svg)](https://wotnlclans.unknownclouds.com/)

## About
This contains the code/container for [wotnlbeclans.eu](https://wotnlbeclans.eu/).
On this site you can see all Dutch & Belgium clans ranked.

| Item | Used |
|---|---|
| Backend | Golang |
| Frondend | Javascript (React/Preact) |

## Setup
1. Make sure you have installed [docker](https://docs.docker.com/install/) in production and in development make sure you have [golang](https://golang.org/doc/install) and [nodejs](https://nodejs.org/en/)
2. `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
3. Configure `config.json`

## Run docker
1. `docker build -t wotclans:latest .`
2. Run the command under here and edit what needs to change
```sh
docker run \
  --restart always \
  --name wotclans \
  -d \
  -p 8282:8282 \
  wotclans:latest
```

**Get discord discordAuthToken:**
1. Generate a new application here: https://discordapp.com/developers/applications/
2. Set a icon and after that go to the **Bot** tab
3. Click the copy button
*NOTE: The community tab has a static discord bot invite link that is from the production build*

## Run development
1. `go get`
2. Configure `config.json`
3. Read [web_static/README.md](./web_static/README.md)
4. `./buildAndRun.sh`

