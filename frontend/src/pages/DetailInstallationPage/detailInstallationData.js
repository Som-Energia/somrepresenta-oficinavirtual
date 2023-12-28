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
  const contractStatusOptions = {
    esborrany: t('CONTRACT_DETAIL.CONTRACT_STATUS_DRAFT'),
    validar: t('CONTRACT_DETAIL.CONTRACT_STATUS_VALIDATION'),
    pendent: t('CONTRACT_DETAIL.CONTRACT_STATUS_PENDING'),
    activa: t('CONTRACT_DETAIL.CONTRACT_STATUS_ACTIVE'),
    cancelada: t('CONTRACT_DETAIL.CONTRACT_STATUS_CANCELLED'),
    contracte: t('CONTRACT_DETAIL.CONTRACT_STATUS_ACTIVATION'),
    novapolissa: t('CONTRACT_DETAIL.CONTRACT_STATUS_NEW_CONTRACT'),
    modcontractual: t('CONTRACT_DETAIL.CONTRACT_STATUS_MODIFICATION'),
    impagament: t('CONTRACT_DETAIL.CONTRACT_STATUS_UNPAID'),
    tall: t('CONTRACT_DETAIL.CONTRACT_STATUS_CUT'),
    baixa: t('CONTRACT_DETAIL.CONTRACT_STATUS_ENDED'),
  }
  const costDeviationIncludedOptions = {
    included: t('CONTRACT_DETAIL.COST_DEVIATION_INCLUDED'),
    not_included: t('CONTRACT_DETAIL.COST_DEVIATION_NOT_INCLUDED'),
  }
  contractData.reduction_deviation =
    contractData.cost_deviation === 'included'
      ? format.percent(contractData.reduction_deviation, 0)
      : 'N/A'
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
  contractData.proxy_fee = format.units(contractData.proxy_fee, '€/MWh', 2)

  contractData.status = format.enumeration(contractData.status, contractStatusOptions)

  return contractData
}
