import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import languagedetector from 'i18next-browser-languagedetector'
import translationEN from 'locales/en/translation.json'
import translationRO from 'locales/ro/translation.json'
import moment from 'moment'
import 'moment/locale/ro'
import _ from 'lodash'

export const DEFAULT_LANGUAGE = 'ro'
export const LANGUAGE_LIST = ['ro', 'en']

i18n
  .use(languagedetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    returnEmptyString: false,
    fallbackLng: 'en', // use en if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    resources: {
      en: {
        translation: translationEN
      },
      ro: {
        translation: translationRO
      }
    },
    parseMissingKeyHandler: (value) =>
      _.capitalize(value.split('_').join(' '))
  })

moment.locale(i18n.language)

export default i18n