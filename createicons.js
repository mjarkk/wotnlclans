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

// packages
const gm = require('gm').subClass({imageMagick: true})
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

// configs
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

// redesing the function
function mkimgV2() {
  var icons = []
  fs.readJson(config.clandata.all, (err, data) => {
    for (var i = 0; i < data.length; i++) {
      if (data[i] && data[i].emblems && data[i].emblems.x64 && data[i].emblems.x64.wot) {
        icons.push(data[i].emblems.x64.wot)
      } else {
        icons.push('http://localhost:' + config.port + '/img/empty.png')
      }
    }
    icons = icons.chunk_inefficient(100)
    for (var i = 0; i < icons.length; i++) {
      fs.removeSync(__dirname + '/www/img/' + i)
    }
    makefilesready()
  });
  function makefilesready() {
    downloadicon(0, 0)
  }
  function downloadicon(j, i) {
    console.log('downloading icons:', i, 'from:', j)
    var iconfolderpath = __dirname + '/www/img/' + j + '/';
    if (!fs.existsSync(iconfolderpath)) {
      fs.ensureDirSync(iconfolderpath)
    }
    fetch(icons[j][i])
    .then(function(res) {
      var dest = fs.createWriteStream(__dirname + '/www/img/' + j + '/' + i + '.png');
      res.body.pipe(dest);
    }).then(function() {
      if (icons[j][i + 1]) {
        downloadicon(j, i + 1)
      } else if (icons[j + 1] && icons[j + 1][0]) {
        downloadicon(j + 1, 0)
      } else {
        combineimgs(0)
      }
    });
  }
  function combineimgs(i) {
    var i = i;
    console.log('Icons to list #' + i)
    let newfullimg = gm('./www/img/' + i + '/0.png')
    for (var j = 0; j < icons[i].length; j++) {
      if (j != 0) {
        newfullimg.append('./www/img/' + i + '/' + j + '.png', true)
      }
    }
    newfullimg.write('./www/img/clanicons-' + i + '.png', function (err) {
      if (err) {
        console.log(err);
      }
      gm('./www/img/clanicons-' + i + '.png')
      .resizeExact(40 * icons[i].length, 40)
      .noProfile()
      .write('./www/img/clanicons-' + i + '.min.png', function (err2) {
        if (err2) {
          console.log(err2);
        }
        if (icons[i + 1]) {
          combineimgs(i + 1)
        } else {
          dune()
        }
      })
    })
  }
  function dune() {
    console.log('dune');
    icons = []
    process.exit();
  }
}

// main function (old version)
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
    var multipleimgs = [];
    function createimg() {
      multipleimgs = imgs.chunk_inefficient(100);
      startmerge(0)
    }
    function startmerge(to) {
      var tomerge = multipleimgs[to];
      mergeImg(tomerge).then((img) => {
        img.write('./www/img/clanicons-' + to + '.png', () => {
          img = null
          if (multipleimgs[to + 1]) {
            startmerge(to + 1)
          } else {
            console.log('dune getting all clan icons');
            tomerge = null
            resizeimgs(0)
          }
        });
      });
    }
    function resizeimgs(open) {
      var dimensions = sizeOf('./www/img/clanicons-' + open + '.png');
      console.log(dimensions.width, dimensions.height);
      var listicons = dimensions.width / dimensions.height;
      gm('./www/img/clanicons-' + open + '.png')
      .resizeExact(40 * listicons, 40)
      .noProfile()
      .write('./www/img/clanicons-' + open + '.min.png', function (err) {
        if (multipleimgs[open + 1]) {
          resizeimgs(open + 1)
        } else {
          console.log('wrote all icons to file');
          imgs = []
          process.exit();
        }
      })
    }
    reqimg(0)
  })
}

mkimgV2()
// mkimg()
