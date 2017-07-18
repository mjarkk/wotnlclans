var clandata = [];
var HomeArr = [];

var sitetitle = 'WOT NL/BE Clans';

var sitetitle = new Vue({
  el: '.titlebar',
  data: {
    sitetitle: sitetitle
  }
})

var clanslist = new Vue({
  el: '.clanslist',
  data: {
    items: HomeArr
  }
})

function MkArrHome() {
  HomeArr = [];
  for (var i = 0; i < clandata.length; i++) {
    HomeArr.push({
      id: clandata[i].id,
      tag: clandata[i].tag,
      win: clandata[i].win,
      rate: clandata[i].rate
    })
  }
  clanslist.items = HomeArr;
}

fetch('/clandata-firstload/', {mode: 'cors'}).then(function(response) {
  return response.text();
}).then(function(firstload) {
  firstload = JSON.parse(firstload)
  for (var i = 0; i < firstload.length; i++) {
    var j = firstload[i];
    clandata.push({
      id: j.i,
      tag: '[' + j.t + ']',
      win: j.w + '%',
      rate: j.e
    })
  }
  MkArrHome()
}).catch(function(error) {
  console.log('Request failed' + error)
});

spf.init();
