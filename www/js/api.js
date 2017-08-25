var sitetitle = new Vue({
  el: '.titlebar',
  data: {
    sitetitle: 'Wot NL/BE clans api\'s',
    backicon: true
  },
  methods: {
    openstart: function() {
      window.location.href='/';
    }
  }
})

var api = new Vue({
  el: '.api-content',
  data: {
    c1: {
      clanid: '500069182',
      url: location.origin + '/c1/' + '500069182' + '/' + 'white' + '/html',
      output: `<iframe
  allowtransparency="true"
  style="overflow:hidden;height:150px;width:300px"
  src="${location.origin + '/c1/' + '500069182' + '/white/html'}">
</iframe>`,
      err: '',
      darktheme: false
    }
  },
  watch: {
    'c1.darktheme': function(NewVal, OldVal) {
      this.changepreview(NewVal)
    },
    'c1.clanid': function(NewVal, OldVal) {
      if (NewVal.length !== 9 && /^\d+$/.test(NewVal)) {
        this.c1.err = 'dat is geen clan id'
      } else {
        this.c1.err = ''
        this.changepreview(this.c1.darktheme)
      }
    }
  },
  methods: {
    changepreview: function(NewVal) {
      var theme = 'white';
      if (NewVal) {
        theme = 'black';
      }
      setTimeout(function () {
        api.c1.url = location.origin + '/c1/' + api.c1.clanid + '/' + theme + '/html';
        api.c1.output = `<iframe
      allowtransparency="true"
      style="overflow:hidden;height:150px;width:300px"
      src="${api.c1.url}">
      </iframe>`
      }, 300);
    }
  }
});
