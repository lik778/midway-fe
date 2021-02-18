import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Divider } from 'antd'

import MainTitle from '@/components/main-title'
import CountTo from '@/components/count-to'
import Query from '@/components/search-list'
import { LineChart } from '@/components/charts'
import { flowConfig, pvListConfig } from './config'
import {
  getCateFlowOverview,
  getCateFlowChart,
  getCateFlowDetail
} from '@/api/report'
import {
  CateFlowOverviewData,
  CateFlowChartParams,
  CateFlowChartData,
  CateFlowDetailParams,
  FlowDetailData
} from '@/interfaces/report'

import './index.less'

const PageCateFlow: React.FC = (props: any) => {
  const [overview, setOverview] = useState<CateFlowOverviewData>()
  const [queryChartForm] = Form.useForm()
  const [chartOptions, setChartOptions] = useState({})
  const [queryListForm] = Form.useForm()
  const [flowListDataSource, setFlowListDataSource] = useState<FlowDetailData[]>([])

  useEffect(() => {
    queryOverviewData()
  }, [])

  const queryOverviewData = async () => {
    const { code, data } = await getCateFlowOverview()
    if (code === 200) {
      setOverview(data)
    }
  }
  const queryFlowList = async (query: CateFlowChartParams) => {
    const { code, data } = await getCateFlowChart(query)
    if (code === 200) {
      setChartOptions(genChartOptions(data))
    }
  }
  const queryPVList = async (query: CateFlowDetailParams) => {
    const { code, data } = await getCateFlowDetail(query)
    if (code === 200) {
      const { result } = data
      setFlowListDataSource(result)
    }
  }

  return (
    <div className='page-report page-report-cate-flow'>
      <MainTitle title="主营流量报表"/>
      <div className="container">
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={8}>
            <CountTo title="总访问量（PV）" value={overview?.totalVisits}/>
          </Col>
          <Col className="statics" span={8}>
            <CountTo title="近 15 天 PV" value={overview?.last15DayVisits}/>
          </Col>
          <Col className="statics" span={8}>
            <CountTo title="近 30 天 PV" value={overview?.last30DayVisits}/>
          </Col>
        </Row>
        <Divider />

        <h2>访问量统计（PV）</h2>
        <Query
          onQuery={queryFlowList}
          config={flowConfig({
            form: queryChartForm
          })}
        />
        <LineChart option={chartOptions} />
        <Divider />

        <h2>访问明细</h2>
        <Query
          onQuery={queryPVList}
          config={pvListConfig({
            form: queryListForm,
            dataSource: flowListDataSource
          })}
        />
      </div>
    </div>
  )
}

function genChartOptions(data: CateFlowChartData[]) {
  return {
    xAxis : {
      type: 'category',
      data: data.map((x: any) => x.date)
    },
    series : [{
      type: 'bar',
      data: data.map((x: any) => x.visits),
    }]
  }
}

export default PageCateFlow
