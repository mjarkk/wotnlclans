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

// main function
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
      shell.exec(config.FfmpegPath + ' -y -i ./www/img/clanicons-' + open + '.png -vf scale=h=40:w=' + 40*listicons + ' ./www/img/clanicons-' + open + '.min.png', {silent:true,async:true}).code
      if (multipleimgs[open + 1]) {
        resizeimgs(open + 1)
      } else {
        console.log('wrote all icons to file');
        imgs = []
        process.exit();
      }
    }
    reqimg(0)
  })
}
mkimg()
