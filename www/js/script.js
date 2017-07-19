var clandata = [];

var config = {
  gm: '8',
  s: '8'
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
    'resize': document.body.clientWidth,
    'items': clandata
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
