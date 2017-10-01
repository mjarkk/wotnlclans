# World of tanks NL/BE clans    
The new wot nl/be clans site hosted on [wotnlclans.mkopenga.com](https://wotnlclans.mkopenga.com)  
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
- If you use linux I recomment to install: graphicsmagick  

## Dev  
- Start dev server: npm run dev  
- This will start the server with no uglified javascript, automatic restart the server on serv.js file change, clan search will max search 20.000 clans and a view other small things.  

## Bugs  
- On Windows you can't get clan data  
- Start script may not start on windows, solution run "node Dev-False.js" or "node Dev-True.js" and then "node serv.js"   
- The script will crash after a view days depending on the ram size  

## Screenshots  
![Screenshot1](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s1.png)  
![Screenshot2](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s2.png)  
