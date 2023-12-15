import i18n from '../i18n/i18n'

function euros(amount) {
  const asFloat = parseFloat(amount)
  if (isNaN(asFloat)) return '-- €'
  const localized = asFloat.toLocaleString('es', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
  return `${localized} €`
}

function date(adate) {
  const language = i18n.language
  const formatter = new Intl.DateTimeFormat(language)
  if (!adate) {
    return formatter.format(new Date('1111-11-11')).replace(/[0-9]/g, '-')
  }
  return formatter.format(new Date(adate))
}

export { euros, date }
export default { euros, date }
