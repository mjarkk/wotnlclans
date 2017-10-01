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

var tests = new Vue({
  el: '.test-main',
  data: {
    reqtestdune: false,
    requrls: [],
    imgtestdune: false,
    imgtest: ''
  },
  methods: {
    starttest: function() {
      var vm = this;
      function reqfiles() {
        var requrls = [
          '/',
          '/css/home.css',
          '/dyjs/vue.js',
          '/js/anime.min.js',
          '/dyjs/script.js',
          '/js/underscore.min.js',
          '/dyjs/changeclandata.js',
          '/css/home.css',
          '/clandata-firstload/',
          '/clandata-load2/',
          '/clan/true',
          '/mediatemplate',
          '/img/clanicons-0.png',
          '/img/clanicons-0.min.png',
          '/css/media.css',
          '/clanmedia/'
        ]
        var errors = []
        function req(id) {
          var requrl = requrls[id]
          try {
            fetch(requrl, {credentials: 'same-origin',mode: 'cors'})
            .then(function(response) {
              console.log(response);
              if (!response.ok || response.status == 404) {
                errors.push({
                  url: requrl,
                  what: response.statusText
                })
              }
              return response.text();
            })
            .then(function(text) {
              if (requrls[id + 1]) {
                req(id + 1)
              } else {
                result()
              }
            })
            .catch(function(error) {
              errors.push({
                url: requrl,
                what: error
              })
              if (requrls[id + 1]) {
                req(id + 1)
              } else {
                result()
              }
            });
          } catch (e) {
            errors.push({
              url: requrl,
              what: e
            })
            if (requrls[id + 1]) {
              req(id + 1)
            } else {
              result()
            }
          }
        }
        function result() {
          console.log('dune testing url\'s');
          vm.reqtestdune = true;
          vm.requrls = errors;
          testimgs()
        }
        req(0)
      }
      function testimgs() {
        var errors = ''
        try {
          fetch('/clandata-firstload/', {credentials: 'same-origin',mode: 'cors'})
          .then(function(response) {
            return response.json();
          })
          .then(function(resjson) {
            var chunkicons = resjson.chunk_inefficient(100)
            var testedicons = 0;
            for (var i = 0; i < chunkicons.length; i++) {
              var objImage = new Image();
              objImage.src ='/img/clanicons-' + i + '.min.png';
              objImage.onload = function(e) {
                // console.log(e);
                testedicons ++
                if (testedicons == chunkicons.length) {
                  final()
                }
              }
              objImage.onerror = function(e) {
                errors = 'Icon\'s file not loading';
                testedicons ++
                if (testedicons == chunkicons.length) {
                  final()
                }
              }
            }
          })
          .catch(function(error) {
            errors = error
          });
        } catch (error) {
          errors = error
        }
        function final() {
          vm.imgtestdune = true;
          vm.imgtest = errors;
          console.log('dune testing imgs');
        }
      }
      reqfiles()
    }
  }
})
