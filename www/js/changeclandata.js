Vue.component('changeclanmedia', {
  template: '<div class="changeclanmedia">\
    <div class="button" v-on:click="show = !show">{{ addtext || "Media toevoegen"}}</div>\
    <div class="thispopup" v-if="show">\
      <div class="placeholder">\
        <div class="titles">\
          <h1>{{ clan.clandata.clantag }}</h1>\
          <img :src="clan.clandata.smallimg"/>\
        </div>\
        <div class="input">\
          <p>Afbeelding</p>\
          <div \
            :style="{border: hovercss}" \
            v-on:click="openfiles" \
            class="fileinputhandeler" \
            v-on:dragover="uploadimgdragover" \
            v-on:drop="uploadimgdrop" \
            v-on:dragleave="uploadimgdragleave">\
            <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\
              <path d="M0 0h24v24H0z" fill="none"/>\
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>\
            </svg>\
            <p>Sleep bestanden hier heen </br>of klik op de upload knop</p>\
          </div>\
          <input :class="inputid" type=\'file\' accept="image/*" id="imginput" @change="loadFile"/>\
          <p>Title <span>*niet verplight</span></p>\
          <input type=\'text\' v-model="doctitle" placeholder="Title"/>\
          <p>Url <span>*niet verplight</span></p>\
          <input type=\'text\' v-model="docurl" placeholder="Url"/>\
          <p class="wrong" v-if="urlerr">Moet een url zijn</p>\
          <p class="wrong" v-else></p>\
        </div>\
        <div class="imgholder">\
          <p class="textpreview">Preview</p>\
          <div class="preview" v-bind:style="{\'background-image\':\'url(\' + image + \')\'}">\
            <p v-if="!urlerr && docurl != \'\'">\
              <a :href="docurl" target="_blank" :title="docurl">\
              <svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\
                  <path d="M0 0h24v24H0z" fill="none"/>\
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>\
              </svg>{{ (doctitle != "") ? doctitle : "link" }}</a>\
            </p>\
            <p v-else>{{ doctitle }}</p>\
          </div>\
        </div>\
        <div class="submit">\
          <button v-on:click="close" :disabled="prossessing" class="cancel">Cancel</button>\
          <button v-on:click="upload" :disabled="prossessing || urlerr || image == \'\' || typeof(sendimg) != \'object\'" class="update">Update</button>\
        </div>\
      </div>\
    </div>\
  </div>',
  data: function() {
    return {
      hovercss: '2px solid rgb(255,255,255)',
      image: '',
      sendimg: '',
      doctitle: '',
      docurl: '',
      urlerr: false,
      inputid: 'input' + _.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6).join(''),
      show: false,
      prossessing: false
    }
  },
  watch: {
    docurl: function(newval) {
      function isURL(str) {
        var a  = document.createElement('a');
        a.href = str;
        return (a.host && a.host != window.location.host);
      }
      if (isURL(newval) || newval == '') {
        this.urlerr = false;
      } else {
        this.urlerr = true;
      }
    }
  },
  methods: {
    close: function() {
      this.show = false;
      this.doctitle = '';
      this.docurl = '';
      this.image = '';
      this.sendimg = '';
    },
    upload: function() {
      var vm = this;
      vm.prossessing = true;
      var input = document.getElementsByClassName(this.inputid)[0];
      var data = new FormData();
      data.append('file', input.files[0]);
      data.append('url', this.docurl);
      data.append('title', this.doctitle);
      fetch('/submitclammedia/', {
        mode: 'cors',
        body: data,
        method: "post",
        headers: {
          'Cache': 'no-cache'
        },
        credentials: 'same-origin',
      }).then(function(response) {
        return response.json();
      }).then(function(status) {
        vm.prossessing = false;
        if (status.status) {
          vm.close();
          setTimeout(function () {
            var vm = ClanMediaComponentData;
            fetch("/clanmedia")
            .then( function functionName(response) {
               return response.json();
            }).then(function(med) {
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
          }, 750);
        } else {
          vm.urlerr = true;
        }
      });
    },
    uploadimgdragleave: function() {
      this.hovercss = '2px solid rgb(255,255,255)';
    },
    uploadimgdragover: function(ev) {
      this.hovercss = '2px solid rgb(212,0,255)';
      ev.preventDefault();
    },
    uploadimgdrop: function(ev) {
      this.hovercss = '2px solid rgb(255,255,255)';
      ev.preventDefault();
      var inputel = document.getElementsByClassName(this.inputid)[0];
      inputel.files = ev.dataTransfer.files;
      var files = inputel.files;
      this.createImage(files[0]);
      this.sendimg = files[0];
    },
    loadFile: function(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
      this.sendimg = files[0];
    },
    createImage: function(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.onload = function (e) {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    openfiles: function() {
      document.getElementsByClassName(this.inputid)[0].click()
    }
  },
  props: ['clan','addtext']
});
