// config
var config = {
  wgkey: 'f53bdb585a307dbb8e5c1fdcbf213384',
  clansfile: './db/clans.json',
  extraclans: './db/extra.txt',
  blockedclans: './db/blockedclans.json',
  madeby: '516673968'
}

const path = require('path');
const express = require('express');
const request = require("request");
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const base64 = require('base64-js');
const pics = require('pics');
const ejs = require('ejs');
const promptly = require('promptly');
const fetch = require('node-fetch');
const readline = require('readline');
const _ = require('underscore');

// startup
console.log('');
console.log('clans counted: ' + colors.green(fs.readJsonSync(config.clansfile).length));
console.log('');

var madeby = {
  name: '',
  clan: '',
  color: '',
  icon: ''
}

function aboutme() {
  fetch('https://api.worldoftanks.eu/wot/account/info/?application_id=' + config.wgkey + '&account_id=' + config.madeby + '&fields=nickname%2Cclan_id')
    .then(function(res) {
      return res.text();
    }).then(function(body) {
      body = JSON.parse(body);
      if (body.status == 'ok') {
        madeby.name = body.data[config.madeby].nickname;
        var clan = body.data[config.madeby].clan_id;
        fetch('https://api.worldoftanks.eu/wgn/clans/info/?application_id=' + config.wgkey + '&clan_id=' + clan + '&fields=tag%2Ccolor%2Cemblems.x195')
          .then(function(res) {
            return res.text();
          }).then(function(body) {
            body = JSON.parse(body);
            if (body.status == 'ok') {
              madeby.clan = body.data[clan].tag;
              madeby.color = body.data[clan].color;
              madeby.icon = body.data[clan].emblems.x195.portal;
            }
          });
      }
    });
}
aboutme()

function listtorurl(arrr,begin,end) {
  return (JSON.stringify(arrr.slice(begin, end)).replace('[', '').replace(']', '').replace(/,/g, '%2C'))
}

var app = express();
app.set('json spaces', 2);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var staticPath = path.join(__dirname, '/www');
app.use(express.static(staticPath));
app.use(fileUpload());

var port = 2020;
app.listen(port, function() {
  console.log('listening on port: '.green + colors.green(port));
});

app.get('/', function(req, res) {
  res.render('index');
})

app.get('*', function(req, res){
  res.status(404).sendFile(__dirname + '/www/404.html');
});

function clanstolist() {
  var list = [];
  function clans(nr) {
    // request list of clan
    request('https://api.worldoftanks.eu/wgn/clans/list/?application_id=' + config.wgkey + '&limit=100&game=wot&fields=clan_id&page_no=' + nr, function (error, response, body) {
      try {
        // turn the response into a new list to make the next request for the clan discription
        body = JSON.parse(body);
        if (body.status == 'ok') {
          var convert = [];
          for (var i = 0; i < body.data.length; i++) {
            convert.push(body.data[i].clan_id)
          }
          fetch('https://api.worldoftanks.eu/wgn/clans/info/?application_id=' + config.wgkey + '&clan_id=' + listtorurl(convert, 0, 100) + '&fields=description')
            .then(function(res) {
              return res.text();
            }).then(function(body2) {
              // check if in the clan discription does have "pure" dutch words
              // if so add it to a list with clan id's
              body2 = JSON.parse(body2);
              for (var key in body2.data){
                var description = body2.data[key].description;
                if ( description.match( /(verplicht|menselijkheid|Pannenkoeken|leeftijd|minimale|opzoek|beginnende|nederlandse|spelers|voldoen|wij zijn|gezelligheid|ons op|Kom erbij|minimaal|gemiddelde|plezier|samenwerking|samenwerken|aangezien|toegelaten|goedkeuring|gebruik|tijdens)/i ) ) {
                  list.push(key);
                  console.log('--> ' + key);
                }
              }
              if (convert.length > 95) {
                console.log('list' + nr);
                clans(nr + 1);
              } else {
                console.log('finallize');
                finallize();
              }
            });
        } else {
          finallize();
        }
      } catch (e) {
        finallize();
      }
      function finallize() {
        // this function will add all the missing clans added by other pepole
        // and remove clans that have dutch words or are not relevant to this list
        try {
          fs.readFile(config.extraclans, function(errrr, linesdata) {
            // TODO: add function for checking if the clan still exsist
            var lines = linesdata.toString().split("\n");
            for (var i = 0; i < lines.length; i++) {
              lines[i] = lines[i].replace(/\r/g, "")
            }
            fs.readFile(config.blockedclans, function(errrrr, blockedclans) {
              blockedclans = JSON.parse(blockedclans.toString());
              for (var i = 0; i < lines.length; i++) {
                var status = true;
                for (var j = 0; j < list.length; j++) {
                  if (list[j] == lines[i]) {
                    status = false;
                  }
                }
                if (status) {
                  list.push(lines[i]);
                }
              }
              list = _.difference(list, blockedclans);
              // output the list to a file to use it later
              fs.outputJson(config.clansfile, list, err => {

              });
            })
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
  clans(1)
}
// clanstolist();
