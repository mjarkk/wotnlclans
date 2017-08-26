# World of tanks NL/BE clans    
The new wot nl/be clans site as update for [wotnlclans.mkopenga.com](https://wotnlclans.mkopenga.com)  
On this site you can view the all the NL/BE clans and their stats  

## Why?  
- Because I want to learn Vue.js and i wan't to make a good single page [pwa](https://developers.google.com/web/progressive-web-apps/).  
- Because the old site uses 3 npm scripts (that have broken me a view times), 2 official domains + 1 domain for developing the website and a view other scripts for fixing a view bugs.  
- The curent site is slow on a normal mobiel connection it takes 25s to view all clans  
- The curent site looks bad on mobiel  

## Site Goal  
- :heavy_check_mark: In 5s have a site where the top 50+ clans are visable on a "normal" 3G connection  
- :heavy_check_mark: Use dynamic url's for better sharing instaid of 1 page where the url doen't change on what you look at  
- :heavy_check_mark: Not use jquery  
- :heavy_check_mark: More material design because the old site did look a little bit uncluttered  
- :heavy_check_mark: One script not 3+ folders plus scripts  
- ~~:heavy_multiplication_x: minimal 90% score in [Lighthouse](https://developers.google.com/web/tools/lighthouse/)~~ --> can't get a 90%+ socre because the test wait till the webpage is fully loaded.  

## How to install:  
- Clone or Download the project  
- Install [nodejs](https://nodejs.org/en/) (latest version !!NOT LTS!!)  
- Inside the cloned folder open a terminal and type: npm i  
- After that's dune type: npm start  
- Now the script will start a local webserver on [localhost port 2020](http://localhost:2020)

## Bugs  
- ~~Back button in the browser does only change the website url~~  
- On Windows you can't get clan data  
- On Windows FFMPEG will not work with resolt the icons on the website don't look sharp and take longer to load  
- ~~Inside config.json can't change dev to false because of uglify issue I think it has something todo with es6~~  

## Updates  
- Removed spf.js because i only use only 1 function of it and javascript has a solution for that with only 1 line of code  

## Screenshots  
![Screenshot1](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s1.png)  
![Screenshot2](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s2.png)  
