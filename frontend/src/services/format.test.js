import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import { euros, date, enumeration } from './format'
import i18n from '../i18n/i18n'

describe('euros formatting', () => {
  let previousLanguage
  beforeEach(() => {
    previousLanguage = i18n.language
    i18n.changeLanguage('es')
  })
  afterEach(() => {
    i18n.changeLanguage(previousLanguage)
  })
  it('amount with no decimals', () => {
    expect(euros(2)).toBe('2,00 €')
  })
  it('amount with two decimals', () => {
    expect(euros(2.15)).toBe('2,15 €')
  })
  it('amount with rounding up', () => {
    expect(euros(2.159)).toBe('2,16 €')
  })
  it('amount with rounding down', () => {
    expect(euros(2.151)).toBe('2,15 €')
  })
  it('amount with rounding middle', () => {
    expect(euros(2.155)).toBe('2,16 €')
  })
  it('amount with negative', () => {
    expect(euros(-2)).toBe('-2,00 €')
  })
  it('amount with string number', () => {
    expect(euros('-2')).toBe('-2,00 €')
  })
  it('amount with undefined', () => {
    expect(euros(undefined)).toBe('-- €')
  })
  it('amount over thousands puts point', () => {
    i18n.changeLanguage('es')

    expect(euros(2345)).toBe('2.345,00 €')
  })
  it('basque locale', () => {
    i18n.changeLanguage('eu')
    expect(euros(2345)).toBe('2.345,00 €')
  })
  it('english locale', () => {
    i18n.changeLanguage('en')
    expect(euros(2345)).toBe('€2,345.00')
  })
})

describe('dates formatting', () => {
  let previousLanguage
  beforeEach(() => {
    previousLanguage = i18n.language
  })
  afterEach(() => {
    i18n.changeLanguage(previousLanguage)
  })
  it('default language (english)', () => {
    expect(date('2022-12-20')).toBe('12/20/2022')
  })
  it('spanish', () => {
    i18n.changeLanguage('es')
    expect(date('2022-12-20')).toBe('20/12/2022')
  })
  it('euskara', () => {
    i18n.changeLanguage('eu')
    expect(date('2022-12-20')).toBe('2022/12/20')
  })
  it('undefined spanish', () => {
    i18n.changeLanguage('es')
    expect(date(undefined)).toBe('--/--/----')
  })
  it('undefined euskara', () => {
    i18n.changeLanguage('eu')
    expect(date(undefined)).toBe('----/--/--')
  })
})

describe('enum formatting', () => {
  const enum_options = {
    option1: 'Option 1',
    option2: 'Option 2',
  }

  it('Option 1', () => {
    expect(enumeration('option1', enum_options)).toBe('Option 1')
  })
  it('Option 2', () => {
    expect(enumeration('option2', enum_options)).toBe('Option 2')
  })
  it('Non existing option', () => {
    expect(enumeration('nooption', enum_options)).toBe('???')
  })
  it('Undefined value', () => {
    expect(enumeration(undefined, enum_options)).toBe('-')
  })
})
