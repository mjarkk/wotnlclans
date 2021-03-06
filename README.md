# Wot (NL/BE) Clans site
[![Site version](https://img.shields.io/badge/Site%20version-V3-blue.svg)](https://wotnlclans.unknownclouds.com/)

## About
This contains the code/container for [wotnlbeclans.eu](https://wotnlbeclans.eu/).
On this site you can see all Dutch & Belgium clans ranked.

| Item | Used |
|---|---|
| Backend | [Rust](https://www.rust-lang.org/) |
| Frondend | [Preact](https://preactjs.com/) |

## Setup
1. Make sure you have installed [docker](https://docs.docker.com/install/) in production and in development make sure you have [rust](https://www.rust-lang.org/) and [nodejs](https://nodejs.org/en/)
2. `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
3. Configure `config.json`

## Config explainer
```js
{
  "allowedWords": [], // Clan descriptions get checked for these words
  "disallowedWords": [], // These words should not appear in the description
  "blockedClans": [], // A list of strings with as content clan IDs
  "extraClans": [], // A list of extra clans that might not be autodetected
  "wargamingKey": "7e5ce7007256737daa79dbec35f4f072", // Your wargaming key
  "discordAuthToken": "", // Optional discord token for discord bot
  "discordAuthUrl": "", // If discord auth token is provided this is the auth url used to authenticated
  "webserverLocation": "localhost:8282", // Where should the webserver be ran
  "webAnalytics": "", // Spyware scripts :)
  "title": "Wot NL/BE clans", // Site title
  "community": [ // Posts on community tab
    {
      "text": "Join the WOT NL/BE\nclans Facebook community",
      "background": {
        "text": "FACE\nBOOK",
        "color": "#4c4fef",
        "image": ""
      },
      "link": {
        "url": "https://www.facebook.com/groups/wotbelgium/",
        "text": "Go To"
      },
      "info": "",
      "requirements": []
    },
  ]
}
```

## How to get discord discordAuthToken
1. Generate a new application here: https://discordapp.com/developers/applications/
2. Set a icon and after that go to the **Bot** tab
3. Click the copy button
*NOTE: The community tab has a static discord bot invite link that is from the production build*

## Run docker
If the rust binary fails to build on the last step you might need more ram, a easy fix for this is to add some extra swap if your server doesn't have any: https://www.cyberciti.biz/faq/linux-add-a-swap-file-howto/
In my case my serer has 2GB of ram and i added 2GB of swap.

1. `docker build -t wotclans:latest .`
2. Run:
```sh
docker run \
  --restart always \
  --name wotclans \
  -d \
  -p 8282:8282 \
  wotclans:latest
```

## Run development
1. Configure `config.json`
2. Read [web_static/README.md](./web_static/README.md)
3. Run `cargo run -- --dev` *(use `cargo run -- --help` for the argument options)*

## How to update the config:
- For development just restart the webpack server and api
- For production rebuild the container then remove the container if running and start it again
