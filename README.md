# WotNlClans site
[![Site version](https://img.shields.io/badge/Site%20version-V3-blue.svg)](https://wotnlclans.unknownclouds.com/)

## Dev Setup
- Make sure you have installed golang and mongodb, Make sure that golang is setted up correctly with a GOPATH
- `mkdir -p $GOPATH/src/github.com/mjarkk && cd $GOPATH/src/github.com/mjarkk`
- `git clone git@github.com:mjarkk/wotnlclans.git && cd wotnlclans`
- `git checkout v3`
- `./buildAndRun.sh -wgkey "yourWargamingApiKey"` (if mongodb is not located at `mongodb://localhost:27017` make sure to add the `-mongoURI` pram)
