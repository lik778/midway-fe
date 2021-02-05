import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'

import './index.less'

// TODO split config info files

const color = [
  'rgba(9, 109, 217, .68)',
  'rgba(21, 9, 217, .68)',
  'rgba(128, 9, 217, .68)',
  'rgba(255, 11, 26, .68)',
  'rgba(255, 148, 11, .68)',
  'rgba(255, 197, 11, .68)',
  'rgba(37, 222, 9, .68)',
]

const toolbox = {
  feature: {
    restore: {},
    saveAsImage: {}
  }
}

const lineOptions = {
  color,
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    top: '15px',
    left: '20px',
    right: '35px',
    bottom: '0',
    containLabel: true
  },
  yAxis: {
    type: 'value'
  },
  xAxis: {
    type: 'value'
  },
  legend: [],
  series: []
}

const funnelOptions = {
  color,
  toolbox,
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c}%"
  },
  series: []
}

const pieOptions = {
  color,
  tooltip : {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  }
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

export function FunnelChart(props: any) {
  const extendProps = { ...props, defaultOptions: funnelOptions }
  return <Chart {...extendProps} />
}

export function PieChart(props: any) {
  const extendProps = { ...props, defaultOptions: pieOptions }
  return <Chart {...extendProps} />
}
