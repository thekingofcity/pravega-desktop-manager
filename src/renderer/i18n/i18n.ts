import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from '../../../assets/locale/en-US/translations.json';
import zhCN from '../../../assets/locale/zh-CN/translations.json';
import jaJP from '../../../assets/locale/ja-JP/translations.json';
import koKR from '../../../assets/locale/ko-KR/translations.json';

i18n.use(initReactI18next).init({
    resources: {
        'en-US': { translation: enUS },
        'zh-CN': { translation: zhCN },
        'ja-JP': { translation: jaJP },
        'ko-KR': { translation: koKR },
    },
    fallbackLng: 'en-US',
    lng:
        JSON.parse(localStorage.getItem('reduxSettingsState') ?? '{}')
            .language ?? 'en-US',
    interpolation: {
        // not needed for react as it escapes by default
        escapeValue: false,
    },
});
