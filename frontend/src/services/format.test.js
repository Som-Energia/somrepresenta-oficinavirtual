import { beforeEach, afterEach, describe, expect, test, it } from 'vitest'
import { euros, date } from './format'
import i18n from '../i18n/i18n'


describe('euros formatting', () => {
  it('amount with no decimals', () => {
    expect(euros(2)).toBe('2,00 €')
  })
  it('amount with two decimals', () => {
    expect(euros(2.15)).toBe('2,15 €')
  })
  it('amount with rounding up', () => {
    expect(euros(2.159)).toBe('2,16 €')
  })
  it('amount with rounding down', () => {
    expect(euros(2.151)).toBe('2,15 €')
  })
  it('amount with rounding middle', () => {
    expect(euros(2.155)).toBe('2,16 €')
  })
  it('amount with negative', () => {
    expect(euros(-2)).toBe('-2,00 €')
  })
  it('amount with string number', () => {
    expect(euros('-2')).toBe('-2,00 €')
  })
  it('amount with undefined', () => {
    expect(euros(undefined)).toBe('-- €')
  })
})


describe('dates formatting', () => {
  var previousLanguage
  beforeEach(()=>{
    previousLanguage = i18n.language
  })
  afterEach(()=>{
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