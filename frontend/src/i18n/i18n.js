import { initReactI18next } from "react-i18next"

import { registerSomEnergiaI18n } from "@somenergia/somenergia-ui"

import i18n from "i18next"

const translationFiles = import.meta.glob("./locale-*.yaml", { eager: true })

const resources = Object.fromEntries(
  Object.keys(translationFiles).map((key) => {
    const code = key.slice("./locale-".length, -".yaml".length)
    const translation = translationFiles[key].default
    return [code, { translation }]
  }),
)

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "es",
    lng: "es",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

registerSomEnergiaI18n(i18n)

export default i18n
