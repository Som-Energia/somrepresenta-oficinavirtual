import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Chart from '@somenergia/somenergia-ui/Chart'
import ovapi from '../services/ovapi'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import BarChartIcon from '@mui/icons-material/BarChart'
import TimelineIcon from '@mui/icons-material/Timeline'
import { InstallationContext } from './InstallationProvider'
import PageTitle from './PageTitle'
import { time2index, timeInterval, timeSlice } from '../services/curves'

const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'
const YEARLY = 'YEARLY'

const LINE = 'LINE'
const BAR = 'BAR'

const ContractSelector = ({ setContract, contract }) => {
  const {
    installations,
    loading: listLoading,
    error: listError,
  } = React.useContext(InstallationContext)
  const { t, i18n } = useTranslation()

  React.useEffect(() => {
    if (installations === null) return
    setContract(installations[0].contract_number)
  }, [installations])

  return (
    installations && (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-end',
        }}
      >
        <FormControl size="small">
          <InputLabel id="contract-select-label">
            {t('PRODUCTION.LABEL_CONTRACT')}
          </InputLabel>
          <Select
            labelId="contract-select-label"
            id="contract-select"
            value={contract || installations[0].contract_number}
            label={t('PRODUCTION.LABEL_CONTRACT')}
            onChange={(ev) => setContract(ev.target.value)}
          >
            {installations &&
              installations.map(({ contract_number, installation_name }) => {
                return (
                  <MenuItem key={contract_number} value={contract_number}>
                    {`${installation_name} [${contract_number}]`}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>
      </Box>
    )
  )
}

const yesterday = new Date()
yesterday.setDate(yesterday.getDate()-1)

const ChartProductionData = () => {
  const [productionLineData, setProductionLineData] = useState([])
  const [productionBarData, setProductionBarData] = useState({})
  const [productionData, setProductionData] = useState(undefined)
  const [compareData, setCompareData] = useState([])
  const [line, setLine] = useState(true)
  const [contract, setContract] = useState(null)
  const [period, setPeriod] = useState(DAILY)
  const [currentTime, setCurrentTime] = useState(yesterday)
  const { t, i18n } = useTranslation()

  const transformBarChartData = (data) => {
    return {
      periods: [
        {
          values: 100,
          data: 1706558200346,
          P1: 20,
          P2: 30,
          P3: 50,
        },
      ],
      keys: ['P1', 'P2', 'P3'],
      fills: {
        P1: '#FFC300',
        P2: '#900C3F',
        P3: '#581845',
      },
    }
  }

  const getProductionData = () => {
    const years = 1
    const last_timestamp_utc = new Date()
    last_timestamp_utc.setHours(0)
    last_timestamp_utc.setMinutes(0)
    last_timestamp_utc.setSeconds(0)
    last_timestamp_utc.setMilliseconds(0)
    const first_timestamp_utc = new Date(last_timestamp_utc)
    first_timestamp_utc.setFullYear(first_timestamp_utc.getFullYear() - years)

    ovapi.productionData(first_timestamp_utc, last_timestamp_utc).then((data) => {
      setProductionData(data)
      console.log(data)
      var current_contract_data = data.data[0] // TODO: Choose the current one not the first
      const offsetDate = new Date(current_contract_data.first_timestamp_utc)
      var [startTime, endTime] = timeInterval(period, currentTime)
      var startIndex = time2index(offsetDate, startTime)
      var endIndex = time2index(offsetDate, endTime)

      var measured_data = timeSlice(
        offsetDate,
        current_contract_data.measured_kwh,
        startIndex,
        endIndex,
      )
      var forecast_data = timeSlice(
        offsetDate,
        current_contract_data.forecast_kwh,
        startIndex,
        endIndex,
      )
      console.log(measured_data)
      setProductionLineData(measured_data)
      let transdormedData = transformBarChartData(measured_data)
      setProductionBarData(transdormedData)
      setCompareData(forecast_data)
    })
  }

  useEffect(() => {
    getProductionData()
  }, [])

  return (
    <>
      <PageTitle Icon={QueryStatsIcon}>
        {t('PRODUCTION.PRODUCTION_TITLE')}
        <ContractSelector {...{ setContract, contract }} />
      </PageTitle>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexFlow: 'wrap',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          gap: '1rem',
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={period}
          exclusive
          onChange={(event, value) => {
            setPeriod(value)
          }}
          aria-label={t('PRODUCTION.LABEL_PERIOD')}
        >
          <ToggleButton value={DAILY}>{t('PRODUCTION.PERIOD_DIARY')}</ToggleButton>
          <ToggleButton value={WEEKLY}>{t('PRODUCTION.PERIOD_WEEKLY')}</ToggleButton>
          <ToggleButton value={MONTHLY}>{t('PRODUCTION.PERIOD_MONTHLY')}</ToggleButton>
          <ToggleButton value={YEARLY}>{t('PRODUCTION.PERIOD_YEARLY')}</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          color="primary"
          value={line ? 1 : 0}
          exclusive
          onChange={(event, value) => {
            setLine(!!value)
          }}
          aria-label={t('PRODUCTION.LABEL_PLOT_STYLE')}
        >
          <ToggleButton value={0} aria-label={t('PRODUCTION.STYLE_BAR')}>
            <BarChartIcon />
          </ToggleButton>
          <ToggleButton value={1} aria-label={t('PRODUCTION.STYLE_LINE')}>
            <TimelineIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Chart
        period={period}
        data={line ? productionLineData : productionBarData}
        legend={true}
        type={line ? LINE : BAR}
        lang={i18n?.language}
        compareData={compareData}
      />
    </>
  )
}
export default ChartProductionData
