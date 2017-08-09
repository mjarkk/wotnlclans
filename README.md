# World of tanks NL/BE clans    
The new wot nl/be clans site as update for [wotnlclans.mkopenga.com](https://wotnlclans.mkopenga.com)  
On this site you can view the all the NL/BE clans  

## Why?  
- Because I want to learn Vue.js.  
- Because the old site uses 3 npm scripts (that can break), 2 domains, 1 domain for making the website and a view other scripts for copying and some other things.  
- The curent site is slow on a normal mobiel connection it takes 25s  
- The curent site looks bad on mobiel  

## Site Goal  
- :heavy_check_mark: In 5s have a site where the top 50+ clans are visable on a "normal" 3G connection  
- :heavy_check_mark: Use dynamic url's for better sharing instaid of 1 page where the url doen't change on what you look at  
- :heavy_check_mark: Not use jquery  
- :heavy_check_mark: More material design because the old site did look a little bit uncluttered  
- ~~:heavy_multiplication_x: minimal 90% score in [Lighthouse](https://developers.google.com/web/tools/lighthouse/)~~ (can't get a 90%+ socre because the test wait till the webpage is fully loaded)

## How to install:  
- Clone the project  
- Install nodejs  
- Inside the cloned folder open a terminal and type: npm i  
- After that's dune type: npm start  

## Bugs  
- Back button in the browser does only change the website url  
- On Windows you can't get clan data  
- On Windows FFMPEG will not work with resolt the icons on the website don't look sharp and take longer to load  
- ~~Inside config.json can't change dev to false because of uglify issue I think it has something todo with es6~~  

## Updates  
- Removed spf.js because i only use only 1 function of it and javascript has a solution for that with only 1 line of code  

## Screenshots  
![Screenshot1](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s1.png)  
![Screenshot2](https://github.com/mjarkk/wotnlclans/blob/master/www/img/s2.png)  
