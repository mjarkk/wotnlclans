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

// all clan details data
var ClanDetailsClanData = {
  'login': document.cookie.indexOf('logedin=true') !== -1,
  'reviewcomplete': true,
  'thanksforsubmit': '',
  'image': '',
  'bgimage': '',
  'clantag': '',
  'wglink': '',
  'ts': 'sdf',
  'site': 'sdf',
  'color': '',
  'win': 1,
  'eff': 1,
  'sh6': 1,
  'sh8': 1,
  'sh10': 1,
  'gm6': 1,
  'gm8': 1,
  'gm10': 1,
  'dis': '',
  'leden': 1,
  'clan_id': 1,
  'CanReportClans': false,
  'ClansReported': {}
}

window.addEventListener('popstate', function (event) {
  if (!event.state.urlPath || event.state.urlPath == '/') {
    backhome();
  }
});

// header element all user configurations are there
var header = new Vue({
  el: '.header',
  data: {
    clanwebsite: '',
    clanteamspeak: '',
    caneddit: true,
    SaveStatus: '',
    Sorting: 'rate',
    SettingsGM: '8',
    SettingsS: '8'
  },
  methods: {
    SetGM: function(setto) {
      config.gm = setto;
      this.SettingsGM = setto;
      for (var i = 0; i < clanslistvue.items.length; i++) {
        clanslistvue.items[i].fun = function (i) {return (config[i])};
      }
      if (this.Sorting == 'gm') {
        clanslistvue.sortby('gm' + setto);
      }
    },
    SetS: function(setto) {
      config.s = setto;
      this.SettingsS = setto;
      for (var i = 0; i < clanslistvue.items.length; i++) {
        clanslistvue.items[i].fun = function (i) {return (config[i])};
      }
      if (this.Sorting == 's') {
        clanslistvue.sortby('s' + setto);
      }
    },
    SortClans: function(what) {
      if (what == 'gm' || what == 's') {
        clanslistvue.sortby(what + this['Settings' + what.toUpperCase()]);
      } else {
        clanslistvue.sortby(what);
      }
      this.Sorting = what;
    },
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
      header.caneddit = true;
      header.SaveStatus = 'opslaan...';
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
        // console.log(JsonData);
        if (JsonData.status) {
          header.SaveStatus = 'opgelagen';
          setTimeout(function () {
            header.SaveStatus = '';
          }, 1000);
        } else {
          header.SaveStatus = 'Data ongeldig';
          setTimeout(function () {
            header.SaveStatus = '';
          }, 2000);
        }
        header.caneddit = false;

      });
    }
  },
  created: function() {
    if (document.cookie.indexOf('logedin=true') !== -1) {
      this.check('clanwebsite-label');
      this.check('clanteamspeak-label');
      fetch("/rules", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache'
        },
        credentials: 'same-origin'
      })
      .then( function functionName(response) {
         return response.json();
      }).then(function(JsonData) {
        if (JsonData.status && JsonData.clan && JsonData.edditclandata) {
          header.caneddit = false;
          header.clanwebsite = JsonData.claninfo.clansite
          header.clanteamspeak = JsonData.claninfo.clanteamspeak
        }
        if (JsonData.reports) {
          var re = JsonData.reports;
          if (!re.block) {
            ClanDetailsClanData.CanReportClans = true;
          }
          if (re.reportclans) {
            for (var i = 0; i < re.reportclans.length; i++) {
              ClanDetailsClanData.ClansReported[re.reportclans[i].clanid] = true;
            }
          }
        }
      });
    }
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
  console.log(g);
  anime({
    targets: '.loadingbar .progress',
    width: g + '%',
    duration: 300
  });
  if (g == 100) {
    anime({
      targets: '.loadingbar',
      top: '-6px',
      delay: 300,
      duration: 100
    })
  }
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
      backhome()
    }
  }
})

// go back to: /
function backhome() {
  if (history.pushState) {
    window.history.pushState({urlPath:'/'},"",'/');
  } else {
    document.location.href = '/';
  }
  document.title = 'Wot NL/BE clans';
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
        if (history.pushState) {
          window.history.pushState({urlPath:'/clan/' + url}, "", '/clan/' + url);
        } else {
          document.location.href = '/clan/' + url;
        }
        // console.log(url);
        openclan(url)
      },
      sortby: function(what) {
        if (this.items[0][what]) {
          this.items = _.sortBy(this.items, what).reverse();
        } else {
          console.log('can\'t find that key in json');
          console.log(this.items[0]);
        }
      }
    }
  })
  ResizeEvent();
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
      document.title = body.clan_tag + ' | Wot NL/BE clans';
      openclan(body.clan_id.toString())
    })
} else {
  mkclanlist();
}

// function for making the list bigger or smaller depending on the size of you'r screen
function ResizeEvent() {
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
}

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
        leden: undefined,
        "gm6": undefined,
        "gm8": undefined,
        "gm10": undefined,
        'gmnormal': undefined,
        gm: {
          "6": undefined,
          "8": undefined,
          "10": undefined,
          'normal': undefined
        },
        "s6": undefined,
        "s8": undefined,
        "s10": undefined,
        'snormal': undefined,
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
        clandata[i].gm6 = clandata[i].gm['6'];
        clandata[i].gm8 = clandata[i].gm['8'];
        clandata[i].gm10 = clandata[i].gm['10'];
        clandata[i].s6 = clandata[i].s['6'];
        clandata[i].s8 = clandata[i].s['8'];
        clandata[i].s10 = clandata[i].s['10'];
        clandata[i].snormal = clandata[i].s['normal'];
        clandata[i].gmnormal = clandata[i].gm['normal'];
      }

      // TODO: fix small screen not all data
      // clanslistvue.items = clandata;

      var listicons = document.getElementsByClassName("listicons")
      if (listicons.length > 0) {
        addclanicons()
      } else {
        progressbar(100)
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

// load clan icons
function addclanicons() {
  var listicons = document.getElementsByClassName("listicons")
  var objImage = new Image();
  objImage.src ='/clanicons.png';
  objImage.onload = function(e) {
    progressbar(100)
    for (var i = 0; i < listicons.length; i++) {
      listicons[i].style.backgroundImage = 'url("' + objImage.src + '")';
      listicons[i].style.opacity = 0;
    }
    function animetethis(l) {
      requestAnimationFrame(function(){
        l = Math.round(l * 100) / 100;
        for (var i = 0; i < listicons.length; i++) {
          listicons[i].style.opacity = l;
        }
        if (l + (0.01 * (l / 0.01)) < 1) {
          animetethis(l + (0.01 * (l / 0.01)))
        } else if (l !== 1) {
          animetethis(1)
        } else {
          console.log('dune loading icons');
          iconsloaded = true;
        }
      });
    }
    animetethis(0.01)
  }
}

// create webworker (this is for later use)
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
      document.title = body.clan_tag + ' | Wot NL/BE clans';
      ClanDetailsClanData.image = body.emblems.x195.portal.replace('http','https');
      sitetitle.sitetitle = 'Clan ' + body.clan_tag;
      sitetitle.backicon = true;
      ClanDetailsClanData.clantag = '[' + body.clan_tag + ']';
      ClanDetailsClanData.wglink = 'http://eu.wargaming.net/clans/wot/' + body.clan_id;
      ClanDetailsClanData.clan_id = body.clan_id;
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
      ClanDetailsClanData.ts = body.clanteamspeak || '';
      ClanDetailsClanData.site = body.clansite || '';
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
      var ClanDetailsMethods = {
        review: function(data) {
          this.reviewcomplete = false;
          this.thanksforsubmit = 'Bedankt voor het beoordelen van deze clan';
          setTimeout(function () {
            ClanDetailsClanData.ClansReported[ClanDetailsClanData.clan_id] = true;
          }, 3000);
          fetch("/reportclan", {
            method: "post",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cache': 'no-cache'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              report: data,
              clan: this.clan_id
            })
          })
          .then( function functionName(response) {
             return response.json();
          }).then(function(JsonData) {
            console.log(JsonData);
          });
        }
      }
      if (siteurl.includes("/clan/")) {
        var clanstatsvue = new Vue({
          el: '.clanstatspage',
          data: ClanDetailsClanData,
          methods: ClanDetailsMethods
        })
      } else {
        Vue.component('clanstatspagecomp', {
          template: vuedata,
          data: function () {
            return ClanDetailsClanData
          },
          methods: ClanDetailsMethods
        });
        var clanstatsvue = new Vue({
          el: '.clanstatspage'
        })
      }
    });
  }
}
