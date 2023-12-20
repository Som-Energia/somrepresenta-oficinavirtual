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
  return {
    ...data,
    rated_power: format.units(data.rated_power, 'kW', 0),
    technology: format.enumeration(data.technology, productionTecnologyOptions),
  }
}
function transformContractDetails(contract) {
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
  return {
    ...contract,
    reduction_deviation:
      contract.cost_deviation === 'included'
        ? format.percent(contract.reduction_deviation, 0)
        : 'N/A',
    cost_deviation: format.enumeration(
      contract.cost_deviation,
      costDeviationIncludedOptions,
    ),
    billing_mode: format.enumeration(contract.billing_mode, billingModeOptions),
    representation_type: format.enumeration(
      contract.representation_type,
      representationTypeOptions,
    ),
    discharge_date: format.date(contract.discharge_date),
    proxy_fee: format.units(contract.proxy_fee, '€/MWh', 2),
    status: format.enumeration(contract.status, contractStatusOptions),
  }

  return contract
}

function computeNavigationInfo(installations, currentInstallationContractNumber) {
  if (installations.length < 2) {
    return {}
  }

  // Find the index of the current installation
  const currentIndex = installations.findIndex(
    (installation) => installation.contract_number === currentInstallationContractNumber,
  )

  // Determine the index of the previous and next installations
  const previousIndex = currentIndex > 0 ? currentIndex - 1 : installations.length - 1
  const nextIndex = currentIndex < installations.length - 1 ? currentIndex + 1 : 0

  // Extract the contract numbers for the previous and next installations
  const before = installations[previousIndex].contract_number
  const next = installations[nextIndex].contract_number

  return { before, next }
}

export { transformContractDetails, computeNavigationInfo }
