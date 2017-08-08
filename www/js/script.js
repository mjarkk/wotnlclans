// config
var clandata = [];
var iconsloaded = false;
var config = {
  gm: '8',
  s: '8'
}
var procanjoin = true;
var prolenght = 0;
var proneedl = 0;
var sitetitlestring = 'WOT NL/BE Clans';
var widthchange = true;
var lastwidth = 1000;
var siteurl = document.location.pathname;
var PlacedVueData = false;
var popup = undefined;

// header element all user configurations are there
var header = new Vue({
  el: '.header',
  data: {
    clanwebsite: 'test',
    clanteamspeak: ''
  },
  methods: {
    status: function() {
      OpenStatusPopup();
    },
    focus: function(what) {
      var docel = document.getElementsByClassName(what)[0];
      docel.style.top = '-16px';
      docel.style.fontSize = '16px';
      docel.style.color = 'rgba(212, 0, 255, 1)';
    },
    blur: function(what) {
      var docel = document.getElementsByClassName(what)[0];
      if (document.getElementById(what.replace('-label','')).value == '') {
        docel.style.top = '14px';
        docel.style.fontSize = '19px';
        docel.style.color = 'rgba(212, 0, 255, 0.65)';
      }
    },
    check: function(what) {
      setTimeout(function () {
        if (document.getElementById(what.replace('-label','')) && document.getElementById(what.replace('-label','')).value.length > 0) {
          var docel = document.getElementsByClassName(what)[0];
          docel.style.top = '-16px';
          docel.style.fontSize = '16px';
          docel.style.color = 'rgba(212, 0, 255, 1)';
        }
      }, 1000);
    },
    save: function() {
      fetch("/submitclandata", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          clansite: this.clanwebsite,
          clanteamspeak: this.clanteamspeak
        })
      })
      .then( function functionName(response) {
         return response.json();
      }).then(function(JsonData) {
        console.log(JsonData);
      });
    }
  },
  created: function() {
    this.check('clanwebsite-label'),
    this.check('clanteamspeak-label')
  }
})

// function (s) for opening news / status popup
function OpenStatusPopup() {
  anime({
    targets: '.popup',
    top: '0vh',
    easing: 'easeOutCubic',
    duration: 750
  });
  popup = new Vue({
    el: '.popup-center',
    data: {
      html: '',
      open: false
    },
    methods: {
      outside: function(e) {
        if (this.open) {
          this.open = false;
          anime({
            targets: '.popup',
            top: '100vh',
            easing: 'easeOutCubic',
            duration: 750
          });
        }
      }
    },
    directives: {
      'click-outside': {
        bind: function(el, binding, vNode) {
          if (typeof binding.value !== 'function') {}
          var bubble = binding.modifiers.bubble
          var handler = function(e) {
            if (bubble || (!el.contains(e.target) && el !== e.target)) {
            	binding.value(e)
            }
          }
          el.__vueClickOutside__ = handler
          document.addEventListener('click', handler)
  			},
        unbind: function(el, binding) {
          document.removeEventListener('click', el.__vueClickOutside__)
          el.__vueClickOutside__ = null
        }
      }
    }
  });
  popup.html = '<div class="loading-animation">\
    <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
      <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>\
    </svg>\
  </div>';
  setTimeout(function () {
    popup.open = true;
    fetch('/news.html', {
      mode: 'cors',
      headers: {
        'Cache': 'no-cache'
      }
    })
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      popup.html = text;
    })
  }, 100);
}

// the progressbar function
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

// remove the progressbar
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

// reset progressbar
function progressbarreset() {
  prolenght = 0;
}

if (!siteurl.includes("/clan/")) {
  progressbar(10)
}

// site title bar
var sitetitle = new Vue({
  el: '.titlebar',
  data: {
    sitetitle: sitetitlestring,
    backicon: false
  },
  methods: {
    openstart: function() {
      spf.navigate('/');
      if (siteurl.includes("/clan/")) {
        mkclanlist()
      } else {
        // someting
      }
      sitetitle.sitetitle = 'WOT NL/BE Clans';
      sitetitle.backicon = false;
      anime({
        targets: '.clanstatspage',
        top: '100vh',
        easing: 'easeOutCubic',
        duration: 750
      });
    }
  }
})

// function for creating the clanlist
function mkclanlist() {
  clanslistvue = new Vue({
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
  getclanlist();
}

// check if the site is on the home page
if (siteurl.includes("/clan/")) {
  var clanpage = document.getElementsByClassName("clanstatspage")[0]
  clanpage.style.top = '0px'
  sitetitle.backicon = true
  fetch(siteurl.replace("/clan/","/clanname/"), {
    headers: {
      'Cache': 'no-cache'
    }
  }).then(function(response) {
      return response.text()
    }).then(function(body) {
      body = JSON.parse(body);
      // console.log(body);
      sitetitle.sitetitle = 'Clan ' + body.clan_tag;
      openclan(body.clan_id.toString())
    })
} else {
  mkclanlist();
}

// function for making the list bigger or smaller depending on the size of you'r screen
window.addEventListener("resize", function(event) {
  if (widthchange) {
    widthchange = false;
    setTimeout(function () {
      var nowwidth = document.body.clientWidth;
      clanslistvue.resize = nowwidth;
      widthchange = true;
      if (lastwidth < 415 && nowwidth > 415) {
        clanslistvue.items = clanslistvue.items;
        var listicons = document.getElementsByClassName("listicons")
        for (var i = 0; i < listicons.length; i++) {
          listicons[i].style.backgroundImage = '/clanicons.png'
        }
      }
      lastwidth = nowwidth;
    }, 300);
  }
})

// download and place all clanlist in screen
function getclanlist() {
  fetch('/clandata-firstload/', {
    mode: 'cors',
    headers: {
      'Cache': 'no-cache'
    }
  }).then(function(response) {
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
    fetch('/clandata-load2/', {
      mode: 'cors',
      headers: {
        'Cache': 'no-cache'
      }
    }).then(function(response2) {
      return response2.text();
    }).then(function(firstload2) {
      progressbar(50)
      MkVueData()
      firstload2 = JSON.parse(firstload2);
      for (var i = 0; i < firstload2.length; i++) {
        var j = firstload2[i];
        clandata[i] = Object.assign(clandata[i], firstload2[i]);
      }
      var listicons = document.getElementsByClassName("listicons")
      if (listicons.length > 0) {
        var objImage = new Image();
        objImage.src ='/clanicons.png';
        objImage.onload = function(e) {
          progressbar(100)
          setTimeout(function () {
            var animatiespeed = 20;
            function nexticon(i) {
              requestAnimationFrame(function(){
                var animateinspeed = 70;
                // timeout between next clan icon
                if (animatiespeed > 0) {
                  animatiespeed = animatiespeed - 0.5;
                }
                var thisitem = i;
                listicons[i].style.backgroundImage = 'url("' + objImage.src + '")';
                function animatethis(j) {
                  requestAnimationFrame(function() {
                    listicons[thisitem].style.opacity = j / animateinspeed;
                    if (j < animateinspeed) {
                      animatethis(j + 1)
                    }
                  })
                }
                animatethis(0)
                setTimeout(function () {
                  if (listicons[i + 1]) {
                    nexticon(i + 1)
                  } else {
                    iconsloaded = true;
                    // console.log('dune...');
                  }
                }, animatiespeed);
              })
            }
            nexticon(0)
          }, 20);
        }
      }
      // after everyting is dune create a webworker
      // createworker()

    }).catch(function(error) {
      console.log('Request failed ' + error)
    });
  }).catch(function(error) {
    console.log('Request failed ' + error)
  });
}

function createworker() {
  try {
    var myWorker = new Worker('/dyjs/worker.js');
  } catch (e) {
    // console.log('webworker not supported on this device');
    console.error(e);
  }
}

// when a user clicks on a clan
function openclan(clanid) {
  MkVueData()
  anime({
    targets: '.clanstatspage',
    top: '0vh',
    easing: 'easeOutCubic',
    duration: 750
  });
  fetch('/claninfo/now/' + clanid, {
    headers: {
      'Cache': 'no-cache'
    }
  }).then(function(response) {
      return response.text()
    }).then(function(body) {
      body = JSON.parse(body);
      // console.log(body);
      ClanDetailsClanData.image = body.emblems.x195.portal.replace('http','https');
      sitetitle.sitetitle = 'Clan ' + body.clan_tag;
      sitetitle.backicon = true;
      ClanDetailsClanData.clantag = '[' + body.clan_tag + ']';
      ClanDetailsClanData.wglink = 'http://eu.wargaming.net/clans/wot/' + body.clan_id;
      ClanDetailsClanData.color = body.color;
      ClanDetailsClanData.win = body.wins_ratio_avg.value;
      ClanDetailsClanData.eff = body.efficiency.value;
      ClanDetailsClanData.sh6 = body.fb_elo_rating_6.value;
      ClanDetailsClanData.sh8 = body.fb_elo_rating_8.value;
      ClanDetailsClanData.sh10 = body.fb_elo_rating_10.value;
      ClanDetailsClanData.gm6 = body.gm_elo_rating_6.value;
      ClanDetailsClanData.gm8 = body.gm_elo_rating_8.value;
      ClanDetailsClanData.gm10 = body.gm_elo_rating_10.value;
      ClanDetailsClanData.dis = body.description_html.replace(/'http'/g, 'https');
      ClanDetailsClanData.leden = body.members_count;
      ClanDetailsClanData.bgimage = 'background: -moz-linear-gradient(top, ' + body.color + ' 0%, rgba(238,238,238,0) 100%);\
      background: -webkit-linear-gradient(top, ' + body.color + ' 0%,rgba(238,238,238,0) 100%);\
      background: linear-gradient(to bottom, ' + body.color + ' 0%,rgba(238,238,238,0) 100%);\
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'' + body.color + '\', endColorstr=\#00eeeeee\',GradientType=0 );'
    })
}

// create vue data
// this is dune because vue will fail when you start on another page
function MkVueData() {
  if (!PlacedVueData) {
    PlacedVueData = true;
    fetch('/clan/true', {
      mode: 'cors',
      headers: {
        'Cache': 'no-cache'
      }
    }).then(function(rs) {
      return rs.text();
    }).then(function(vuedata) {
      if (siteurl.includes("/clan/")) {
        var clanstatsvue = new Vue({
          el: '.clanstatspage',
          data: ClanDetailsClanData,
        })
      } else {
        Vue.component('clanstatspagecomp', {
          template: vuedata,
          data: function () {
            return ClanDetailsClanData
          }
        });
        var clanstatsvue = new Vue({
          el: '.clanstatspage'
        })
      }
    });
  }
}

// all clan details data
var ClanDetailsClanData = {
  'image': '',
  'bgimage': '',
  'clantag': '',
  'wglink': '',
  'ts': 'sdf',
  'site': 'sdf',
  'color': '',
  'win': 0,
  'eff': 0,
  'sh6': 0,
  'sh8': 0,
  'sh10': 0,
  'gm6': 0,
  'gm8': 0,
  'gm10': 0,
  'dis': '',
  'leden': 0
}

// Start the spf script
spf.init();
