var path = require('path');
var express = require('express');
var request = require("request");
var fs = require('fs-extra');
var bodyParser = require('body-parser');
var colors = require('colors');
var fileUpload = require('express-fileupload');
var base64 = require('base64-js');
var pics = require('pics');
var ejs = require('ejs');
var promptly = require('promptly');
var fetch = require('node-fetch');

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
    request('https://api.worldoftanks.eu/wgn/clans/list/?application_id=f53bdb585a307dbb8e5c1fdcbf213384&limit=100&game=wot&fields=clan_id&page_no=' + nr, function (error, response, body) {
      body = JSON.parse(body);
      if (body.status == 'ok') {
        var convert = [];
        for (var i = 0; i < body.data.length; i++) {
          convert.push(body.data[i].clan_id)
        }
        fetch('https://api.worldoftanks.eu/wgn/clans/info/?application_id=f53bdb585a307dbb8e5c1fdcbf213384&clan_id=' + listtorurl(convert, 0, 100) + '&fields=description')
          .then(function(res) {
            return res.text();
          }).then(function(body) {
            body = JSON.parse(body)
            console.log(body);
          });
        // for (var i = 0; i < body.data.length; i++) {
        //   arr.push(body.data[i].clan_id)
        // }
        // list.push(arr);
        // console.log(list.length);
        // clans(nr + 1);
      } else {
        var total = list.length * 100;
        console.log('all clans collected: ' + total + ' clans id\'s');
      }
    });
  }
  clans(1)
}
clanstolist();
