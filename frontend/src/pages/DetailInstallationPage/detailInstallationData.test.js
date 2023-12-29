import { describe, expect, it } from 'vitest'
import i18n from '../../i18n/i18n'

import transformContractDetails, {
  transformInstallationDetails,
} from './detailInstallationData'

describe('transformContractDetails', () => {
  let previousLanguage
  beforeEach(() => {
    previousLanguage = i18n.language
    i18n.changeLanguage('es')
  })
  afterEach(() => {
    i18n.changeLanguage(previousLanguage)
  })
  it('Add `%` to reduction_deviation if cost_deviation is `included`', () => {
    const contractData = {
      cost_deviation: 'included',
      reduction_deviation: 'foo',
    }
    const result = transformContractDetails(contractData)
    expect(result['reduction_deviation']).toContain('%')
  })

  it('Place `N/A` to reduction_deviation if cost_deviation is different to `included`', () => {
    const contractData = {
      cost_deviation: 'different to included',
      reduction_deviation: 'foo',
    }
    const result = transformContractDetails(contractData)
    expect(result['reduction_deviation']).toEqual('N/A')
  })

  it('Replace `billing_mode` value `index` by `Indexada`', () => {
    const contractData = {
      billing_mode: 'index',
    }
    const result = transformContractDetails(contractData)
    expect(result['billing_mode']).toEqual('Indexada')
  })

  it('Replace `billing_mode` value `atr` by `ATR`', () => {
    const contractData = {
      billing_mode: 'atr',
    }
    const result = transformContractDetails(contractData)
    expect(result['billing_mode']).toEqual('ATR')
  })

  it('Replace `representation_type` value `directa_cnmc` by `Indirecta a Mercat i Directa davant la CNMC`', () => {
    const contractData = {
      representation_type: 'directa_cnmc',
    }
    const result = transformContractDetails(contractData)
    expect(result['representation_type']).toEqual(
      'Indirecta a Mercado y Directa ante la CNMC',
    )
  })

  it('replace `representation_type` value `indirecta_cnmc` by `Indirecta a Mercat i Directa davant la CNMC`', () => {
    const contractData = {
      representation_type: 'indirecta_cnmc',
    }
    const result = transformContractDetails(contractData)
    expect(result['representation_type']).toEqual(
      'Indirecta a Mercado y Indirecta ante la CNMC',
    )
  })
})

describe('transformInstallationDetails', () => {
  let previousLanguage
  beforeEach(() => {
    previousLanguage = i18n.language
    i18n.changeLanguage('es')
  })
  afterEach(() => {
    i18n.changeLanguage(previousLanguage)
  })
  it('technology, when no value', () => {
    const contractData = {}
    const result = transformInstallationDetails(contractData)
    expect(result['technology']).toEqual('-')
  })
  it('technology, replace E by Eólica', () => {
    const contractData = {
      technology: 'E',
    }
    const result = transformInstallationDetails(contractData)
    expect(result['technology']).toEqual('Eólica')
  })
  it('technology, replace PV by Fotovoltáica', () => {
    const contractData = {
      technology: 'FV',
    }
    const result = transformInstallationDetails(contractData)
    expect(result['technology']).toEqual('Fotovoltáica')
  })
  it('technology, replace H by Hidroeléctrica', () => {
    const contractData = {
      technology: 'H',
    }
    const result = transformInstallationDetails(contractData)
    expect(result['technology']).toEqual('Hidroeléctrica')
  })
  it('rated_power, not given', () => {
    const contractData = {}
    const result = transformInstallationDetails(contractData)
    expect(result['rated_power']).toEqual('-- kW')
  })
  it('rated_power, null', () => {
    const contractData = {
      rated_power: null,
    }
    const result = transformInstallationDetails(contractData)
    expect(result['rated_power']).toEqual('-- kW')
  })
  it('rated_power, integer', () => {
    const contractData = {
      rated_power: 100,
    }
    const result = transformInstallationDetails(contractData)
    expect(result['rated_power']).toEqual('100 kW')
  })
  it('rated_power, thousand separator', () => {
    const contractData = {
      rated_power: 1000,
    }
    const result = transformInstallationDetails(contractData)
    expect(result['rated_power']).toEqual('1.000 kW')
  })
  it('rated_power, decimals', () => {
    const contractData = {
      rated_power: 10.55,
    }
    const result = transformInstallationDetails(contractData)
    expect(result['rated_power']).toEqual('11 kW')
  })
})
