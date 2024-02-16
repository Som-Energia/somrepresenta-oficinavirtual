import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Chart from '@somenergia/somenergia-ui/Chart'
import SumDisplay from '@somenergia/somenergia-ui/SumDisplay'
import ovapi from '../services/ovapi'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import BarChartIcon from '@mui/icons-material/BarChart'
import TimelineIcon from '@mui/icons-material/Timeline'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import Papa from 'papaparse'
import { index2time, time2index, timeInterval, timeSlice } from '../services/curves'
import { downloadTextFile } from '../services/download'
import format from '../services/format'
import PageTitle from './PageTitle'
import { ContractSelector } from './ContractSelector'

dayjs.extend(minMax)

const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'
const YEARLY = 'YEARLY'

const LINE = 'LINE'
const BAR = 'BAR'

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

function currentContractData(productionData, contract) {
  const data = productionData
  if (!data) return undefined
  for (const contractData of data.data) {
    if (contractData.contract_name !== contract) continue
    return contractData
  }
  return undefined
}


const DownloadCsvButton = ({ productionData, contractName }) => {
  const { t, i18n } = useTranslation()
  function handleClick() {
    console.log({ productionData, contractName })
    const contractData = currentContractData(productionData, contractName)
    const header = [
      [t('PRODUCTION.CSV_COLUMN_CONTRACT_NUMBER'), contractName],
      //[t('PRODUCTION.CSV_COLUMN_CIL'), 'ES123412341234123412341234A00'],
      //[t('PRODUCTION.CSV_COLUMN_INSTALL_NAME'), 'La meva insta·lació'],
      [],
      [
        t('PRODUCTION.CSV_COLUMN_DATETIME'),
        t('PRODUCTION.CSV_COLUMN_UTC_OFFSET'),
        t('PRODUCTION.CSV_COLUMN_FORESEEN'),
        t('PRODUCTION.CSV_COLUMN_MEASURE'),
        t('PRODUCTION.CSV_COLUMN_MATURITY'),
        t('PRODUCTION.CSV_COLUMN_ESTIMATED'),
      ],
    ]
    const data = Papa.unparse(
      header.concat(
        contractData.measure_kwh.map((_, i) => {
          const date = index2time(contractData.first_timestamp_utc, i)
          return [
            format.localISODateTime(date),
            date.getTimezoneOffset() / 60,
            contractData.foreseen_kwh[i],
            contractData.measure_kwh[i],
            contractData.maturity[i],
            contractData.estimated[i] === true
              ? t('PRODUCTION.CSV_VALUE_ESTIMATED')
              : t('PRODUCTION.CSV_VALUE_REAL'),
          ]
        }),
      ),
    )
    downloadTextFile('holi', data, 'text/csv')
  }
  return (
    <Button variant="contained" onClick={handleClick}>
      <FileDownloadOutlinedIcon />
    </Button>
  )
}

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
  const [showProduction, setShowProduction] = useState(true)
  const [showForeseen, setShowForeseen] = useState(true)
  const [totalKwh, setTotalKwh] = useState(0)
  const [foreseenTotalKwh, setForeseenTotalKwh] = useState(0)

  const years = 4
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
    })
  }

  function calculateTotalKwh(measured_data, foreseen_data) {
    const initValue = 0
    const measuredSum = measured_data.reduce((n, { value }) => n + value, initValue)
    const foreseenSum = foreseen_data.reduce((n, { value }) => n + value, initValue)
    setTotalKwh(measuredSum)
    setForeseenTotalKwh(foreseenSum)
  }

  React.useEffect(() => {
    const contractData = currentContractData(productionData, contract)
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
      contractData.measure_kwh,
      startIndex,
      endIndex,
    )
    var foreseen_data = timeSlice(
      offsetDate,
      contractData.foreseen_kwh,
      startIndex,
      endIndex,
    )
    setProductionLineData(measured_data)
    let transdormedData = transformBarChartData(measured_data)
    setProductionBarData(transdormedData)
    setCompareData(foreseen_data)
    calculateTotalKwh(measured_data, foreseen_data)
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
            value !== null && setLine(!!value)
          }}
          aria-label={t('PRODUCTION.LABEL_PLOT_STYLE')}
        >
          <ToggleButton disabled value={0} aria-label={t('PRODUCTION.STYLE_BAR')}>
            <BarChartIcon />
          </ToggleButton>
          <ToggleButton value={1} aria-label={t('PRODUCTION.STYLE_LINE')}>
            <TimelineIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <DownloadCsvButton productionData={productionData} contractName={contract} />
      </Box>

      <Chart
        period={period}
        data={line ? (showProduction ? productionLineData : []) : productionBarData}
        legend={true}
        type={line ? LINE : BAR}
        lang={i18n?.language}
        compareData={showForeseen ? compareData : []}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexFlow: 'wrap',
          justifyContent: 'space-between',
          margin: '1rem',
          gap: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={showProduction}
                onChange={(event) => setShowProduction(event.target.checked)}
                sx={{
                  color: 'chartlines.production',
                  '&.Mui-checked': {
                    color: 'chartlines.production',
                  },
                }}
              />
            }
            label={t('PRODUCTION.LEGEND_PRODUCTION')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showForeseen}
                onChange={(event) => setShowForeseen(event.target.checked)}
                sx={{
                  color: 'chartlines.foreseen',
                  '&.Mui-checked': {
                    color: 'chartlines.foreseen',
                  },
                }}
              />
            }
            label={t('PRODUCTION.LEGEND_FORESEEN')}
          />
        </Box>
        <SumDisplay
          period={period}
          currentDate={showProduction ? currentTime : false}
          totalKwh={totalKwh}
          compareDate={showForeseen ? currentTime : false}
          compareTotalKwh={foreseenTotalKwh}
        />
      </Box>
    </>
  )
}
export default ChartProductionData
