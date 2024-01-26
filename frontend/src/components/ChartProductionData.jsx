import React, { useState, useEffect } from 'react'
import Chart from '@somenergia/somenergia-ui/Chart'
import ovapi from '../services/ovapi'

import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'

import { useTranslation } from 'react-i18next'



// TODO: Check what times do we need
const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'
const YEARLY = 'YEARLY'

const LINE = 'LINE'
const BAR = 'BAR'


const ChartProductionData = () => {
  const [productionData, setProductionData] = useState([])
  const [compare, setCompare] = useState([])
  const [type, setType] = useState(LINE)
  const [period, setPeriod] = useState(DAILY)
  const { t, i18n } = useTranslation()

  const getProductionData = () => {
    ovapi.productionData().then((data) => {
      setProductionData(data)
    })
  }

  useEffect(() => {
    console.log('productionData', productionData)
  }, [productionData])

  useEffect(() => {
    getProductionData()
  }, [])

  return <>

<div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
    <ToggleButtonGroup
      color="primary"
      value={period}
      exclusive
      onChange={(event, value) => {
        setPeriod(value)
      }}
      aria-label="Platform"
    >
      <ToggleButton value={DAILY}>{t('CHART_PERIOD_DIARY')}</ToggleButton>
      <ToggleButton value={WEEKLY}>{t('CHART_PERIOD_WEEKLY')}</ToggleButton>
      <ToggleButton value={MONTHLY}>{t('CHART_PERIOD_MONTHLY')}</ToggleButton>
      <ToggleButton value={YEARLY}>{t('CHART_PERIOD_YEARLY')}</ToggleButton>
    </ToggleButtonGroup>

    <Grid component="label" container alignItems="center" spacing={1}>
      <Grid item>Line</Grid>
      <Grid item>
        <Switch
          checked={type}
          value={BAR}
          onChange={(event,value) => {
            setType(value)
          }}
        />
      </Grid>
      <Grid item>Bar</Grid>
    </Grid>
    </div>
    <Chart period={period} data={productionData} legend={true} type={type} lang={i18n.language} />
  </>

}
export default ChartProductionData
