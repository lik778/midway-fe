import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'

import './index.less'

const lineOptions = {
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

export default function Chart (props: any) {
  const { option, defaultOptions } = props
  const [washedOptions, setWashedOptions] = useState(null)

  useEffect(() => {
    const opts = Object.assign({}, defaultOptions)
    const washed = Object.assign(opts, option)
    setWashedOptions(washed)
  }, [option])

  return <>
    {washedOptions && (
      <ReactEcharts
        className="react-echarts"
        option={washedOptions}
      />
    )}
  </>
}

export function LineChart(props: any) {
  const extendProps = { ...props, defaultOptions: lineOptions }
  return <Chart {...extendProps} />
}
