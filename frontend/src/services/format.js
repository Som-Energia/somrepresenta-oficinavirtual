import i18n from '../i18n/i18n'

function euros(amount) {
    const numberAmount = parseFloat(amount)
    if (isNaN(numberAmount)) return '-- €'
    return `${numberAmount.toLocaleString('es', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} €`
}

function date(adate) {
    const language = i18n.language
    const formatter = new Intl.DateTimeFormat(language)
    if (!adate) {
        return formatter.format(new Date('1111/11/11')).replace(/1/g,'-') 
    }
    return formatter.format(new Date(adate)) 
}

export { euros, date }
export default {euros, date}
