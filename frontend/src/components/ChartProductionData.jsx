import React, { useState, useEffect } from 'react'
import Chart from '@somenergia/somenergia-ui/Chart'

import ovapi from '../services/ovapi'

// TODO: Check what times do we need
// const DAY = 'DAY'
// const MONTH = 'MONTH'
// const YEAR = 'YEAR'

const ChartProductionData = () => {
  const [productionData, setProductionData] = useState([])
  const [compare, setCompare] = useState([])
  const [mode, setMode] = useState(null)

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

  return <Chart period={'DAILY'} data={productionData} legend={true} type={'LINE'} />
}
export default ChartProductionData
