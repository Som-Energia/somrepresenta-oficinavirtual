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

const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'
const YEARLY = 'YEARLY'

const LINE = 'LINE'
const BAR = 'BAR'

const ChartProductionData = () => {
  const [productionLineData, setProductionLineData] = useState([])
  const [productionBarData, setProductionBarData] = useState({})
  const [compareData, setCompareData] = useState([])
  const [line, setLine] = useState(true)
  const [contract, setContract] = useState(null)
  const [period, setPeriod] = useState(DAILY)
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
    ovapi.productionData().then((data) => {
      setProductionLineData(data)
      let transdormedData = transformBarChartData(data)
      setProductionBarData(transdormedData)
    })
  }

  useEffect(() => {
    getProductionData()
  }, [])

  return (
    <>
      <PageTitle Icon={QueryStatsIcon}>
        {t('PRODUCTION.PRODUCTION_TITLE')}

        {installations && (
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              marginTop: '1rem',
            }}
          >
            <FormControl size="small">
              <InputLabel id="contract-select-label">
                {t('PRODUCTION.LABEL_CONTRACT')}
              </InputLabel>
              <Select
                size="sm"
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
        )}
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
