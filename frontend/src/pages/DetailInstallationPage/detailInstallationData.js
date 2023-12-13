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

export function transformContractDetails(contractData) {
  if (contractData.cost_deviation == 'included') {
    contractData['reduction_deviation'] += ' %'
  } else {
    contractData['reduction_deviation'] = 'N/A'
  }
  return contractData
}
