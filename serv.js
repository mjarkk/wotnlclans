#!/usr/bin/env node

// https://material.io/color/#!/?view.left=0&view.right=0&primary.color=212121

const path = require('path');
const express = require('express');
const compression = require('compression')
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
const sortOn = require('sort-on');
const watch = require('node-watch');
const UglifyJS = require("uglify-js");
const mergeImg = require("merge-img");
const shell = require('shelljs');
var config = fs.readJsonSync('./db/config.json');

// startup
config['ffmpeg'] = true;
console.log('');
console.log('clans counted: ' + colors.green(fs.readJsonSync(config.clansfile).length));
if (!shell.which('ffmpeg')) {
  console.log(colors.red('ffmpeg is not detected, this may couse some issu\'s'))
  config.ffmpeg = false
};
console.log('');

// uglify the main script.js
watch(config.js['script.js'].dev, { recursive: true }, function(evt, name) {
  uglyfiscript('script.js');
});
watch(config.js['worker.js'].dev, { recursive: true }, function(evt, name) {
  uglyfiscript('worker.js');
});
function uglyfiscript(name) {
  fs.readFile(config.js[name].dev, 'utf8', (errr, data) => {
    var uglyjs = UglifyJS.minify(data);
    if (!uglyjs.error) {
      fs.outputFile(config.js[name].normal, uglyjs.code, err => {

      })
    } else {
      console.log(colors.red('error uglifying js file: '));
      console.log(colors.red(uglyjs.error));
    }
  })
}

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
  return (JSON.stringify(arrr.slice(begin, end)).replace('[', '').replace(']', '').replace(/,/g, '%2C').replace(/\"/g, ''))
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
app.use(compression({ threshold: 0 }));

try {
  var port = config.port;
  app.listen(port, function() {
    console.log('listening on port: '.green + colors.green(port));
  });
} catch (e) {
  console.log(colors.red('server can\'t start most likly because of another program that uses the same port'));
}

app.get('/', function(req, res) {
  res.render('index', {
    madeby: madeby.name + ' [' + madeby.clan + ']',
    madebylink: 'https://worldoftanks.eu/en/community/accounts/' + config.madeby
  });
})

app.get('/clanicons.png', function (req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.set('Content-Type', 'image/png');
  if (config.ffmpeg) {
    res.sendFile(path.resolve('./www/img/clanicons.min.png'));
  } else {
    res.sendFile(path.resolve('./www/img/clanicons.png'));
  }
})

app.get('/clandata-firstload/', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.resolve(config.clandata.firstload));
})

app.get('/clandata-load2/', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.resolve(config.clandata.load2));
})

app.get('/claninfo/:time/:clanid', function (req, res) {
  fs.readFile(config.clandata.allI, 'utf8', (err, data) => {
    data = JSON.parse(data);
    res.json(data[req.params.clanid]);
  })
})

app.get('/clan/:clanid', function (req, res) {
  var clanid = req.params.clanid;
  fs.readFile(config.clandata.names, function(err, claninf) {
    claninf = JSON.parse(claninf);
    if (claninf[clanid]) {
      if (req.url.slice(-13) == '?spf=navigate') {
        res.json({
          "title": "NL/Be clan: [" + claninf[clanid].clan_tag + "]"
        })
      } else {
        res.render('clandetails.ejs', {
          madeby: madeby.name + ' [' + madeby.clan + ']',
          madebylink: 'https://worldoftanks.eu/en/community/accounts/' + config.madeby,
          full: true
        })
      }
    } else {
      res.status(404).sendFile(__dirname + '/www/404.html');
    }
  })
})

app.get('/dyjs/:js', function (req, res) {
  var script = req.params.js;
  res.setHeader('Cache-Control', 'no-cache');
  if (config.dev && config.js[script]) {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.resolve(config.js[script].dev));
  } else if (config.js[script]) {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.resolve(config.js[script].normal));
  } else {
    res.set('Content-Type', 'text/html');
    res.status(404).sendFile(__dirname + '/www/404.html');
  }
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
              if (convert.length < 96 || (config.dev == true && nr == 100)) {
                console.log('finallize');
                finallize();
              } else {
                console.log('list' + nr);
                clans(nr + 1);
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
            var lines = linesdata.toString().split("\n");
            for (var i = 0; i < lines.length; i++) {
              lines[i] = lines[i].replace(/\r/g, "")
            }
            var removefromlines = [];
            // checkif will check if the clan exsist and if not remove it from the list
            function checkif(c) {
              fetch('https://api.worldoftanks.eu/wgn/clans/info/?application_id=' + config.wgkey + '&clan_id=' + lines[c] + '&fields=tag')
                .then(function(res) {
                  return res.text();
                }).then(function(body) {
                  body = JSON.parse(body);
                  try {
                    if (body.status != 'ok' || body.data[lines[c]] == null) {
                      console.log('bad clan: ' + lines[c]);
                      removefromlines.push(lines[c])
                    } else if (body.data[lines[c]].tag == undefined || body.data[lines[c]].tag == "") {
                      console.log('bad clan: ' + lines[c]);
                      removefromlines.push(lines[c])
                    }
                  } catch (e) {

                  }
                  var cc = c + 1;
                  if (lines[cc]) {
                    checkif(cc)
                  } else {
                    lines = _.difference(lines, removefromlines);
                    removeblocked();
                  }
                });
            }
            function removeblocked() {
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
                  updateclandata();
                });
                console.log('dune');
              })
            }
            checkif(0);
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
  clans(1)
}

function updateclandata() {
  fs.readFile(config.clansfile, function(er, clans) {
    clans = JSON.parse(clans.toString());
    var toclanfile = [];
    function getclandata(i) {
      var begin = 0;
      var end = 0;
      var status = true;
      if (i == 0) {
        begin = 0;
      } else {
        begin = i * 100;
      }
      if ((i + 1) * 100 > clans.length) {
        end = clans.length;
        status = false;
      } else {
        end = (i + 1) * 100;
      }
      var url = listtorurl(clans, begin, end);
      fetch('https://api.worldoftanks.eu/wgn/clans/info/?application_id=' + config.wgkey + '&clan_id=' + url + '&game=wot')
        .then(function(res) {
          return res.json();
        }).then(function(body) {
          fetch('https://api.worldoftanks.eu/wot/clanratings/clans/?application_id=' + config.wgkey + '&clan_id=' + url)
            .then(function(ress) {
              return ress.json();
            }).then(function(body2) {
              if (body.status == 'ok' && body2.status == 'ok') {
                for (var key in body.data) {
                  var c = body.data[key];
                  var d = body2.data[key];
                  toclanfile.push(Object.assign({}, c, d));
                  console.log('--> ' + c.tag);
                }
                if (status) {
                  getclandata(i + 1);
                } else {
                  makeclandata()
                }
              } else {
                if (status) {
                  getclandata(i + 1);
                } else {
                  makeclandata()
                }
              }
            });
        });
    }
    getclandata(0)
    function makeclandata() {
      toclanfile = sortOn(toclanfile, '-efficiency.value');
      RemoveFromToclans = [];
      for (var i = 0; i < toclanfile.length; i++) {
        if (toclanfile[i].wins_ratio_avg.value == 0 || toclanfile[i].efficiency.value == 0 || toclanfile[i].exclude_reasons.efficiency == "newbies_measure" || toclanfile[i].exclude_reasons.battles_count_avg == "newbies_measure") {
          RemoveFromToclans.push(toclanfile[i])
        }
      }
      toclanfile = _.difference(toclanfile, RemoveFromToclans);
      console.log("creating files");
      var t = 5;
      var once = [];
      fs.outputJson(config.clandata.all, toclanfile, err => {
        console.log("1/"+t);
        fs.outputJson(config.clandata.allI, _.indexBy(toclanfile, 'clan_id'), err => {
          console.log("2/"+t);
          once = [];
          for (var i = 0; i < toclanfile.length; i++) {
            c = toclanfile[i];
            once.push({
              i: c.clan_id,
              t: c.tag,
              w: c.wins_ratio_avg.value,
              e: c.efficiency.value
            })
          }
          fs.outputJson(config.clandata.firstload, once, err => {
            console.log("3/"+t);
            once = [];
            for (var i = 0; i < toclanfile.length; i++) {
              c = toclanfile[i];
              var json = {
                leden: c.members_count,
                color: c.color,
                gm: {
                  "6": c.gm_elo_rating_6.value,
                  "8": c.gm_elo_rating_8.value,
                  "10": c.gm_elo_rating_10.value,
                  "normal": c.gm_elo_rating.value
                },
                s: {
                  "6": c.fb_elo_rating_6.value,
                  "8": c.fb_elo_rating_8.value,
                  "10": c.fb_elo_rating_10.value,
                  "normal": c.fb_elo_rating.value
                }
              }
              once.push(json);
            }
            fs.outputJson(config.clandata.load2, once, err => {
              console.log("4/"+t);
              once = [];
              for (var i = 0; i < toclanfile.length; i++) {
                c = toclanfile[i];
                var json = {
                  clan_tag: c.clan_tag,
                  clan_name: c.clan_name,
                  color: c.color,
                  clan_id: c.clan_id
                }
                once.push(json);
              }
              fs.outputJson(config.clandata.names, _.indexBy(once, 'clan_id'), err => {
                console.log("5/"+t);
                // when dune make a image with all clan icons
                mkimg();
              });
            });
          });
        });
      });
    }
  })
}

function mkimg() {
  fs.readJson(config.clandata.all, (err, data) => {
    var imgs = [];
    function reqimg(i) {
      fetch(data[i].emblems.x64.wot)
        .then(function(res) {
          return res.buffer();
        }).then(function(body) {
          imgs.push(body);
          console.log("img: " + i);
          if (data[i+1]) {
            reqimg(i+1)
          } else {
            createimg()
          }
        });
    }
    function createimg() {
      mergeImg(imgs)
        .then((img) => {
          img.write('./www/img/clanicons.png', () => {
            console.log('done converting all clan icon into one file');
            if (config.ffmpeg) {
              shell.exec('ffmpeg -y -i ./www/img/clanicons.png -vf scale=h=40:w=' + 40*419 + ' ./www/img/clanicons.min.png', {silent:true}).code
            }
          });
          // img.getBuffer(img.getMIME(), (inputBuffer) => {
          //
          // });

        });
    }
    reqimg(0)
  })
}

// clanstolist();
// updateclandata();
uglyfiscript('script.js');
uglyfiscript('worker.js');
