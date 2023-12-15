import i18n from '../../i18n/i18n'

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

const BillingMode = {
  INDEX: 'index',
  ATR: 'atr',
}

const RepresentationType = {
  DIRECT: 'directa_cnmc',
  INDIRECT: 'indirecta_cnmc',
}

export default function transformContractDetails(contractData) {
  const t = i18n.t

  if (contractData.cost_deviation == 'included') {
    contractData.reduction_deviation += ' %'
  }
  if (contractData.cost_deviation != 'included') {
    contractData.reduction_deviation = 'N/A'
  }
  if (contractData.cost_deviation == 'included') {
    contractData.cost_deviation = t('CONTRACT_DETAIL.COST_DEVIATION_INCLUDED')
  }
  if (contractData.billing_mode === BillingMode.INDEX) {
    contractData.billing_mode = t('CONTRACT_DETAIL.BILLING_MODE_INDEX')
  }
  if (contractData.billing_mode === BillingMode.ATR) {
    contractData.billing_mode = t('CONTRACT_DETAIL.BILLING_MODE_ATR')
  }
  if (contractData.representation_type == RepresentationType.DIRECT) {
    contractData.representation_type = t('CONTRACT_DETAIL.REPRESENTATION_TYPE_DIRECT')
  }
  if (contractData.representation_type == RepresentationType.INDIRECT) {
    contractData.representation_type = t('CONTRACT_DETAIL.REPRESENTATION_TYPE_INDIRECT')
  }

  contractData.status = t('CONTRACT_DETAIL.STATUS_ACTIVE')

  return contractData
}
