import { i18n, addTranslationFiles } from '@somenergia/somenergia-ui/i18n'

const translationFiles = import.meta.glob('./locale-*.yaml', { eager: true })

addTranslationFiles(translationFiles)

export default i18n
