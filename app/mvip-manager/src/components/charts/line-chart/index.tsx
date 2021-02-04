import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'

const defaultOptions = {
  title: {
    text: '',
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  yAxis: [],
  xAxis: [],
  legend: [],
  series: []
}


export default (props: any) => {
  const { option } = props
  const [washedOptions, setWashedOptions] = useState(null)

  useEffect(() => {
    const opts = Object.assign({}, defaultOptions)
    const washed = Object.assign(opts, option)
    setWashedOptions(washed)
  }, [option])

  return <>
    {washedOptions && (
      <ReactEcharts
        option={washedOptions}
        style={{ height: '350px', width: '100%' }}
        className='react_for_echarts'
      />
    )}
  </>
}
