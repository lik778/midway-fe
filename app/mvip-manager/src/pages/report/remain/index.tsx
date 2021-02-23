import React, { useState, useMemo } from 'react'
import { Row, Col, Statistic } from 'antd'

import MainTitle from '@/components/main-title'
import { FunnelChart } from '@/components/charts'
import { getRemainCapital } from '@/api/report'

import './index.less'

export default function KeyWordPage(props: any) {
  const [chartOptions, setChartOptions] = useState({})

  const queryRemainCapital = async () => {
    const { code, data } = await getRemainCapital({})
    if (code === 200) {
      const { all, filtered } = data
      setChartOptions(genChartOptions(all, filtered))
    }
  }

  useMemo(() => queryRemainCapital(), [])

  return (
    <div className='page-report page-report-remain'>
      <MainTitle title="留资报表"/>
      <div className="container">
        <div className="segment">
          <Row className="statics-con" gutter={16}>
            <Col className="statics" span={12} style={{ marginBottom: 16 }}>
              <Statistic title="询盘访客数" value={216}/>
            </Col>
            <Col className="statics" span={12}>
              <Statistic title="留资访客数" value={112}/>
            </Col>
          </Row>
        </div>
        <div className="segment">
          <FunnelChart option={chartOptions} />
        </div>
      </div>
    </div>
  )
}

function genChartOptions(all: number, filtered: number) {
  return {
    legend: {
      data: ['询盘访客数', '留咨访客数']
    },
    series: [
      {
        name: '询盘/留资转化图',
        type: 'funnel',
        maxSize: '70%',
        data: [
          {value: all, name: '询盘访客数'},
          {value: filtered, name: '留咨访客数'},
        ]
      }
    ]
  }
}
