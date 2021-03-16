import React, { useState } from 'react'
import { Form, Statistic, Row, Col, Divider } from 'antd'

import MainTitle from '@/components/main-title'
import Query from '@/components/search-list'
import { LineChart } from '@/components/charts'
import { getPublishData, getPublishDetails } from '@/api/report'
import { publishConfig, publishListConfig } from './config'
import './index.less'

function genChartOptions(result: any) {
  return {
    xAxis : {
      type: 'category',
      data: result.map((x: any) => x.date)
    },
    series : Array(result[0].counts.length).fill('').map((_, i) => ({
      data: result.map((x: any) => x.counts[i]),
      type: 'bar'
    }))
  }
}

function CatePublishPage(props: any) {
  const [queryFlowForm] = Form.useForm()
  const [queryPVForm] = Form.useForm()
  const [pvDataSource, setPVDataSource] = React.useState([])
  const [chartOptions, setChartOptions] = useState({})

  const queryPublish = async (query: any) => {
    const { code, data } = await getPublishData({ page: 1, size: 10 })
    if (code === 200) {
      const { result } = data
      setChartOptions(genChartOptions(result))
    }
  }

  const queryPublishDetails = async (query: any) => {
    const { code, data } = await getPublishDetails(query)
    if (code === 200) {
      const { result } = data
      setPVDataSource(result)
    }
  }

  return (
    <div className='page-report page-report-cate-flow'>
      <MainTitle title="发布报表"/>
      <div className="container">
        <div className="segment">
          <Row className="statics-con" gutter={16}>
            <Col className="statics" span={6}>
              <Statistic title="总访问量（PV）" value={98712}/>
            </Col>
            <Col className="statics" span={1}>
              <Divider type='vertical' />
            </Col>
            <Col className="statics" span={4}>
              <Statistic title="总帖子数" value={10514}/>
            </Col>
            <Col className="statics" span={4}>
              <Statistic title="总问答数" value={1129}/>
            </Col>
            <Col className="statics" span={4}>
              <Statistic title="总店铺文章数" value={6610}/>
            </Col>
            <Col className="statics" span={4}>
              <Statistic title="总店铺产品数" value={13}/>
            </Col>
          </Row>
        </div>
        <div className="segment">
          <h2>发布统计</h2>
          <Query
            onQuery={queryPublish}
            config={publishConfig({
              form: queryFlowForm
            })}
          />
          <LineChart option={chartOptions} />
        </div>
        <div className="segment">
          <h2>发布明细</h2>
          <Query
            onQuery={queryPublishDetails}
            config={publishListConfig({
              form: queryPVForm,
              dataSource: pvDataSource
            })}
          />
        </div>
      </div>
    </div>
  )
}

CatePublishPage.wrappers = ['@/wrappers/report-auth']

export default CatePublishPage
