// config
var config = {
  wgkey: 'f53bdb585a307dbb8e5c1fdcbf213384',
  clansfile: './db/clans.json',
  extraclans: './db/extra.txt',
  blockedclans: './db/blockedclans.json'
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
const readline = require('readline')

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
    request('https://api.worldoftanks.eu/wgn/clans/list/?application_id=' + config.wgkey + '&limit=100&game=wot&fields=clan_id&page_no=' + nr, function (error, response, body) {
      try {
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
              body2 = JSON.parse(body2);
              for (var key in body2.data){
                var description = body2.data[key].description;
                if ( description.match( /(verplicht|menselijkheid|Pannenkoeken|leeftijd|minimale|opzoek|beginnende|nederlandse|spelers|voldoen|wij zijn|gezelligheid|ons op|Kom erbij|minimaal|gemiddelde|plezier|samenwerking|samenwerken|aangezien|toegelaten|goedkeuring|gebruik|tijdens)/i ) ) {
                  list.push(key);
                  console.log('--> ' + key);
                }
              }
              clans(nr + 1);
            });
        } else {
          finallize();
        }
      } catch (e) {
        finallize();
      }
      function finallize() {
        try {
          // here clan manipulation
          // add all the extra clans
          // and remove all wrong clans

          fs.outputJson(config.clansfile, list, err => {

          })
          console.log('all clans collected: ' + list.length + ' clans id\'s');
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
  clans(1)
}
// clanstolist();

// const list = fs.readJsonSync(config.clansfile)
//
// fs.readFile(config.extraclans, function(err, linesdata) {
//   var lines = linesdata.toString().split("\n");
//   for (var i = 0; i < lines.length; i++) {
//     var status = true;
//     for (var j = 0; j < list.length; j++) {
//       if (list[j] == lines[i]) {
//         status = false;
//       }
//     }
//     if (status) {
//       list.push(lines[i]);
//     }
//   }
//   console.log(list.length);
//
// });
