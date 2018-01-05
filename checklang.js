const fs = require('fs-extra')
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

const data = fs.readJsonSync('./db/clandata-all-index.json')

const log = console.log

for (var i in data) {
  if (data.hasOwnProperty(i)) {
    let c = data[i]
    let languagedetected = lngDetector.detect(c.description, 3)
    let langs = []
    for (var j = 0; j < languagedetected.length; j++) {
      langs.push(languagedetected[j][0])
    }
    log(i, langs)
  }
}
