var clandata = [];

var config = {
  gm: '8',
  s: '8'
}

var procanjoin = true;
var prolenght = 0;
var proneedl = 0;
function progressbar(g) {
  var bar = document.getElementsByClassName("progress")[0];
  function animatebar(le) {
    procanjoin = false;
    requestAnimationFrame(function() {
      var now = prolenght + (le * (proneedl - prolenght));
      bar.style.width = now + '%';
      if (le < 0.9) {
        animatebar(le + 0.1)
      } else {
        prolenght = Number(bar.style.width.replace('%',''));
        procanjoin = true;
        if (prolenght > 98) {
          removeprogressbar(0)
        }
      }
    })
  }
  proneedl = g;
  if (procanjoin) {
    animatebar(0)
  }
}
function removeprogressbar(i) {
  setTimeout(function () {
    var bar = document.getElementsByClassName("loadingbar")[0];
    requestAnimationFrame(function() {
      bar.style.top = '-' + (i / 1) + 'px'
      if (i < 4) {
        removeprogressbar(i + 1)
      }
    })
  }, 100);
}
function progressbarreset() {
  prolenght = 0;
}
progressbar(10)

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
    'resize': document.body.clientWidth,
    'items': clandata
  },
  methods: {
    open: function(url) {
      spf.navigate('/clan/' + url);
      openclan(url)
    }
  }
})

var widthchange = true;
window.addEventListener("resize", function(event) {
  if (widthchange) {
    widthchange = false;
    setTimeout(function () {
      clanslist.resize = document.body.clientWidth;
      widthchange = true;
    }, 300);
  }
})

fetch('/clandata-firstload/', {mode: 'cors'}).then(function(response) {
  return response.text();
}).then(function(firstload) {
  progressbar(30)
  firstload = JSON.parse(firstload)
  var pos = 0;
  for (var i = 0; i < firstload.length; i++) {
    var j = firstload[i];
    clandata.push({
      id: j.i,
      tag: '[' + j.t + ']',
      win: j.w + '%',
      rate: j.e,
      gm: {
        "6": undefined,
        "8": undefined,
        "10": undefined,
        'normal': undefined
      },
      s: {
        "6": undefined,
        "8": undefined,
        "10": undefined,
        'normal': undefined
      },
      pos: '-' + pos + 'px 0px',
      fun: function (i) {return (config[i])}
    })
    pos += 40;
  }
  fetch('/clandata-load2/', {mode: 'cors'}).then(function(response2) {
    return response2.text();
  }).then(function(firstload2) {
    progressbar(50)
    firstload2 = JSON.parse(firstload2)
    for (var i = 0; i < firstload2.length; i++) {
      var j = firstload2[i];
      clandata[i] = Object.assign(clandata[i], firstload2[i]);
    }
    clanslist.items = clandata;
    var listicons = document.getElementsByClassName("listicons")
    var objImage = new Image();
    objImage.src ='/clanicons.png';
    objImage.onload = function(e){
      progressbar(100)
      setTimeout(function () {
        // console.log(listicons);
        function nexticon(i) {
          requestAnimationFrame(function(){
            var thisitem = i;
            listicons[i].style.backgroundImage = 'url("' + objImage.src + '")';
            function animatethis(j) {
              requestAnimationFrame(function() {
                listicons[thisitem].style.opacity = j / 70;
                if (j <= 69) {
                  animatethis(j + 1)
                }
              })
            }
            animatethis(0)
            setTimeout(function () {
              if (listicons[i + 1]) {
                nexticon(i + 1)
              } else {
                console.log('dune...');
              }
            }, 20);
          })
        }
        nexticon(0)
      }, 20);
    }

    // after everyting is dune create a webworker
    // createworker()


  }).catch(function(error) {
    console.log('Request failed' + error)
  });
}).catch(function(error) {
  console.log('Request failed' + error)
});

function createworker() {
  try {
    var myWorker = new Worker('/dyjs/worker.js');
  } catch (e) {
    console.log('webworker not supported on this device');
    console.error(e);
  }
}

spf.init();

function openclan(clanid) {
  fetch('/claninfo/now/' + clanid)
  .then(function(response) {
    return response.text()
  }).then(function(body) {
    body = JSON.parse(body);
    console.log(body);
  })
}

Vue.component('clanstatspage', {
  template: '<h1>test</h1>'
})

var clanstatspage = new Vue({
  el: '.clanstatspage',
  data: {},
  methods: {}
})
