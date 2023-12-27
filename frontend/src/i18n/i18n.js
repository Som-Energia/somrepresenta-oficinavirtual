import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { addTranslationFiles } from '@somenergia/somenergia-ui/i18n'

const translationFiles = import.meta.glob('./locale-*.yaml', { eager: true })

addTranslationFiles(translationFiles)

export default i18n
