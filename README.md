# World of tanks NL/BE clans    

## V3
I'm currently working on a v3 in this [branch](https://github.com/mjarkk/wotnlclans/tree/v3), issue [#1](https://github.com/mjarkk/wotnlclans/pull/1) contains the progressions of the new site 

## About
World of tanks NL/BE clans list hosted on [wotnlclans.mkopenga.com](https://wotnlclans.mkopenga.com)  
On this site you can view the all the NL/BE clans and their stats  

## Why?  
- Because I want to learn Vue.js and i wan't to make a good single page [pwa](https://developers.google.com/web/progressive-web-apps/).  
- Because the old site was a big mess it uses 3 npm scripts (that have broken me a view times), 2 official domains + 1 domain for developing the website and a view other scripts for fixing a view bugs.  
- The last site is slow on a normal mobiel connection it takes 25s to view all clans *(4mb of clan stats)*  
- The last site looks bad on mobiel  

## Site Goal  
- :heavy_check_mark: In 5s have a site where the top 50+ clans are visable on a "normal" 3G connection (on the final site its around 2 to 3s on a fast 3g network)  
- :heavy_check_mark: Use dynamic url's for better sharing instaid of 1 page where the url doen't change on what you look at  
- :heavy_check_mark: Not use jquery  
- :heavy_check_mark: More material design because the old site did look a little bit uncluttered  
- :heavy_check_mark: One script not 3+ folders plus scripts  
- :heavy_check_mark: high score in [Lighthouse](https://developers.google.com/web/tools/lighthouse/)

## How to install:  
- Create a api key and add your server's ip address [here](https://developers.wargaming.net/applications/)  
- Clone or Download the project  
- Install [nodejs](https://nodejs.org/en/)  
- Inside the cloned folder open a terminal and type:  
- `npm i -g yarn` (on **linux** and **macos** you might need to add `sudo`)  
- `yarn` 
- `yarn start`  
- If you use linux or Macos I recomment to install: [graphicsmagick](http://www.graphicsmagick.org/), [imagemagick](https://www.imagemagick.org/script/index.php) and [ffmpeg](https://www.ffmpeg.org/)  
- Now the script will start a local webserver on [localhost port 2020](http://localhost:2020)  

## Dev  
- Start dev server: npm run dev  
- This will start the server with no uglified javascript, automatic restart the server on serv.js file change, clan search will max search 20.000 clans and a view other small things.  

## Bugs  
- On Windows you can't get clan images due to graphicsmagick issues or is not installed  
- Start script may not start on windows solution: run `node Dev-False.js` or `node Dev-True.js` then `node serv.js`

## Screenshots  
![Screenshot1](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s1.png)  
![Screenshot2](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s2.png)  
