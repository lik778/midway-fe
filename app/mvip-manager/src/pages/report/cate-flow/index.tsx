import React, { useState, useEffect } from 'react'
import { Form, Select, Statistic, DatePicker, Button, Row, Col, Divider } from 'antd'

import MainTitle from '@/components/main-title'
import Query from '@/components/search-list'
import { LineChart } from '@/components/charts'
import { getPVData, getPVList } from '@/api/report'
import { flowConfig, pvListConfig } from './config'

import './index.less'

export default function KeyWordPage(props: any) {
  const [queryFlowForm] = Form.useForm()
  const [queryPVForm] = Form.useForm()
  const [pvDataSource, setPVDataSource] = React.useState([])
  const [chartOptions, setChartOptions] = useState({})

  const queryFlowList = async (query: any) => {
    const { code, data } = await getPVData({ page: 1, size: 10 })
    if (code === 200) {
      const { result } = data
      setChartOptions(genChartOptions(result))
    }
  }

  const queryPVList = async (query: any) => {
    const { code, data } = await getPVList(query)
    if (code === 200) {
      const { result } = data
      setPVDataSource(result)
    }
  }

  return (
    <div className='page-report page-report-cate-flow'>
      <MainTitle title="主营流量报表"/>
      <div className="container">
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={8} style={{ marginBottom: 24 }}>
            <Statistic title="总访问量（PV）" value={98712}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="近 15 天 PV" value={2342}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="近 30 天 PV" value={4785}/>
          </Col>
        </Row>
        <Divider />

        <h2>访问量统计（PV）</h2>
        <Query
          onQuery={queryFlowList}
          config={flowConfig({
            form: queryFlowForm
          })}
        />
        <LineChart option={chartOptions} />
        <Divider />

        <h2>访问明细</h2>
        <Query
          onQuery={queryPVList}
          config={pvListConfig({
            form: queryPVForm,
            dataSource: pvDataSource
          })}
        />
      </div>
    </div>
  )
}

function genChartOptions(result: any) {
  return {
    xAxis : {
      type: 'category',
      data: result.map((x: any) => x.date)
    },
    series : [{
      data: result.map((x: any) => x.pv),
      type: 'bar',
    }]
  }
}
