#!/usr/bin/env node

// site theme
// https://material.io/color/#!/?view.left=0&view.right=0&primary.color=212121

// packages
const path = require('path');
const request = require("request");
const fs = require('fs-extra');
const colors = require('colors');
const base64 = require('base64-js');
const pics = require('pics');
const promptly = require('promptly');
const fetch = require('node-fetch');
const readline = require('readline');
const _ = require('underscore');
const sortOn = require('sort-on');
const watch = require('node-watch');
const UglifyJS = require("uglify-js");
const mergeImg = require("merge-img");
const shell = require('shelljs');
const marked = require('marked');
const os = require('os');
const hasha = require('hasha');
const randomstring = require("randomstring");
const sizeOf = require('image-size');
const urlExists = require('url-exists');
const sm = require('sitemap');
// express packages
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const cacheResponseDirective = require('express-cache-response-directive');
// config file (s)
var config = fs.readJsonSync('./db/config.json');
var devon = fs.readJsonSync('./db/dev.json');
config['dev'] = devon.on;

// checking if ffmpeg is installed / supported
config['ffmpeg'] = true;
config['FfmpegPath'] = 'ffmpeg';
console.log('');
console.log('clans counted: ' + colors.green(fs.readJsonSync(config.clansfile).length));
if (!shell.which(config.FfmpegPath)) {
  if (os.platform().startsWith('win')) {
    config.FfmpegPath = './ffmpeg/ffmpeg.exe';
    if (!shell.which(config.FfmpegPath)) {
      console.log(colors.red('ffmpeg is not detected, this may couse some issu\'s'))
      config.ffmpeg = false
    };
  } else {
    console.log(colors.red('ffmpeg is not detected, this may couse some issu\'s'))
  }
};
console.log('');

// uglify the script (s)
watch(config.js['script.js'].dev, { recursive: true }, function(evt, name) {
  uglyfiscript('script.js');
});
watch(config.js['worker.js'].dev, { recursive: true }, function(evt, name) {
  uglyfiscript('worker.js');
});
watch(config.js['changeclandata.js'].dev, { recursive: true }, function(evt, name) {
  uglyfiscript('changeclandata.js');
});
function uglyfiscript(name) {
  fs.readFile(config.js[name].dev, 'utf8', (errr, data) => {
    var uglyjs = UglifyJS.minify(data);
    if (!uglyjs.error) {
      fs.outputFile(config.js[name].normal, uglyjs.code, err => {

      })
    } else {
      console.log(colors.red('error uglifying js file: ' + config.js[name].normal));
      console.log(colors.red(uglyjs.error));
    }
  })
}

// update serviceworker on file change
setTimeout(function () {
  watch('./www/', {recursive: true}, function(evt, name) {
    if (name != 'www/swconf.js') {
      updateserviceworker()
    }
  })
}, 2000);
function updateserviceworker() {
  var SwVersionFile = './db/sw_version.json';
  fs.readJson(config.clandata.firstload, (err, data) => {
    fs.readJson(SwVersionFile, (err, version) => {
      swversion = version.version
      var list = data.chunk_inefficient(100)
      var filesToCache = [
        '/',
        '/css/home.css',
        '/dyjs/vue.js',
        '/js/anime.min.js',
        '/dyjs/script.js',
        '/js/underscore.min.js',
        '/dyjs/changeclandata.js',
        '/manifest.json',
        '/clan/true',
        '/mediatemplate',
        '/img/promo/woti.png',
        '/css/media.css',
        '/cache-polyfill.js'
      ]
      for (var i = 0; i < list.length; i++) {
        filesToCache.push('/img/clanicons-' + i + '.min.png');
      }
      fs.outputFile('./www/swconf.js', `
var filesToCache = ` + JSON.stringify(filesToCache) + `
var cacheName = '#` + swversion + `'
      `, err => {
        if (err) {
          console.log(err);
        }
      })
      fs.outputJson(SwVersionFile, {version: swversion + 1}, err => {

      })
    })
  })
}

// site made by
var madeby = {
  name: '',
  clan: '',
  color: '',
  icon: ''
}

// request app personal data
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

// a function for turning an array into an url string
function listtorurl(arrr,begin,end) {
  return (JSON.stringify(arrr.slice(begin, end)).replace('[', '').replace(']', '').replace(/,/g, '%2C').replace(/\"/g, ''))
}

// express config
var app = express();
app.set('json spaces', 2);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/www'));
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var staticPath = path.join(__dirname, '/www');
var clanmedia = path.join(__dirname, config.clanmedia);
app.use(cookieParser(randomstring.generate(100)));
app.use(fileUpload());
app.use(cacheResponseDirective());
app.use(compression({ threshold: 0 }));
app.use('/', express.static(staticPath));
app.use('/clanmedia/', express.static(clanmedia));

// startup app
try {
  var port = config.port;
  app.listen(port, function() {
    console.log('listening on port: '.green + colors.green(port));
  });
} catch (e) {
  console.log(colors.red('server can\'t start most likly because of another program that is using the same port'));
}

// a list with all clan roles available in world of tanks
var clanroles = [
  'commander',
  'executive_officer',
  'personnel_officer',
  'combat_officer',
  'quartermaster',
  'recruitment_officer',
  'private',
  'recruit',
  'reservist'
]

// getplayerinfo plus check if player is loged in
function playerinf(req,res,callback) {
  var check = checklogin(req,res,true);
  if (check.status) {
    var accoundid = check.player.account_id;
    var requrl = 'https://api.worldoftanks.eu/wot/account/info/?application_id=' + config.wgkey + '&account_id=' + accoundid + '&access_token=' + check.player.access_token + '&fields=clan_id';
    if (check.player.account_id == 516673968 && config.dev) {
      // rebls
      // accoundid = 503312278;
      // requrl = 'https://api.worldoftanks.eu/wot/account/info/?application_id=' + config.wgkey + '&account_id=' + accoundid + '&fields=clan_id';

      // bro
      accoundid = 521504275;
      requrl = 'https://api.worldoftanks.eu/wot/account/info/?application_id=' + config.wgkey + '&account_id=' + accoundid + '&fields=clan_id';
    }
    fetch(requrl)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        if (json.status == 'ok') {
          for (var player in json.data) {
            if (json.data[player].clan_id) {
              fs.readFile(config.clandata.allI, 'utf8', (err, data) => {
                var clans = JSON.parse(data);
                if (clans[json.data[player].clan_id]) {
                  var UsersClan = clans[json.data[player].clan_id];
                  var FileLocation = config.clanconf + UsersClan.clan_id + config.apiversion;
                  var Playerlvl = 9;
                  function SendCallBack() {
                    fs.readJson(FileLocation, (err3, data3) => {
                      var clanrole = 'reservist';
                      var ForStatus = false;
                      var edditclandata = false;
                      for (var i = 0; i < UsersClan.members.length; i++) {
                        if (UsersClan.members[i].account_id == accoundid) {
                          ForStatus = true;
                          clanrole = UsersClan.members[i].role;
                        }
                      }
                      if (ForStatus) {
                        for (var i = 0; i < clanroles.length; i++) {
                          var level = i;
                          if (clanrole == clanroles[i] && (level < data3.lasteddit || level < 3)) {
                            edditclandata = true;
                            Playerlvl = level;
                          }
                        }
                      }
                      callback({
                        status: true,
                        clan: true,
                        clanid: json.data[player].clan_id,
                        Playerlvl: Playerlvl,
                        edditclandata: edditclandata,
                        accoundid: accoundid,
                        clandetails: UsersClan,
                        claninfo: data3
                      })
                    })
                  }
                  if (fs.existsSync(FileLocation)) {
                    SendCallBack()
                  } else {
                    fs.outputJson(FileLocation, {
                      "clansite": "",
                      "clanteamspeak": "",
                      "lasteddit": 9,
                      "withclan": []
                    }, err => {
                      SendCallBack()
                    });
                  }
                } else {
                  callback({status: true, clan: false})
                }
              })
            } else {
              callback({status: true, clan: false})
            }
          }
        } else {
          res.clearCookie('account_id');
          res.clearCookie('key');
          res.clearCookie('logedin');
          callback({status: false})
        }
      });
  } else {
    callback({status: false})
  }
}

// create sitemap
var sitemap;
function generatesitemap() {
  fs.readJson(config.clandata.all, (err, data) => {
    var urls = [
      {url:'/api',changefreq: 'monthly', priority: 0.4},
      {
        url:'/',
        changefreq: 'daily',
        priority: 1,
        img: [{
          url: 'https://wotnlclans.mkopenga.com/img/preview-2.png',
          caption: 'Wot NL/BE clans'
        },{
          url: 'https://wotnlclans.mkopenga.com/img/preview-1.png',
          caption: 'Wot NL/BE clans'
        },{
          url: 'https://wotnlclans.mkopenga.com/img/promo/woti.png',
          caption: 'WoTi'
        }]
      },
    ]
    for (var i = 0; i < data.length; i++) {
      urls.push({
        url: '/clan/' + data[i].clan_id,
        changefreq: 'weekly',
        priority: 0.7,
        img: [{
          url: 'https://eu.wargaming.net/clans/media/clans/emblems/cl_274/' + data[i].clan_id + '/emblem_195x195.png',
          caption: data[i].tag + 'Clan Logo'
        }]
      });
    }
    sitemap = sm.createSitemap ({
      hostname: 'https://wotnlclans.mkopenga.com',
      cacheTime: 14400000,
      urls: urls
    })
  })
}
generatesitemap()

// send sitemap
app.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (err, xml) {
      if (err) {
        return res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
});

// check if user is loged-in
function checklogin(req,res,playerinfo) {
  var ResJson = {};
  var LoginStatus = false;
  if (req.signedCookies.account_id && req.signedCookies.key) {
    var account_id = req.signedCookies.account_id;
    for (var i = 0; i < knownpepole.length; i++) {
      if (knownpepole[i].account_id == account_id) {
        LoginStatus = true;
        ResJson = knownpepole[i];
      }
    }
  }
  if (!LoginStatus) {
    res.clearCookie('account_id');
    res.clearCookie('key');
    res.clearCookie('logedin');
  }
  if (playerinfo) {
    if (LoginStatus) {
      return {status: true, player: ResJson};
    } else {
      return {status: false};
    }
  } else {
    return LoginStatus;
  }
}

// serviceworkerfile
app.get('/serviceworker.js', function(req,res) {
  fs.readFile('./www/swconf.js', 'utf8', (err, part1) => {
    fs.readFile('./www/sw.js', 'utf8', (err, part2) => {
      res.set('Content-Type', 'application/javascript');
      res.send(part1 + part2)
    })
  })
})

// api redirect
app.get('/api', function(req, res) {
  res.render('api');
});

// mediatemplate
app.get('/mediatemplate', function(req, res) {
  res.render('mediatemplate');
})

// a url for fixing the clan icons
app.get('/refrechimgs', function(req,res) {
  playerinf(req,res,function(status) {
    if (status.status == true && status.clan == true && (config.dev || status.accoundid == 516673968)) {
      mkimg()
      res.json({
        status: true
      })
    } else {
      res.json({
        status: false
      })
    }
  })
});

// api for iframes on someones website
app.get('/c1/:clanid/:color/html', function(req, res) {
  ApiC1(req, res)
});
app.get('/c1/:clanid/:color', function(req, res) {
  ApiC1(req, res)
});

function ApiC1(req, res) {
  var textcolor = 'black';
  var reqcolor = req.params.color;
  var reqclanid = req.params.clanid;
  if (reqcolor == 'black' || reqcolor == '000') {
    textcolor = 'white';
  }
  fs.readJson(config.clandata.all)
  .then(clans => {
    var clansearchstatus = false;
    var clanpos = 0;
    for (var i = 0; i < clans.length; i++) {
      if (clans[i].clan_id == reqclanid) {
        clansearchstatus = true;
        clanpos = i;
      }
    }
    if (clansearchstatus) {
      res.render('api-c1', {
        icon: clans[clanpos].emblems.x195.portal || '',
        textcolor: textcolor || '',
        title: '[' + clans[clanpos].clan_tag + ']'  || '',
        rating: clans[clanpos].efficiency.value || '',
        place: clanpos + 1 || ''
      });
    } else {
      res.render('api-c1', {
        icon: '',
        textcolor: textcolor,
        title: '',
        rating: '',
        place: ''
      });
    }
  })
};

// serv home dir
app.get('/', function(req, res) {
  // check if the url is an spf request
  if (req.url.slice(-13) == '?spf=navigate') {
    res.json({
      "title": "WOT NL/BE clans"
    })
  } else {
    res.render('index', {
      madeby: madeby.name + ' [' + madeby.clan + ']',
      madebylink: 'https://worldoftanks.eu/en/community/accounts/' + config.madeby,
      login: checklogin(req,res)
    });
  }
})

// a function for edditing clan data
function edditclandata(playerlvl, clan, overwride) {
  overwride.lasteddit = playerlvl;
  var file = config.clanconf + clan + config.apiversion;
  fs.outputJson(file, overwride, err => {

  });
}

// check if you can change clan data
app.post('/rules', function(req, res) {
  playerinf(req,res,function(status) {
    const ReportsFile = config.clanreports + 'player-' + status.accoundid + '.json';
    if (status.clan) {
      var clandetials = {
        clanid: status.clandetails.clan_id || '',
        clantag: status.clandetails.tag || '',
        smallimg: status.clandetails.emblems.x32.portal || '',
        img: status.clandetails.emblems.x195.portal || ''
      }
    } else {
      var clandetials = {
        clanid: '',
        clantag: '',
        smallimg: '',
        img: ''
      }
    }
    if (fs.existsSync(ReportsFile)) {
      fs.readJson(ReportsFile, (err, reports) => {
        res.json({
          status: status.status,
          clan: status.clan,
          edditclandata: status.edditclandata,
          playerlvl: status.Playerlvl,
          claninfo: status.claninfo,
          reports: reports,
          clandata: clandetials
        })
      });
    } else {
      res.json({
        status: status.status,
        clan: status.clan,
        edditclandata: status.edditclandata,
        playerlvl: status.Playerlvl,
        claninfo: status.claninfo,
        reports: false,
        clandata: clandetials
      })
    }
  });
});

// function for clan reports
app.post('/reportclan', function(req, res) {
  playerinf(req,res,function(status) {
    if (status.status && req.body.report && req.body.clan) {
      const reportclan = req.body.clan;
      const report = req.body.report;
      const PlayFile = config.clanreports + 'player-' + status.accoundid + '.json';
      const ClanFile = config.clanreports + 'clan-' + reportclan + '.json';
      function EditClanReport() {
        function ModifReport(clanconf) {
          var toeddit = 'no';
          if (report) {
            toeddit = 'yes';
          }
          clanconf[toeddit] = clanconf[toeddit] + 1;
          fs.outputJson(ClanFile, clanconf, err => {

          });
        }
        if (fs.existsSync(ClanFile)) {
          fs.readJson(ClanFile, function functionName(err,clanconf) {
            ModifReport(clanconf);
          });
        } else {
          var clanconf = config.ClanReportModel;
          ModifReport(clanconf);
        }
      }
      function EditPlayerFile(playerinf) {
        playerinf.reportclans.push({
          clanid: reportclan,
          report: report
        });
        fs.outputJson(PlayFile, playerinf, err => {

        });
      }
      if (fs.existsSync(PlayFile)) {
        fs.readJson(PlayFile, function functionName(err,data) {
          var reportclanstatus = true;
          for (var i = 0; i < data.reportclans.length; i++) {
            if (data.reportclans[i].clanid == reportclan) {
              reportclanstatus = false;
            }
          }
          if (reportclanstatus && !data.block) {
            EditClanReport();
            EditPlayerFile(data);
          }
        })
      } else {
        EditClanReport();
        EditPlayerFile(config.PlayerReportModel);
      }
      res.json({status: true});
    } else {
      res.json({status: false})
    }
  });
});

app.post('/removemedia', function(req, res) {
  var req = req;
  var res = res;
  function backend(status) {
    var filename = req.body.filename;
    var clanid = status.clanid;
    var claninffile = config.clanmedia + clanid + '/claninf.json';
    fs.readJson(claninffile, function(err,claninf) {
      for (var i = 0; i < claninf.imgs.length; i++) {
        if (claninf.imgs[i].location == filename) {
          var filetype = claninf.imgs[i].filetype;
          claninf.imgs.splice(i,1);
          fs.outputJson(claninffile, claninf, err => {
            if (err) return console.error(err)
          });
          fs.remove(config.clanmedia + clanid + filename + '.' + filetype, err => {
            if (err) return console.error(err)
          });
          fs.remove(config.clanmedia + clanid + filename + '.min.' + filetype, err => {
            if (err) return console.error(err)
          });
        }
      }
    });
  }
  playerinf(req,res,function(status) {
    try {
      if (req.body.filename && status.clan && status.status && status.Playerlvl < 6) {
        backend(status)
        res.json({
          status: true,
          statusdata: status
        });
      } else {
        res.json({
          status: false,
          why: 'auth'
        })
      }
    } catch (e) {
      res.json({
        status: false,
        why: 'auth'
      })
    }
  });
});

// upload clan images
app.post('/submitclammedia', function(req, res) {
  var req = req;
  var res = res;
  var imgwidth = 0;
  var imgheight = 0;
  function response(status) {
    var status = status;
    var imgcount = 0;
    var claninffile = config.clanmedia + status.clanid + '/claninf.json';
    if (!fs.existsSync(claninffile)) {
      fs.readJson(config.clandata.allI, function(err,clanslist) {
        try {
          var claninf = {
            imgcount: imgcount,
            imgs: [],
            icons: clanslist[status.clanid].emblems,
            tag: clanslist[status.clanid].tag,
            color: clanslist[status.clanid].color
          }
          fs.outputJson(claninffile, claninf, function(err, data) {
            nextpart();
          });
        } catch (e) {
          console.error(e);
        }
      });
    } else {
      fs.readJson(claninffile, function(err, claninf) {
        imgcount = claninf.imgcount;
        nextpart();
      });
    }
    function nextpart() {
      var foroutputfile = config.clanmedia + status.clanid + '/media-' + imgcount + '.' + req.files.file.mimetype.replace("image/",'');
      fs.outputFile(foroutputfile, req.files.file.data, err => {
        if (err) {
          console.log(err);
        }
        fs.readJson(claninffile, (claninferr, claninfdata) => {
          sizeOf(foroutputfile, function (err, dimensions) {
            imgwidth = dimensions.width;
            imgheight = dimensions.height;
            var newres = '';
            var blur = 27;
            if (imgwidth > imgheight) {
              var calculate = imgheight / imgwidth * blur;
              newres = 'scale=h=' + Math.round(calculate) + ':w=' + blur;
            } else {
              var calculate = imgwidth / imgheight * blur;
              newres = 'scale=h=' + blur + ':w=' + Math.round(calculate);
            }
            if (config.ffmpeg) {
              shell.exec(
                config.FfmpegPath +
                ' -y -i ' + foroutputfile +
                ' -vf ' + newres + ' ' +
                config.clanmedia + status.clanid + '/media-' + imgcount + '.min.' + req.files.file.mimetype.replace("image/",''), {silent:true}
              ).code
            }
            claninfdata.imgs.push({
              location: '/media-' + imgcount,
              filetype: req.files.file.mimetype.replace("image/",''),
              title: req.body.title,
              url: req.body.url,
              imgwidth: imgwidth,
              imgheight: imgheight
            });
            if (claninfdata.imgs.length > 10) {
              var ToRemove = claninfdata.imgs[0];
              fs.remove(config.clanmedia + status.clanid + ToRemove.location + '.' + ToRemove.filetype, err => {
                if (err) return console.error(err)
              });
              fs.remove(config.clanmedia + status.clanid + ToRemove.location + '.min.' + ToRemove.filetype, err => {
                if (err) return console.error(err)
              });
              claninfdata.imgs.splice(0,1);
            }
            claninfdata.imgcount = claninfdata.imgcount + 1;
            fs.outputJson(claninffile, claninfdata, err => {
              if (err) {
                console.log(err);
              }
            });
          });
        })
      });
    }
  }
  playerinf(req,res,function(status) {
    try {
      if (req.files.file &&
        (req.body.title || req.body.title == '') &&
        (req.body.url || req.body.url == '') &&
        req.body.url.length > 40 &&
        status.clan &&
        status.status &&
        status.Playerlvl < 6 &&
        req.files.file.mimetype.startsWith("image/")) {
        if (req.body.url == '') {
          response(status)
          res.json({
            status: true,
            servstatus: status,
            files: req.files.file,
            body: req.body
          });
        } else {
          try {
            urlExists(req.body.url, function(err, exists) {
              if (exists) {
                response(status)
                res.json({
                  status: true,
                  servstatus: status,
                  files: req.files.file,
                  body: req.body
                });
              } else {
                res.json({
                  status: false,
                  why: 'url'
                })
              }
            })
          } catch (e) {
            res.json({
              status: false,
              why: 'url'
            })
          }
        }
      } else {
        res.json({
          status: false,
          why: 'auth'
        })
      }
    } catch (e) {
      res.json({
        status: false,
        why: 'auth'
      })
    }
  });
});

app.get('/clanmedia/:clanid', function(req, res) {
  var clanid = req.params.clanid;
  fs.readJson(config.clandata.allI, (err, clans) => {
    if (clans[clanid]) {
      if (fs.existsSync(config.clanmedia + clanid + '/claninf.json')) {
        fs.readJson(config.clanmedia + clanid + '/claninf.json', (err, claninf) => {
          claninf.imgs = claninf.imgs.reverse()
          claninf['id'] = clanid;
          claninf['status'] = true;
          res.json(claninf)
        });
      } else {
        res.json({
          status: false
        })
      }
    } else {
      res.json({
        status: false
      })
    }
  })
});

// get basic clan media
app.get('/clanmedia', function(req, res) {
  fs.readdir(config.clanmedia, function(err, items) {
    function response() {
      res.json({
        status: true,
        content: contentarr.reverse()
      })
    }
    var items = items;
    var contentarr = []
    function foritems(i) {
      var i = i;
      if (items[i]) {
        fs.readJson(config.clanmedia + items[i] + '/claninf.json', (err, data) => {
          data['id'] = items[i];
          data.imgs = data.imgs.reverse();
          contentarr.push(data);
          foritems(i + 1)
        })
      } else {
        response()
      }
    }
    foritems(0)
  });
});

// submit player's clan data
app.post('/submitclandata', function(req, res) {
  playerinf(req,res,function(status) {
    if (status.status && status.clan) {
      if (status.edditclandata) {
        var web = req.body.clansite;
        var teamspeak = req.body.clanteamspeak;
        if (web && teamspeak && (ValidURL(web) || ValidIP(web) || web == '') &&
        (ValidDomain(teamspeak) || ValidIP(teamspeak) || teamspeak == '') &&
        checkx(teamspeak) && checkx(web)){
          status.claninfo.clansite = web;
          status.claninfo.clanteamspeak = teamspeak;
          edditclandata(status.Playerlvl, status.clanid, status.claninfo);
          res.json({
            status: true,
            data: status.claninfo
          })
        } else {
          res.json({
            status: false,
            why: 'wrong input'
          })
        }
      } else {
        // lvl to low means you don't have the rights to change clan info
        res.json({
          status: false,
          why: 'LVL_TO_LOW'
        })
      }
    } else {
      res.json({
        status: false
      })
    }
  })
});

// get player auth via wargaming api
var knownpepole = []
app.get('/redirect/:where', function (req, res) {
  var where = req.params.where;
  if (where == 'login') {
    var RedirectBack = '&redirect_uri=' + encodeURIComponent(req.protocol + '://' + req.get('host') + '/redirect/back')
    fetch('https://api.worldoftanks.eu/wot/auth/login/?display=popup&nofollow=1&application_id=' + config.wgkey + RedirectBack)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        res.redirect(json.data.location);
      });
  } else if (where == 'back') {
    if (req.query.status == 'ok') {
      var status = true;
      var data = {
        access_token: req.query.access_token,
        nickname: req.query.nickname,
        account_id: req.query.account_id,
        expires_at: req.query.expires_at
      }
      var datahash = hasha(JSON.stringify(data));
      for (var i = 0; i < knownpepole.length; i++) {
        if (req.query.account_id == knownpepole[i].account_id) {
          status = false;
          knownpepole[i] = data;
        }
      }
      if (status) {
        knownpepole.push(data);
      }
      var docurl = req.get('host').replace(/:/g,'').replace(/[0-9]/g, '');
      if (docurl.startsWith("localhost") || docurl == "wotnlclans.mkopenga.com" || docurl == "wotnlclans-api.mkopenga.com") {
        res.cookie('key', datahash, { domain: docurl, httpOnly: true, signed: true });
        res.cookie('account_id', data.account_id, { domain: docurl, httpOnly: true, signed: true });
        res.cookie('logedin', 'true', {domain: docurl})
      }
      res.redirect(req.protocol + '://' + req.get('host'));
    } else {
      res.redirect(req.protocol + '://' + req.get('host'));
    }
  }
})

// serv the news.md file as html
app.get('/news.html',function(req, res) {
  fs.readFile(config.news, 'utf8', (err, data) => {
    res.send(marked(data))
  })
})

// get clan name from clan
app.get('/clanname/:clanid', function(req, res) {
  fs.readFile(config.clandata.names, 'utf8', (err, data) => {
    data = JSON.parse(data);
    res.cacheControl({maxAge: "300min"});
    if (data[req.params.clanid]) {
      res.json(data[req.params.clanid]);
    } else {
      res.json({})
    }
  })
})

// first load for website loading clan names and view stats
app.get('/clandata-firstload/', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.resolve(config.clandata.firstload));
})

// second load this will serv the rest of the missing stats
app.get('/clandata-load2/', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.resolve(config.clandata.load2));
})

// serv clan info
// TODO: be able to make time request
app.get('/claninfo/:time/:clanid', function (req, res) {
  var clanid = req.params.clanid;
  var apipath = config.clanconf + clanid + config.apiversion;
  fs.readFile(config.clandata.allI, 'utf8', (err, data) => {
    data = JSON.parse(data);
    if (fs.existsSync(apipath)) {
      fs.readJson(apipath, (err, clanapidata) => {
        try {
          var sendjson = _.extend({}, data[clanid], clanapidata);
          res.json(sendjson);
        } catch (e) {
          res.json(data[clanid] || {});
        }
      })
    } else {
      res.json(data[clanid] || {});
    }
  })
})

// request clan stats page or handle the spf clan stats page request
app.get('/clan/:clanid', function (req, res) {
  var clanid = req.params.clanid;
  fs.readFile(config.clandata.names, function(err, claninf) {
    claninf = JSON.parse(claninf);
    if (claninf[clanid] || clanid == 'true') {
      if (req.url.slice(-13) == '?spf=navigate') {
        res.json({
          "title": "NL/Be clan: [" + claninf[clanid].clan_tag + "]"
        })
      } else {
        var full = true;
        if (clanid == 'true') {
          full = false;
        }
        res.render('clandetails.ejs', {
          madeby: madeby.name + ' [' + madeby.clan + ']',
          madebylink: 'https://worldoftanks.eu/en/community/accounts/' + config.madeby,
          full: full,
          login: checklogin(req,res)
        })
      }
    } else {
      res.status(404).sendFile(__dirname + '/www/404.html');
    }
  })
})

// reqest for javascript if dev mode is off it will send the uglify version of the file
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

// 404 page if not found
app.get('*', function(req, res){
  res.status(404).sendFile(__dirname + '/www/404.html');
});

// search for clans clan get all clan stats
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

// update the clan stats
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

// get all clan images and combine them all together
function mkimg() {
  generatesitemap()
  shell.exec('node createicons.js').code
}

// Create array chunks
Object.defineProperty(Array.prototype, 'chunk_inefficient', {
  value: function(chunkSize) {
    var array=this;
    return [].concat.apply([],
      array.map(function(elem,i) {
        return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
      })
    );
  }
});

// validation functions from old site
function checkx(i) {
  if (
    i.search("<") > 0 ||
    i.search(">") > 0 ||
    i.search("{") > 0 ||
    i.search("}") > 0 ||
    i.search("'") > 0 ||
    i.search('"') > 0
  ) {
    return (false)
  } else {
    return (true)
  }
}
function reverse(s) {
  try {
    var output = s.split('').reverse().join('');
    return output;
  } catch (e) {
    return false;
  }
}
function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}
function ValidDomain(str) {
  str = str.replace(/\./g, '');
  str = str.replace(/:/g, '');
  var filter = /^[A-Za-z0-9]+$/;
  if (filter.test(str)) {
    return true;
  } else {
    return false;
  }
}
function ValidIP(ipaddress) {
  try {
    if (reverse(ipaddress).indexOf(":") > 0) {
      if (/^\d+$/.test(reverse(ipaddress).substring(0, reverse(ipaddress).indexOf(":") - 1))) {
        ipaddress = ipaddress.substring(0 , ipaddress.length - reverse(ipaddress).indexOf(":") - 1);
      } else {
        return (false)
      }
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return (true)
    }
    return (false)
  } catch (e) {
    return (false)
  }
}

if (!config.dev) {
  console.log('starting timeout for clansearch');
  function updateclandataTimeout() {
    setTimeout(function () {
      updateclandataTimeout();
      updateclandata();
    }, 1000 * 60 * 60 * 5);
    // 1sec * min*hour* 4
    // 1000 * 60 * 60 * 5
  }
  function clanstolistTimeout() {
    setTimeout(function () {
      clanstolistTimeout();
      clanstolist();
    }, 1000 * 60 * 60 * 24 * 4);
    // 1sec * min*hour* 4
    // 1000 * 60 * 60 * 5
  }
  updateclandataTimeout();
  clanstolistTimeout();
}

if (!config.dev) {
  clanstolist();
  // updateclandata();
}

uglyfiscript('script.js');
uglyfiscript('worker.js');
uglyfiscript('changeclandata.js');
