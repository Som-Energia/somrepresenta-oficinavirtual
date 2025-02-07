import React from 'react'
import { useTranslation } from 'react-i18next'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import BarChartIcon from '@mui/icons-material/BarChart'
import TimelineIcon from '@mui/icons-material/Timeline'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import Papa from 'papaparse'
import Chart from '@somenergia/somenergia-ui/Chart'
import SumDisplay from '@somenergia/somenergia-ui/SumDisplay'
import PageTitle from '../../components/PageTitle'
import Loading from '../../components/Loading'
import ContractSelector from '../../components/ContractSelector'
import { InstallationContext } from '../../components/InstallationProvider'
import ovapi from '../../services/ovapi'
import format from '../../services/format'
import { index2time, timeSlice, sliceIndexes } from '../../services/curves'
import { downloadTextFile } from '../../services/download'

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

const DownloadCsvButton = ({ productionData, contractName, period, currentTime }) => {
  const { t, i18n } = useTranslation()
  const maturityOptions = {
    H2: t('PRODUCTION.MATURITY_H2'),
    H3: t('PRODUCTION.MATURITY_H3'),
    HP: t('PRODUCTION.MATURITY_HP'),
    HC: t('PRODUCTION.MATURITY_HC'),
    HD: t('PRODUCTION.MATURITY_HD'),
  }
  function handleClick() {
    const contractData = currentContractData(productionData, contractName)
    const [unadjustedStartIndex, unadjustedEndIndex] = sliceIndexes(
      contractData.first_timestamp_utc,
      period,
      currentTime,
      step_mm
    )
    const startIndex = Math.max(unadjustedStartIndex, 0)
    const endIndex = Math.min(unadjustedEndIndex, contractData.measure_kwh.length - 1)
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
    const content = header.concat(
      [...Array(endIndex - startIndex).keys()].map((_, i) => {
        const j = i + startIndex
        const date = index2time(contractData.first_timestamp_utc, j, step_mm)
        return [
          format.localISODateTime(date),
          date.getTimezoneOffset() / 60,
          contractData.foreseen_kwh[j],
          contractData.measure_kwh[j],
          format.enumeration(contractData.maturity[j], maturityOptions, ''),
          contractData.estimated[j] === null
            ? ''
            : contractData.estimated[j] === true
            ? t('PRODUCTION.CSV_VALUE_ESTIMATED')
            : t('PRODUCTION.CSV_VALUE_REAL'),
        ]
      }),
    )

    const csvdata = Papa.unparse(content, { delimiter: ';' })
    downloadTextFile(`production-${contractName}.csv`, csvdata, 'text/csv')
  }
  return (
    <Button disabled={productionData === undefined} color="primary" onClick={handleClick}>
      <FileDownloadRoundedIcon />
    </Button>
  )
}

const ChartProductionData = () => {
  // Installations to retrieve contract number
  const {
    installations,
    loading: listLoading,
    error: listError,
  } = React.useContext(InstallationContext)

  // Initial contract number from installations (if available)
  const firstContractNumber = installations && installations[0]?.contract_number

  const [productionData, setProductionData] = React.useState(undefined)
  const [productionLineData, setProductionLineData] = React.useState([])
  const [productionBarData, setProductionBarData] = React.useState({})
  const [compareData, setCompareData] = React.useState([])
  const [line, setLine] = React.useState(true)
  const [contract, setContract] = React.useState(firstContractNumber)
  const [period, setPeriod] = React.useState(DAILY)
  const [currentTime, setCurrentTime] = React.useState(dayjs(yesterday))
  const { t, i18n } = useTranslation()
  const [showProduction, setShowProduction] = React.useState(true)
  const [showForeseen, setShowForeseen] = React.useState(true)
  const [totalKwh, setTotalKwh] = React.useState(0)
  const [foreseenTotalKwh, setForeseenTotalKwh] = React.useState(0)

  const maxDate = new Date()
  maxDate.setHours(0)
  maxDate.setMinutes(0)
  maxDate.setSeconds(0)
  maxDate.setMilliseconds(0)
  const years = 4
  const minDate = new Date(maxDate)
  minDate.setFullYear(minDate.getFullYear() - years)
  const step_mm = 15

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

  const contractData = currentContractData(productionData, contract)
  const firstDataDate = contractData?.first_timestamp_utc ?? minDate
  const lastDataDate = contractData?.last_timestamp_utc ?? maxDate

  const getProductionData = (contractNumber) => {
    if (!contractNumber) return // If no contract number, do not proceed

    // Check if productionData already contains data for the selected contract
    const alreadyLoaded = productionData?.data.some(
      (data) => data.contract_name === contractNumber,
    )
    if (alreadyLoaded) return

    // Fetch production data for the given contract number
    ovapi.productionData(minDate, maxDate, contractNumber).then((data) => {
      setProductionData((prevData) => {
        if (prevData === undefined) {
          return data
        }
        const updatedData = {
          ...prevData, // Preserve other properties of prevData
          data: [...prevData.data, ...data.data], // Append the new contract data
        }
        return updatedData
      })
    })
  }

  function calculateTotalKwh(measured_data, foreseen_data) {
    const initValue = 0
    const measuredSum = measured_data.reduce((n, { value }) => n + value, initValue)
    const foreseenSum = foreseen_data.reduce((n, { value }) => n + value, initValue)
    setTotalKwh(measuredSum)
    setForeseenTotalKwh(foreseenSum)
  }
  function sliceGraphData() {
    const contractData = currentContractData(productionData, contract)
    if (!contractData) {
      setProductionLineData([])
      setProductionBarData({})
      setCompareData([])
      return
    }
    const offsetDate = new Date(contractData.first_timestamp_utc)
    const [startIndex, endIndex] = sliceIndexes(
      contractData.first_timestamp_utc,
      period,
      currentTime,
      step_mm
    )

    var measured_data = timeSlice(
      offsetDate,
      contractData.measure_kwh,
      startIndex,
      endIndex,
      step_mm
    )

    var foreseen_data = timeSlice(
      offsetDate,
      contractData.foreseen_kwh,
      startIndex,
      endIndex,
      step_mm
    )

    setProductionLineData(measured_data)
    let transdormedData = transformBarChartData(measured_data)
    setProductionBarData(transdormedData)
    setCompareData(foreseen_data)
    calculateTotalKwh(measured_data, foreseen_data)
  }

  React.useEffect(() => {
    sliceGraphData()
  }, [productionData, period, currentTime, contract])

  // Effect to fetch initial production data on mount
  React.useEffect(() => {
    setContract(firstContractNumber)
    getProductionData(firstContractNumber)
  }, [firstContractNumber]) // Only run when firstContractNumber changes

  // Effect to fetch new production data when contract changes
  React.useEffect(() => {
    if (contract === firstContractNumber) return // Done in previous useEffect
    getProductionData(contract)
  }, [contract]) // Run when contract changes

  const dayjsperiods = {
    DAILY: 'd',
    WEEKLY: 'w',
    MONTHLY: 'M',
    YEARLY: 'y',
  }

  function prevTimeWindow() {
    setCurrentTime(
      dayjs.max(dayjs(firstDataDate), currentTime.subtract(1, dayjsperiods[period])),
    )
  }

  function nextTimeWindow() {
    setCurrentTime(
      dayjs.min(dayjs(lastDataDate), currentTime.add(1, dayjsperiods[period])),
    )
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
            minDate={dayjs(firstDataDate)}
            maxDate={dayjs(lastDataDate)}
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
        <DownloadCsvButton
          productionData={productionData}
          contractName={contract}
          period={period}
          currentTime={currentTime}
        />
      </Box>

      <Box sx={{ position: 'relative' }}>
        {listLoading || (installations.length > 0 && productionLineData.length === 0) ? (
          <Box sx={{ position: 'absolute', inset: '0' }}>
            <Loading />
          </Box>
        ) : null}
        <Chart
          period={period}
          data={line ? (showProduction ? productionLineData : []) : productionBarData}
          legend={true}
          type={line ? LINE : BAR}
          lang={i18n?.language}
          displaced={true}
          step_mm={step_mm}
          compareData={showForeseen ? compareData : []}
        />
      </Box>
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
