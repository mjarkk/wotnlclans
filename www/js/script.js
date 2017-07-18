var clandata = [];
var HomeArr = [];

var config = {
  gm: 8,
  s: 8
}

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
    if (clandata[i].s) {
      var s = clandata[i].s[config.s];
    } else {
      var s = undefined;
    }
    if (clandata[i].gm) {
      var gm = clandata[i].gm[config.gm];
    } else {
      var s = undefined;
    }
    HomeArr.push({
      id: clandata[i].id,
      tag: clandata[i].tag,
      win: clandata[i].win,
      rate: clandata[i].rate,
      leden: clandata[i].leden,
      s: s,
      gm: gm
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
  MkArrHome();
  fetch('/clandata-load2/', {mode: 'cors'}).then(function(response2) {
    return response2.text();
  }).then(function(firstload2) {
    firstload2 = JSON.parse(firstload2)
    for (var i = 0; i < firstload2.length; i++) {
      var j = firstload2[i];
      clandata[i] = Object.assign(clandata[i], firstload2[i]);
    }
    MkArrHome();
  }).catch(function(error) {
    console.log('Request failed' + error)
  });
}).catch(function(error) {
  console.log('Request failed' + error)
});

spf.init();
