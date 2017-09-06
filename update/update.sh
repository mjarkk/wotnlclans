#!/bin/bash
echo "Start backup ..."

cd ..
mkdir wotnlclans-backup
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
mkdir ./wotnlclans/db/clanmedia
mkdir ./wotnlclans/db/claninf
mkdir ./wotnlclans/db/clanreports
cp -rf ./wotnlclans-backup/db/clanmedia ./wotnlclans/clanmedia
cp -rf ./wotnlclans-backup/db/claninf ./wotnlclans/claninf
cp -rf ./wotnlclans-backup/db/clanreports ./wotnlclans/clanreports
cp ./wotnlclans-backup/db/dev.json ./wotnlclans/dev.json
cp ./wotnlclans-backup/db/blockedclans.json ./wotnlclans/blockedclans.json

echo "Dune Copying old files"
echo "Installing npm packages"

cd wotnlclans
npm i

echo "Dune installing packages"
