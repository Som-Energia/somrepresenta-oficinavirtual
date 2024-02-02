import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Chart from '@somenergia/somenergia-ui/Chart'
import ovapi from '../services/ovapi'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import BarChartIcon from '@mui/icons-material/BarChart'
import TimelineIcon from '@mui/icons-material/Timeline'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { InstallationContext } from './InstallationProvider'
import PageTitle from './PageTitle'
import { time2index, timeInterval, timeSlice } from '../services/curves'

dayjs.extend(minMax)

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
yesterday.setDate(yesterday.getDate() - 1)

const ChartProductionData = () => {
  const [productionData, setProductionData] = useState(undefined)
  const [productionLineData, setProductionLineData] = useState([])
  const [productionBarData, setProductionBarData] = useState({})
  const [compareData, setCompareData] = useState([])
  const [line, setLine] = useState(true)
  const [contract, setContract] = useState(null)
  const [period, setPeriod] = useState(DAILY)
  const [currentTime, setCurrentTime] = useState(dayjs(yesterday))
  const { t, i18n } = useTranslation()

  const years = 1
  const maxDate = new Date()
  maxDate.setHours(0)
  maxDate.setMinutes(0)
  maxDate.setSeconds(0)
  maxDate.setMilliseconds(0)
  const minDate = new Date(maxDate)
  minDate.setFullYear(minDate.getFullYear() - years)

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
    ovapi.productionData(minDate, maxDate).then((data) => {
      setProductionData(data)
      console.log(data)
    })
  }

  function currentContractData() {
    const data = productionData
    if (!data) return undefined
    for (const contractData of data.data) {
      if (contractData.contract_number !== contract) continue
      return contractData
    }
    return undefined
  }

  React.useEffect(() => {
    const contractData = currentContractData()
    if (!contractData) {
      setProductionLineData([])
      setProductionBarData({})
      setCompareData([])
      return
    }
    const offsetDate = new Date(contractData.first_timestamp_utc)
    var [startTime, endTime] = timeInterval(period, currentTime)
    var startIndex = time2index(offsetDate, startTime)
    var endIndex = time2index(offsetDate, endTime)

    var measured_data = timeSlice(
      offsetDate,
      contractData.measured_kwh,
      startIndex,
      endIndex,
    )
    var forecast_data = timeSlice(
      offsetDate,
      contractData.forecast_kwh,
      startIndex,
      endIndex,
    )
    setProductionLineData(measured_data)
    let transdormedData = transformBarChartData(measured_data)
    setProductionBarData(transdormedData)
    setCompareData(forecast_data)
  }, [productionData, period, currentTime, contract])

  useEffect(() => {
    getProductionData()
  }, [])

  const dayjsperiods = {
    DAILY: 'd',
    WEEKLY: 'w',
    MONTHLY: 'M',
    YEARLY: 'y',
  }

  function prevTimeWindow() {
    setCurrentTime(
      dayjs.max(dayjs(minDate), currentTime.subtract(1, dayjsperiods[period])),
    )
  }

  function nextTimeWindow() {
    setCurrentTime(dayjs.min(dayjs(maxDate), currentTime.add(1, dayjsperiods[period])))
  }

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

        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Button onClick={prevTimeWindow}>
            <ArrowBackIosOutlinedIcon />
          </Button>
          <DatePicker
            value={currentTime}
            onChange={setCurrentTime}
            views={
              period === YEARLY
                ? ['year']
                : period === MONTHLY
                  ? ['month', 'year']
                  : undefined
            }
            minDate={dayjs(minDate)}
            maxDate={dayjs(maxDate)}
          />
          <Button onClick={nextTimeWindow}>
            <ArrowForwardIosOutlinedIcon />
          </Button>
        </Box>

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
