import en from './en/server.json' assert {type: 'json'};
import ru from './ru/server.json' assert {type: 'json'};
import ja from './ja/server.json' assert {type: 'json'};
import ua from './uk-UA/server.json' assert {type: 'json'};

export const resources = {
    en: {translation: en},
    ru: {translation: ru},
    ua: {translation: ua},
    ja: {translation: ja}
};
