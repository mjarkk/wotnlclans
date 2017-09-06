#!/bin/bash
echo "Start backup ..."

cd ..
if [[ -d ./wotnlclans-backup ]]; then
    rm -rf ./wotnlclans-backup
fi
rm -rf ./wotnlclans/node_modules
cp -rf ./wotnlclans ./wotnlclans-backup

echo "dune making a backup"
echo "Installing new version ..."

rm -rf ./wotnlclans
git clone https://github.com/mjarkk/wotnlclans


echo "dune installing new version"
echo "Copying old files"

rm -rf ./wotnlclans/db/clanmedia
rm -rf ./wotnlclans/db/claninf
rm -rf ./wotnlclans/db/clanreports
rm -f ./wotnlclans/db/dev.json
rm -f ./wotnlclans/db/blockedclans.json
cp -rf ./wotnlclans-backup/db/clanmedia ./wotnlclans/db/clanmedia
cp -rf ./wotnlclans-backup/db/claninf ./wotnlclans/db/claninf
cp -rf ./wotnlclans-backup/db/clanreports ./wotnlclans/db/clanreports
cp ./wotnlclans-backup/db/dev.json ./wotnlclans/db/dev.json
cp ./wotnlclans-backup/db/blockedclans.json ./wotnlclans/db/blockedclans.json

echo "Dune Copying old files"
echo "Installing npm packages"

cd wotnlclans
npm i

echo "Dune installing packages"
