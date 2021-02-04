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
    top: '40px',
    left: '20px',
    right: '40px',
    bottom: '0',
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
