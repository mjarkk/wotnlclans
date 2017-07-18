spf.init();

var clandata = [];
var HomeArr = [];

var sitetitle = 'WOT NL/BE Clans'
var sitetitle = new Vue({
  el: '.titlebar',
  data: {
    sitetitle: sitetitle
  }
})

for (var i = 0; i < 20; i++) {
  clandata.push({
    id: 1,
    tag: '[' + 'idsfs' + ']',
    win: '49.44%',
    rate: 8350
  })
}

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
}

// make home array
MkArrHome()

var clanslist = new Vue({
  el: '.clanslist',
  data: {
    items: HomeArr
  }
})
