#!/bin/bash
echo "Start backup"

mkdir ../wotnlclans-backup
cp -r ./wotnlclans/db/clanmedia ./wotnlclans-backup/clanmedia
cp -r ./wotnlclans/db/claninf ./wotnlclans-backup/claninf
cp -r ./wotnlclans/db/clanreports ./wotnlclans-backup/clanreports
cp ./wotnlclans/db/dev.json ./wotnlclans-backup/dev.json
cp ./wotnlclans/db/blockedclans.json ./wotnlclans-backup/blockedclans.json

echo "dune making a backup"
