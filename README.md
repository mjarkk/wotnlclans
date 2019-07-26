# WotNlClans site
[![Site version](https://img.shields.io/badge/Site%20version-V3-blue.svg)](https://wotnlclans.unknownclouds.com/)

## About
This is the code for [wotnlbeclans.eu](https://wotnlbeclans.eu/).  

| Item | Used |
|---|---|
| Backend | Golang |
| Frondend | Javascript (React/Preact) |
| Database | Mongodb and a few arrays in memory |

## Dev Setup
1. Make sure you have installed [golang](https://golang.org/doc/install), [mongodb](https://docs.mongodb.com/manual/installation/) and [nodejs](https://nodejs.org/en/) also Make sure that golang is setted up correctly with a working gopath
2. `mkdir -p $GOPATH/src/github.com/mjarkk && cd $GOPATH/src/github.com/mjarkk`
3. `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
4. `go get`
5. Read [web_static/README.md](./web_static/README.md)
5. `./buildAndRun.sh -wgkey "yourWargamingApiKey"` (if mongodb is not located at `"localhost"` make sure to add the `-mongoURI` pram, this is required due to some wired mongodb bug )

*To build the dockerfile run: `docker build -t wotnlclans .`*

## Production
1. Make sure you have installed [docker](https://docs.docker.com/install/) and [mongodb](https://docs.mongodb.com/manual/installation/)
2. `docker pull mjarkk/wotnlclans`
3. Run the command under here and edit what needs to change
```sh
docker run \
  --restart always \
  --name wotnlclans \
  -d \
  -p 8282:8282 \
  -e MONGOURI=mongodb://your.mongodb.server:27017 \
  -e MONGODATABASE=wotnlclans \
  -e WARGAMINGAPIKEY=YourWgApiKey \
  wotnlclans
```

**Discord:**  
1. Generate a new application here: https://discordapp.com/developers/applications/
2. Set a icon and after that go to the **Bot** tab
3. Click the copy button
4. add this to the docker run command: `-e DISCORDAUTHTOKEN=DiscordBotTokenHere`
*NOTE: The community tab has a static discord bot invite link that is from the production build*
