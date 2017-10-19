// a opject function for making chunks
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

// A function for fetching data from the network,
// I have made a function for this because after it fetches the url it will be stored in the offline storage
// If the browser is offline i can directly fallback on a result stored in the cache
function newfetch(url, method, TextOrJson, callback) {
  var dburl = url.replace(/\//g, '');
  // console.log(url);
  function offline() {
    var data = Lockr.get(dburl);
    var typeoffdata = Lockr.get('TypeOf-' + dburl);
    if (!data) {
      if (typeoffdata == 'json') {
        data = {}
      } else {
        data = ''
      }
    }
    if (typeoffdata == 'json') {
      if (typeof(data) == 'object') {
        callback(data)
      } else {
        callback(JSON.parse(data))
      }
    } else {
      if (typeof(data) == 'object') {
        callback(JSON.stringify(data))
      } else {
        callback(data)
      }
    }
  }
  function online() {
    fetch(url, method).then(function(response) {
      if (!response.ok) {
        // a fallback if the browser not supports navigator.onLine
        offline()
      } else {
        if (TextOrJson == 'json') {
          return response.json();
        } else {
          return response.text();
        }
      }
    }).then(function(returndata) {
      Lockr.set(dburl, returndata)
      Lockr.set('TypeOf-' + dburl, TextOrJson)
      callback(returndata)
    }).catch(function(err) {
      // if the browser is online but doesn't have internet
      // the fetch function will automaticly fail so for thouse cases it will fallback on offline()
      console.log('fetch failed, trying to fallback on offline stored data');
      offline()
    });
  }
  // check if browser supports navigator.onLine and is offline
  if (navigator && typeof(navigator.onLine) == "boolean"  && navigator.onLine == false) {
    offline()
  } else {
    online()
  }
}

// The vue data for "ClanMediaComponent"
var ClanMediaComponentData = {
  opened: false,
  remworking: false,
  removepopupurl: '',
  removeitem: '',
  bigpreview: '',
  bigimage: '',
  bigshow: false,
  bigclan: {},
  removepopupopen: false,
  list: [],
  yourclan: {
    imgs: []
  },
  login: {
    status: false,
    clan: false,
    edditclandata: false,
    clandata: {
      clanid: '',
      clantag: '',
      smallimg: '',
      img: ''
    }
  }
}

var imageviewer = new Vue({
  el: '.imageviewer',
  data: ClanMediaComponentData
});

// config
var clandata = [];
var iconsloaded = false;
var config = {
  gm: '8',
  s: '8'
}
var procanjoin = true;
var proneedl = 0;
var sitetitlestring = 'WOT NL/BE Clans';
var widthchange = true;
var lastwidth = 1000;
var siteurl = document.location.pathname;
var PlacedVueData = false;
var popup = undefined;

// uglifyed https://github.com/tsironis/lockr (this javascript framework makes it easy to store things inside the offline storage)
!function(e,t){"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports&&(exports=module.exports=t(e,exports)):"function"==typeof define&&define.amd?define(["exports"],function(r){e.Lockr=t(e,r)}):e.Lockr=t(e,{})}(this,function(e,t){"use strict";return Array.prototype.indexOf||(Array.prototype.indexOf=function(e){var t=this.length>>>0,r=Number(arguments[1])||0;for((r=r<0?Math.ceil(r):Math.floor(r))<0&&(r+=t);r<t;r++)if(r in this&&this[r]===e)return r;return-1}),t.prefix="",t._getPrefixedKey=function(e,t){return(t=t||{}).noPrefix?e:this.prefix+e},t.set=function(e,t,r){var o=this._getPrefixedKey(e,r);try{localStorage.setItem(o,JSON.stringify({data:t}))}catch(r){console&&console.warn("Lockr didn't successfully save the '{"+e+": "+t+"}' pair, because the localStorage is full.")}},t.get=function(e,t,r){var o,n=this._getPrefixedKey(e,r);try{o=JSON.parse(localStorage.getItem(n))}catch(e){o=localStorage[n]?{data:localStorage.getItem(n)}:null}return null===o?t:"object"==typeof o&&void 0!==o.data?o.data:t},t.sadd=function(e,r,o){var n,a=this._getPrefixedKey(e,o),i=t.smembers(e);if(i.indexOf(r)>-1)return null;try{i.push(r),n=JSON.stringify({data:i}),localStorage.setItem(a,n)}catch(t){console.log(t),console&&console.warn("Lockr didn't successfully add the "+r+" to "+e+" set, because the localStorage is full.")}},t.smembers=function(e,t){var r,o=this._getPrefixedKey(e,t);try{r=JSON.parse(localStorage.getItem(o))}catch(e){r=null}return null===r?[]:r.data||[]},t.sismember=function(e,r,o){return t.smembers(e).indexOf(r)>-1},t.keys=function(){var e=[],r=Object.keys(localStorage);return 0===t.prefix.length?r:(r.forEach(function(r){-1!==r.indexOf(t.prefix)&&e.push(r.replace(t.prefix,""))}),e)},t.getAll=function(e){var r=t.keys();return e?r.reduce(function(e,r){var o={};return o[r]=t.get(r),e.push(o),e},[]):r.map(function(e){return t.get(e)})},t.srem=function(e,r,o){var n,a,i=this._getPrefixedKey(e,o),c=t.smembers(e,r);(a=c.indexOf(r))>-1&&c.splice(a,1),n=JSON.stringify({data:c});try{localStorage.setItem(i,n)}catch(t){console&&console.warn("Lockr couldn't remove the "+r+" from the set "+e)}},t.rm=function(e){var t=this._getPrefixedKey(e);localStorage.removeItem(t)},t.flush=function(){t.prefix.length?t.keys().forEach(function(e){localStorage.removeItem(t._getPrefixedKey(e))}):localStorage.clear()},t});

// vue componenet(s)
Vue.component('loadingimg', {
  template: "<div class='imageloader'>\
    <transition name=\"fadesmall\">\
      <img class='small' v-bind:style='css' v-bind:src=\"SmallSrc\" v-if='SmallImgLoaded == 1'/>\
    </transition>\
    <transition name=\"fadebig\">\
      <img class='fullimg' v-bind:src=\"FullSrc\" v-if='FullImgLoaded == 1'/>\
    </transition>\
  </div>",
  data: function() {
    return {
      FullImgLoaded: 0,
      FullSrc: '',
      SmallImgLoaded: 0,
      SmallSrc: '',
      css: {
        '-webkit-filter': 'blur(7px)',
        '-moz-filter': 'blur(7px)',
        '-o-filter': 'blur(7px)',
        '-ms-filter': 'blur(7px)',
        'filter': 'blur(7px)'
      }
    };
  },
  props: ['preview','image','base64','blur'],
  watch: {
    image: function(newVal, oldVal) {
      if (newVal.startsWith('http://') && location.protocol == "https:") {
        newVal = newVal.replace('http://', 'https://')
      }
      this.FullImgLoaded = 0;
      this.LoadBig();
    },
    preview: function(newVal, oldVal) {
      if (newVal && newVal != '') {
        if (newVal.startsWith('http://') && location.protocol == "https:") {
          newVal = newVal.replace('http://', 'https://')
        }
        this.SmallImgLoaded = 0;
        this.LoadSmall(newVal);
      }
    },
    base64: function(newVal, oldVal) {
      if (newVal && newVal != '') {
        this.SmallImgLoaded = 0;
        this.LoadSmall(newVal);
      }
    }
  },
  methods: {
    load: function() {
      this.FullImgLoaded = 0;
      this.SmallImgLoaded = 0;
      if (this.image == undefined || this.image == '') {
        // console.info('no image defined')
      } else {
        if (this.blur) {
          var list = ['-webkit-filter','-moz-filter','-o-filter','-ms-filter','filter']
          for (var i = 0; i < list.length; i++) {
            this.css[list[i]] = 'blur(' + this.blur + 'px)';
          }
        }
        if (this.preview != undefined) {
          this.LoadSmall(this.preview);
        } else if (this.base64 != undefined) {
          this.LoadSmall(this.base64);
        } else {
          this.LoadBig()
        }
      }
    },
    LoadBig: function() {
      var thisvue = this;
      var img = new Image();
      if (thisvue.image.startsWith('http://') && location.protocol == "https:") {
        img.src = thisvue.image.replace('http://', 'https://');
      } else {
        img.src = thisvue.image;
      }
      img.onload = function() {
        thisvue.FullSrc = img.src;
        thisvue.FullImgLoaded = 1;
      }
    },
    LoadSmall: function(src) {
      var thisvue = this;
      var img = new Image();
      if (src.startsWith('http://') && location.protocol == "https:") {
        img.src = src.replace('http://', 'https://');
      } else {
        img.src = src;
      }
      img.onload = function() {
        thisvue.SmallSrc = img.src;
        thisvue.SmallImgLoaded = 1;
        thisvue.LoadBig();
      }
    }
  },
  created: function () {
    this.load()
  }
});

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
  'ClansReported': {},
  'smallimage': '',
  'Clanmedia': {},
  'showoffline': false
}

// the event lissener for the back button
window.addEventListener('popstate', function (event) {
  if (!event.state.urlPath || event.state.urlPath == '/') {
    backhome();
  }
});

// header element all user configurations are there
var header = new Vue({
  el: '.header',
  data: {
    nothidden: Lockr.get('settingsopen') || false,
    clanwebsite: '',
    clanteamspeak: '',
    caneddit: true,
    SaveStatus: '',
    Sorting: 'rate',
    SettingsGM: '8',
    SettingsS: '8',
    search: '',
    displaystats: true,
    MediaIsLoaded: false
  },
  watch: {
    search: function(NewVal, OldVal) {
      clanslistvue.search = NewVal;
    },
    displaystats: function(NewVal) {
      if (NewVal) {
        ClanMediaComponentData.opened = false;
        clanslistvue.show = true;
      } else {
        ClanMediaComponentData.opened = true;
        clanslistvue.show = false;
      }
    }
  },
  methods: {
    ViewSettings: function(on) {
      this.nothidden = !this.nothidden;
      Lockr.set('settingsopen', !on)
      if (!on) {
        this.check();
      }
    },
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
      function runcheck(what) {
        setTimeout(function () {
          if (document.getElementById(what.replace('-label','')) && document.getElementById(what.replace('-label','')).value.length > 0) {
            var docel = document.getElementsByClassName(what)[0];
            docel.style.top = '-16px';
            docel.style.fontSize = '16px';
            docel.style.color = 'rgba(212, 0, 255, 1)';
          }
        }, 700);
      }
      if (!what) {
        runcheck('clanwebsite-label');
        runcheck('clanteamspeak-label');
        runcheck('search-label');
      } else {
        runcheck(what);
      }
    },
    save: function() {
      header.caneddit = true;
      header.SaveStatus = 'opslaan...';
      newfetch("/submitclandata",{
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
      },'json',function(JsonData) {
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
      this.check();
      newfetch("/rules",{
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache'
        },
        credentials: 'same-origin'
      },'json',function(JsonData) {
        ClanMediaComponentData.login = JsonData;
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
    newfetch('/news.html', {
      mode: 'cors'
    }, 'text', function(text) {
      popup.html = text;
    })
  }, 100);
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
    translateY: '120vh',
    easing: 'easeOutCubic',
    duration: 750
  });
  setTimeout(function () {
    var el = document.getElementsByClassName("clanstatspage")[0];
    el.style.display = "none"
  }, 800);
}

// function for creating the clanlist
function mkclanlist() {
  clanslistvue = new Vue({
    el: '.clanslist',
    data: {
      'checkedwebp': undefined,
      'resize': document.body.clientWidth,
      'items': clandata,
      'search': '',
      'img': [],
      'show': true,
      'ShowAds': false,
      'ads': [{
        href: 'https://www.worldoftanksinfo.be/',
        src: '/img/promo/woti.png',
        webp: '/img/promo/woti.webp'
      }]
    },
    methods: {
      open: function(url) {
        if (history.pushState) {
          window.history.pushState({urlPath:'/clan/' + url}, "", '/clan/' + url);
        } else {
          document.location.href = '/clan/' + url;
        }
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
  anime({
    targets: '.clanstatspage',
    translateY: '0vh',
    duration: 1
  });
  sitetitle.backicon = true
  newfetch(siteurl.replace("/clan/","/clanname/"), {}, 'text', function(body) {
    body = JSON.parse(body);
    // console.log(body);
    sitetitle.sitetitle = 'Clan ' + body.clan_tag;
    document.title = body.clan_tag + ' | Wot NL/BE clans';
    openclan(body.clan_id.toString(),true)
  })
} else {
  var el = document.getElementsByClassName("clanstatspage")[0];
  el.style.display = "none"
  anime({
    targets: '.clanstatspage',
    translateY: '120vh',
    easing: 'linear',
    duration: 0
  });
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
  newfetch('/clandata-firstload/', {
    mode: 'cors',
    headers: {
      'Cache': 'no-cache'
    }
  }, 'text', function(firstload) {
    firstload = JSON.parse(firstload)
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
        imgid: Math.floor(i / 100),
        pos: '-' + ((i - (Math.floor(i / 100) * 100)) * 40) + 'px 0px',
        fun: function (i) {return (config[i])}
      })
    }
    newfetch('/clandata-load2/', {
      mode: 'cors',
      headers: {
        'Cache': 'no-cache'
      }
    }, 'text', function(firstload2) {
      // MkVueData is a function for loading the elements for the clan detials
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
      var listicons = document.getElementsByClassName("listicons")
      addclanicons()

      // after everyting is dune create a webworker
      // createworker()

    });
  });
}

// load clan icons
function addclanicons() {
  LoadClanMediaSection()
  setTimeout(function () {
    var listiconsselect = document.getElementsByClassName("listicons")
    var listiconsall = []
    for (var i = 0; i < listiconsselect.length; i++) {
      listiconsall.push(listiconsselect[i])
    }
    var chunkicons = listiconsall.chunk_inefficient(100)
    clanslistvue.ShowAds = true
    function loadchunk(i) {
      try {
        var listicons = chunkicons[i];
        var objImage = new Image();
        objImage.src ='/img/clanicons-' + i + '.min.png';
        objImage.onload = function(e) {
          if (listicons == undefined) {
            if (chunkicons[i + 1]) {
              loadchunk(i + 1)
            }
            return false
          }
          clanslistvue.img.push('url("' + objImage.src + '")')
          for (var j = 0; j < listicons.length; j++) {
            listicons[j].style.opacity = 0;
            listicons[j].style.backgroundPosition = '-' + (j*40) + 'px 0px';
            listicons[j].style.backgroundImage = 'url("' + objImage.src + '")';
          }
          if (chunkicons[i + 1]) {
            loadchunk(i + 1)
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
                iconsloaded = true;
              }
            });
          }
          if (listicons.length > 0) {
            animetethis(0.01)
          }
        }
      } catch (e) {
        if (chunkicons[i + 1]) {
          loadchunk(i + 1)
        }
      }
    }
    loadchunk(0)
  }, 50);
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
function openclan(clanid, firstload) {
  var clanid = clanid;
  MkVueData()
  var el = document.getElementsByClassName("clanstatspage")[0];
  anime({
    targets: '.clanstatspage',
    translateY: '120vh',
    duration: 1
  });
  el.style.display = "inline-block"
  setTimeout(function () {
    window.requestAnimationFrame(function() {
      if (!firstload) {
        anime({
          targets: '.clanstatspage',
          translateY: '0vh',
          easing: 'easeOutCubic',
          duration: 750
        });
      } else {
        anime({
          targets: '.clanstatspage',
          translateY: '0vh',
          duration: 1
        });
        setTimeout(function () {
          if (sitetitle.backicon) {
            anime({
              targets: '.clanstatspage',
              translateY: '0vh',
              duration: 1
            });
          }
        }, 10);
      }
    });
  }, 2);
  newfetch('/claninfo/now/' + clanid, {
    headers: {
      'Cache': 'no-cache'
    }
  }, 'text', function(body) {
    if (typeof(body) == 'string' && body != '') {
      body = JSON.parse(body);
    }
    sitetitle.backicon = true;
    if (body != '') {
      var offline = (body.clan_id.toString() == clanid.toString());
      ClanDetailsClanData.showoffline = !offline;
      document.title = body.clan_tag + ' | Wot NL/BE clans';
      ClanDetailsClanData.smallimage = body.emblems.x32.portal.replace('http','https');
      ClanDetailsClanData.image = body.emblems.x195.portal.replace('http','https');
      sitetitle.sitetitle = 'Clan ' + body.clan_tag;
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
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'' + body.color + '\', endColorstr=\#00eeeeee\',GradientType=0 );';
      if (offline) {
        newfetch("/clanmedia/" + clanid, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
          },
          credentials: 'same-origin'
        }, 'json', function(JsonData) {
          ClanDetailsClanData.Clanmedia = JsonData;
        });
      }
    } else {
      ClanDetailsClanData.showoffline = true;
      clandata.forEach(function(i){
        if (i.id.toString() == clanid.toString()) {
          console.log(i);
          document.title = i.clan_tag.replace('[','').replace(']','') + ' | Wot NL/BE clans';
          sitetitle.sitetitle = 'Clan ' + i.clan_tag.replace('[','').replace(']','');
          ClanDetailsClanData.clantag = i.clan_tag;
        }
      })
    }
  })
}

// the media tab
function LoadClanMediaSection() {
  newfetch('/mediatemplate', {
    mode: 'cors',
    headers: {
      'Cache': 'no-cache'
    }
  }, 'text', function(mediatemplate) {
    loadintocache()
    var linkel = document.createElement('link');
    linkel.rel = 'stylesheet';
    linkel.media = "none";
    linkel.id = "notblockinglink";
    linkel.href = '/css/media.css';
    document.head.appendChild(linkel);
    document.getElementById(linkel.id).onload = function() { if (document.getElementById(linkel.id).media!='all') document.getElementById(linkel.id).media='all' };
    header.MediaIsLoaded = true;
    Vue.component('clanmedia', {
      template: mediatemplate,
      data: function () {
        return ClanMediaComponentData
      },
      methods: {
        open: function(id,what) {
          this.list[id].open = what;
        },
        OpenBigPicture: function(item, imageid) {
          var img = item.imgs[imageid];
          var vm = this;
          vm.bigclan = item;
          vm.bigimage = imageid;
          vm.bigpreview = imageid;
          vm.bigshow = true;
        },
        UpdateClanMedia: function() {
          this.create();
        },
        RemoveMedia: function(id, url) {
          this.removeitem = id;
          this.removepopupurl = url;
          this.removepopupopen = true;
        },
        removepopupconfirm: function() {
          var vm = this;
          vm.remworking = true;
          newfetch("/removemedia", {
            method: "post",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cache': 'no-cache'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              filename: vm.removeitem
            })
          }, 'json', function(JsonData) {
            vm.remworking = false;
            vm.removepopupopen = false;
            setTimeout(function () {
              vm.UpdateClanMedia()
            }, 750);
          });
        },
        create: function() {
          var vm = this;
          newfetch("/clanmedia", {}, 'json', function(med) {
            if (med.status) {
              vm.list = []
              for (var i = 0; i < med.content.length; i++) {
                try {
                  if (vm.login && vm.login.clandata && vm.login.clandata.clanid.toString() == med.content[i].id) {
                    vm.yourclan = _(med.content[i]).clone();
                  }
                } catch(e) {}
                med.content[i]['open'] = false;
                vm.list.push(med.content[i]);
              }
            }
          });
        }
      },
      created: function() {
        this.create();
      }
    });
    new Vue({
      el: '.clanmedia'
    });
  });
}

// create vue data
// this is dune because vue will fail when you start on another page
function MkVueData() {
  if (!PlacedVueData) {
    PlacedVueData = true;
    newfetch('/clan/true', {
      mode: 'cors',
      headers: {
        'Cache': 'no-cache'
      }
    }, 'text', function(vuedata) {
      var ClanDetailsMethods = {
        displaybig: function(item,imageid) {
          var img = item.imgs[imageid];
          ClanMediaComponentData.bigclan = item;
          ClanMediaComponentData.bigimage = imageid;
          ClanMediaComponentData.bigpreview = imageid;
          ClanMediaComponentData.bigshow = true;
        },
        review: function(data) {
          this.reviewcomplete = false;
          this.thanksforsubmit = 'Bedankt voor het beoordelen van deze clan';
          setTimeout(function () {
            ClanDetailsClanData.ClansReported[ClanDetailsClanData.clan_id] = true;
          }, 3000);
          newfetch("/reportclan", {
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
          }, 'json', function(JsonData) {
            // console.log(JsonData);
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

// a sign at the bottom that says if the browser is offline
var offlinescreen = new Vue({
  el: '.offline',
  data: {
    isonline: true
  },
  created: function() {
    if (navigator && typeof(navigator.onLine) == 'boolean') {
      this.isonline = navigator.onLine;
    }
  }
})

// load the top clans for offline mode
function loadintocache() {
  function FetchClanPreData(i) {
    var url = '/claninfo/now/' + clandata[i].id;
    // var url2 = url.replace('/claninfo/now/','/clanmedia/')
    // fetch(url2, {}).then(function(response) {
    //   return response.json();
    // }).then(function(returndata) {
    //   Lockr.set(url2.replace(/\//g, ''), returndata)
    // })
    fetch(url, {}).then(function(response) {
      return response.json();
    }).then(function(returndata) {
      Lockr.set(url.replace(/\//g, ''), returndata)
      if (clandata[i + 1] && i != 15) {
        FetchClanPreData(i + 1)
      }
    })
  }
  if (navigator && typeof(navigator.onLine) == 'boolean' && navigator.onLine == true) {
    FetchClanPreData(0)
  }
}

setTimeout(function () {
  (function() {
    if (typeof(Lockr.get('webpsupported')) == 'boolean') {
      if (typeof(clanslistvue) != "undefined") {
        clanslistvue.checkedwebp = Lockr.get('webpsupported');
      }
    } else {
      if (typeof(clanslistvue) != "undefined") {
        var img = new Image();
        img.onload = function() {
          var output = !!(img.height > 0 && img.width > 0);
          clanslistvue.checkedwebp = output;
          Lockr.set('webpsupported',output)
        };
        img.onerror = function() {
          clanslistvue.checkedwebp = false;
          Lockr.set('webpsupported',false)
        };
        img.src = '/img/testimg.webp';
      }
    }
  })();
}, 1000);
