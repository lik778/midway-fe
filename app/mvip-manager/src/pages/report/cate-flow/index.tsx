import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'antd'

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
import Loading from '@/components/loading';

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

function PageCateFlow(props: any) {
  const [loading, setLoading] = useState<boolean>(false)
  const [overview, setOverview] = useState<CateFlowOverviewData>()
  const [queryChartForm] = Form.useForm()
  const [chartOptions, setChartOptions] = useState({})
  const [queryListForm] = Form.useForm()
  const [flowListDataSource, setFlowListDataSource] = useState<FlowDetailData[]>([])

  useEffect(() => {
    queryOverviewData()
  }, [])

  const queryOverviewData = async () => {
    setLoading(true)
    const { data } = await getCateFlowOverview()
    setLoading(false)
    setOverview(data)
  }

  const queryFlowList = async (query: CateFlowChartParams) => {
    const { data } = await getCateFlowChart(query)
    setChartOptions(genChartOptions(data))
  }

  const queryPVList = async (query: CateFlowDetailParams) => {
    const { data } = await getCateFlowDetail(query)
    const { result } = data
    setFlowListDataSource(result)
    return data
  }

  return (
    <div className="page-report page-report-cate-flow">
      <MainTitle title="主站流量报表" />
      <div className="container">
        { loading && <Loading/> }
        { !loading && <div>
            <div className="segment">
              <h2>概览</h2>
              <Row className="statics-con" gutter={16}>
                <Col className="statics" span={8}>
                  <CountTo title="总访问量（PV）" value={overview?.totalVisits} />
                </Col>
                <Col className="statics" span={8}>
                  <CountTo title="近 15 天 PV" value={overview?.last15DayVisits} />
                </Col>
                <Col className="statics" span={8}>
                  <CountTo title="近 30 天 PV" value={overview?.last30DayVisits} />
                </Col>
              </Row>
            </div>
            <div className="segment">
              <h2>访问量统计（PV）</h2>
              <Query
                onQuery={queryFlowList}
                config={flowConfig({
                  form: queryChartForm,
                })}
              />
              <LineChart option={chartOptions} />
            </div>
            <div className="segment">
              <h2>访问明细</h2>
              <Query
                onQuery={queryPVList}
                config={pvListConfig({
                  form: queryListForm,
                  dataSource: flowListDataSource,
                })}
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
}

PageCateFlow.wrappers = ['@/wrappers/report-auth']
export default PageCateFlow
