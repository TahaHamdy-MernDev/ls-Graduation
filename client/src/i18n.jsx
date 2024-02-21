import i18n  from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    lng: 'en', // Set the default language
    fallbackLng: 'en', // Fallback language if the translation key is missing
    interpolation: {
      escapeValue: false, // React already safely escapes interpolated values
    },
  });

export default i18n;
