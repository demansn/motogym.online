const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const { resources } = require('./resources');

const init = (options = {}) => {
    const {
        debug = false,
        lng = 'en'
    } = options;

    return i18next
        .use(Backend)
        .init({
            backend: {
                loadPath: __dirname + '/{{lng}}/{{ns}}.json',
            },
            resources,
            debug: debug,
            interpolation: {
                escapeValue: false
            },
            preload: ['ru', 'en', 'ja', 'uk-UA'],
            fallbackLng: ['ru', 'en', 'ja', 'uk-UA', 'dev'],
            lng
        }).then(() => i18next.loadLanguages(['ru', 'en', 'ja', 'uk-UA']));
};

module.exports = {
    initI18n: init,
    i18next
};