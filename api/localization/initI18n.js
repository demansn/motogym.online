import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import {resources} from './resources.js';

export const initI18n = (options = {}) => {
    const {
        debug = false,
        lng = 'en'
    } = options;

    return i18next
        .init({
            resources,
            debug: debug,
            interpolation: {
                escapeValue: false
            },
            preload: ['ru', 'en', 'ja', 'ua'],
            fallbackLng: ['ru', 'en', 'ja', 'ua'],
            lng,
        });
};
