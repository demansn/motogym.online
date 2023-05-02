const path = require('path');

const config = {
    i18n: {
        locales: ['en', 'ua'],
        defaultLocale: 'en',
        localeDetection: false,
    },
    localePath: path.resolve('./locales'),
    localeStructure: '{{lng}}/{{ns}}',
    defaultNS: 'client'
};

module.exports = config;
