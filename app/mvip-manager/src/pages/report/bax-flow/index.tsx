import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'antd'
import MainTitle from '@/components/main-title'
import CountTo from '../components/count-to'
import Query from '../components/search-list'
import { LineChart } from '../components/charts'
import { flowConfig, visitListConfig } from './config'
import {
  getBaxFlowOverview,
  getBaxFlowCharts,
  getBaxFlowVisitDetail,
  // getBaxFlowShowDetail
} from '@/api/report';
import {
  BaxFlowOverviewData,
  BaxFlowChartParams,
  BaxFlowChartData,
  BaxFlowDetailParams,
  FlowDetailData,
} from '@/interfaces/report'

import './index.less'
import Loading from '@/components/loading';

function genChartsOptions(data: BaxFlowChartData[]) {
  return [
    {
      xAxis : {
        type: 'category',
        data: data.map((x: BaxFlowChartData) => x.date)
      },
      series : [{
        type: 'bar',
        data: data.map((x: BaxFlowChartData) => x.visits),
      }]
    },
    {
      xAxis : {
        type: 'category',
        data: data.map((x: BaxFlowChartData) => x.date)
      },
      series : [{
        type: 'bar',
        data: data.map((x: BaxFlowChartData) => x.shows),
      }]
    }
  ]
}

function BaxFlowPage(props: any) {
  const [loading, setLoading] = useState<boolean>(false)
  const [overview, setOverview] = useState<BaxFlowOverviewData>()
  const [queryChartForm] = Form.useForm()
  const [chartsOptions, setChartsOptions] = useState([{},{}])
  const [queryVisitListForm] = Form.useForm()
  const [visitListData, setVisitListData] = useState<FlowDetailData[]>([])
  // const [queryShowListForm] = Form.useForm()
  // const [showListData, setShowListData] = useState<FlowDetailData[]>([])

  useEffect(() => {
    queryOverviewData()
  }, [])

  const queryOverviewData = async () => {
    setLoading(true)
    const { data } = await getBaxFlowOverview()
    setLoading(false)
    setOverview(data)
  }
  const queryChartData = async (query: BaxFlowChartParams) => {
    const { data } = await getBaxFlowCharts(query)
    setChartsOptions(genChartsOptions(data))
  }
  const queryVisitList = async (query: BaxFlowDetailParams) => {
    const { data } = await getBaxFlowVisitDetail(query)
    const { result } = data
    setVisitListData(result)
    return data
  }
  // const queryShowList = async (query: BaxFlowDetailParams) => {
  //   const { code, data } = await getBaxFlowShowDetail(query)
  //   if (code === SUCCESS) {
  //     const { result } = data
  //     setShowListData(result)
  //     return data
  //   }
  // }
  return (
    <div className='page-report page-report-bax-flow'>
      <MainTitle title="广告流量报表"/>
      <div className="container">
        { loading && <Loading/> }
        { !loading && <div>
          <div className="segment">
            <h2>概览</h2>
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
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title="总展现量" value={overview?.totalShows}/>
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="近 15 天展现量" value={overview?.last15DayShows}/>
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="近 30 天展现量" value={overview?.last30DayShows}/>
              </Col>
            </Row>
          </div>
          <div className="segment">
            <h2>访问量统计（PV）</h2>
            <Query
              onQuery={queryChartData}
              config={flowConfig({
                form: queryChartForm
              })}
            />
            <LineChart option={chartsOptions[0]} />
            <h2>展现量统计</h2>
            <LineChart option={chartsOptions[1]} />
          </div>
          <div className="segment">
            <h2>访问明细</h2>
            <Query
              onQuery={queryVisitList}
              config={visitListConfig({
                form: queryVisitListForm,
                dataSource: visitListData
              })}
            />
            {/* 暂时关闭展现明细的展示 */}
            {/* <h2>展现明细</h2>
          <Query
            onQuery={queryShowList}
            config={visitListConfig({
              form: queryShowListForm,
              dataSource: showListData
            })}
          /> */}
          </div>
        </div> }
      </div>
    </div>
  )
}

BaxFlowPage.wrappers = ['@/wrappers/report-auth']
export default BaxFlowPage
