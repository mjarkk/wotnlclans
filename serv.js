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
