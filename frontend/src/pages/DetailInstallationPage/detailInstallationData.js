import i18n from '../../i18n/i18n'
import format from '../../services/format'

export const installationFields = [
  'contract_number',
  'name',
  'address',
  'city',
  'postal_code',
  'province',
  'coordinates',
  'technology',
  'cil',
  'rated_power',
  'type',
  'ministry_code',
]

export const contractFields = [
  'billing_mode',
  'proxy_fee',
  'cost_deviation',
  'reduction_deviation',
  'representation_type',
  'iban',
  'discharge_date',
  'status',
]
export function transformInstallationDetails(data) {
  const t = i18n.t
  const productionTecnologyOptions = {
    FV: t('INSTALLATION_DETAIL.TECHNOLOGY_PHOTOVOLTAIC'),
    H: t('INSTALLATION_DETAIL.TECHNOLOGY_HYDRO'),
    E: t('INSTALLATION_DETAIL.TECHNOLOGY_WIND'),
  }
  data.rated_power = format.units(data.rated_power, 'kW', 0)
  data.technology = format.enumeration(data.technology, productionTecnologyOptions)
  return data
}
export default function transformContractDetails(contractData) {
  const t = i18n.t
  const billingModeOptions = {
    index: t('CONTRACT_DETAIL.BILLING_MODE_INDEX'),
    atr: t('CONTRACT_DETAIL.BILLING_MODE_ATR'),
  }
  const representationTypeOptions = {
    directa_cnmc: t('CONTRACT_DETAIL.REPRESENTATION_TYPE_DIRECT'),
    indirecta_cnmc: t('CONTRACT_DETAIL.REPRESENTATION_TYPE_INDIRECT'),
  }
  const costDeviationIncludedOptions = {
    included: t('CONTRACT_DETAIL.COST_DEVIATION_INCLUDED'),
    not_included: t('CONTRACT_DETAIL.COST_DEVIATION_NOT_INCLUDED'),
  }
  if (contractData.cost_deviation == 'included') {
    contractData.reduction_deviation += ' %'
  }
  if (contractData.cost_deviation != 'included') {
    contractData.reduction_deviation = 'N/A'
  }
  contractData.cost_deviation = format.enumeration(
    contractData.cost_deviation,
    costDeviationIncludedOptions,
  )
  contractData.billing_mode = format.enumeration(
    contractData.billing_mode,
    billingModeOptions,
  )
  contractData.representation_type = format.enumeration(
    contractData.representation_type,
    representationTypeOptions,
  )
  contractData.discharge_date = format.date(contractData.discharge_date)

  contractData.status = t('CONTRACT_DETAIL.STATUS_ACTIVE')

  return contractData
}
