# WotNlClans site
[![Site version](https://img.shields.io/badge/Site%20version-V3-blue.svg)](https://wotnlclans.unknownclouds.com/)

## Dev Setup
1. Make sure you have installed [golang](https://golang.org/doc/install), [mongodb](https://docs.mongodb.com/manual/installation/) and [nodejs](https://nodejs.org/en/) also Make sure that golang is setted up correctly with a working gopath
2. `mkdir -p $GOPATH/src/github.com/mjarkk && cd $GOPATH/src/github.com/mjarkk`
3. `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
4. `git checkout v3`
5. `./buildAndRun.sh -wgkey "yourWargamingApiKey"` (if mongodb is not located at `mongodb://localhost:27017` make sure to add the `-mongoURI` pram)

## Release Setup
1. Follow step 1 to 4 from [#Dev Setup](#Dev%20Setup)
2. `go build`
3. `./wotnlclans -wgkey "yourWargamingApiKey"` or `WARGAMINGAPIKEY=yourWargamingApiKey ./wotnlclans`
