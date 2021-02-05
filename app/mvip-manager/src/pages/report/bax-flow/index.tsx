import React, { useState, useEffect } from 'react'
import { Form, Select, Statistic, DatePicker, Button, Row, Col, Divider } from 'antd'

import MainTitle from '@/components/main-title'
import Query from '@/components/search-list'
import { LineChart } from '@/components/charts'
import { getPVData, getPVList } from '@/api/report'
import { flowConfig, pvListConfig } from './config'

import './index.less'

export default function KeyWordPage(props: any) {
  const [queryPVChartForm] = Form.useForm()
  const [queryShowChartForm] = Form.useForm()
  const [queryPVListForm] = Form.useForm()
  const [queryShowListForm] = Form.useForm()
  const [pvDataSource, setPVDataSource] = React.useState([])
  const [showDataSource, setShowDataSource] = React.useState([])
  const [pvChartOptions, setPVChartOptions] = useState({})
  const [showChartOptions, setShowChartOptions] = useState({})

  const queryPVChart = async (query: any) => {
    const { code, data } = await getPVData({ page: 1, size: 10 })
    if (code === 200) {
      const { result } = data
      setPVChartOptions(genChartOptions(result))
    }
  }
  const queryShowChart = async (query: any) => {
    const { code, data } = await getPVData({ page: 1, size: 10 })
    if (code === 200) {
      const { result } = data
      setShowChartOptions(genChartOptions(result))
    }
  }
  const queryPVList = async (query: any) => {
    const { code, data } = await getPVList(query)
    if (code === 200) {
      const { result } = data
      setPVDataSource(result)
    }
  }
  const queryShowList = async (query: any) => {
    const { code, data } = await getPVList(query)
    if (code === 200) {
      const { result } = data
      setShowDataSource(result)
    }
  }

  return (
    <div className='page-report page-report-bax-flow'>
      <MainTitle title="搜索通流量报表"/>
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
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={8} style={{ marginBottom: 24 }}>
            <Statistic title="总展现量" value={159232}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="近 15 天展现量" value={4168}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="近 30 天展现量" value={15021}/>
          </Col>
        </Row>
        <Divider />

        <h2>访问量统计（PV）</h2>
        <Query
          onQuery={queryPVChart}
          config={flowConfig({
            form: queryPVChartForm
          })}
        />
        <LineChart option={pvChartOptions} />
        <Divider />

        <h2>展现量统计</h2>
        <Query
          onQuery={queryShowChart}
          config={flowConfig({
            form: queryShowChartForm
          })}
        />
        <LineChart option={showChartOptions} />
        <Divider />

        <h2>访问明细</h2>
        <Query
          onQuery={queryPVList}
          config={pvListConfig({
            form: queryPVListForm,
            dataSource: pvDataSource
          })}
        />

        <h2>展现明细</h2>
        <Query
          onQuery={queryShowList}
          config={pvListConfig({
            form: queryShowListForm,
            dataSource: showDataSource
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
