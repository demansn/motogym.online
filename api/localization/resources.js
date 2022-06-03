const en = require('./en/server.json');
const ru = require('./ru/server.json');
const ja = require('./ja/server.json');
const ua = require('./uk-UA/server.json');

module.exports = {
    resources: {
        en: {translation: en},
        ru: {translation: ru},
        ua: {translation: ua},
        ja: {translation: ja}
    }
};