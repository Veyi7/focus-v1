import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import global_es from "./translations/es/global.json";
import global_en from "./translations/en/global.json";
import global_cat from "./translations/cat/global.json";


i18n
    .use(initReactI18next)
    .init({
        debug: true,
        resources: {
            es: {
                global: global_es,
            },
            en: {
                global: global_en,
            },
            cat: {
                global: global_cat,
            }
        },
        lng: 'en',
        interpolation: { 
            escapeValue: false 
        },
    });

export default i18n;