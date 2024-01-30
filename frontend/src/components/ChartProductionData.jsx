import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Chart from '@somenergia/somenergia-ui/Chart'
import ovapi from '../services/ovapi'
import { Box } from '@mui/material'

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
  const [period, setPeriod] = useState(DAILY)
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
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={period}
          exclusive
          onChange={(event, value) => {
            setPeriod(value)
          }}
          aria-label="Platform"
        >
          <ToggleButton value={DAILY}>{t('CHART_PERIOD.DIARY')}</ToggleButton>
          <ToggleButton value={WEEKLY}>{t('CHART_PERIOD.WEEKLY')}</ToggleButton>
          <ToggleButton value={MONTHLY}>{t('CHART_PERIOD.MONTHLY')}</ToggleButton>
          <ToggleButton value={YEARLY}>{t('CHART_PERIOD.YEARLY')}</ToggleButton>
        </ToggleButtonGroup>

        <Grid container alignItems="center" sx={{ width: 'auto' }}>
          <Grid item>{t('CHART_PERIOD.BAR')}</Grid>
          <Grid item>
            <Switch
              checked={line}
              onChange={(event, value) => {
                setLine(value)
              }}
            />
          </Grid>
          <Grid item>{t('CHART_PERIOD.LINE')}</Grid>
        </Grid>
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
