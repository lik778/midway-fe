import React, { useEffect, useState, useMemo } from 'react'
import { Form, Row, Col, Divider } from 'antd'

import MainTitle from '@/components/main-title'
import Query from '@/components/search-list'
import CountTo from '@/components/count-to'
import { PieChart } from '@/components/charts'
import { SUCCESS, getKeywordOverview, getKeywordDetailList } from '@/api/report'
import {
  KeywordOverviewData,
  KeywordDetailListParams,
  KeywordDetailListData,
} from "@/interfaces/report"
import { keywordRankListConfig } from './config'

import './index.less'

export default function KeyWordPage(props: any) {
  const [overview, setOverview] = useState<KeywordOverviewData>()
  const [chartOptions, setChartOptions] = useState({})
  const [queryKeywordDetailForm] = Form.useForm()
  const [detailListData, setDetailListData] = useState<KeywordDetailListData[]>([])

  useEffect(() => {
    queryOverviewData()
  }, [])

  const queryOverviewData = async () => {
    const { code, data } = await getKeywordOverview()
    if (code === SUCCESS) {
      setOverview(data)
      setChartOptions(genChartOptions(data))
    }
  }
  const queryDetailList = async (query: KeywordDetailListParams) => {
    const { code, data } = await getKeywordDetailList(query)
    if (code === SUCCESS) {
      const { result } = data
      setDetailListData(result)
      return data
    }
  }

  return (
    <div className="page-report page-report-keyword">
      <MainTitle title="关键词报表" />
      <div className="container">
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={8}>
            <CountTo title="排名关键词总数" value={overview?.total} />
          </Col>
          <Col className="statics" span={8}>
            <CountTo title="主营关键词总数" value={overview?.mainTotal} />
          </Col>
          <Col className="statics" span={8}>
            <CountTo title="搜索通关键词总数" value={overview?.semTotal} />
          </Col>
        </Row>
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={8}>
            <CountTo title="标王投放关键词数" value={overview?.distributionDetail?.biaoWang} />
          </Col>
          <Col className="statics" span={8}>
            <CountTo title="凤鸣投放关键词数" value={overview?.distributionDetail?.fengMing} />
          </Col>
          <Col className="statics" span={8}>
            <CountTo title="易慧推投放关键词数" value={overview?.distributionDetail?.yiHuiTui} />
          </Col>
        </Row>
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={8}>
            <CountTo title="标王关键词平均排名" value={overview?.rankingDetail?.biaoWang} />
          </Col>
          <Col className="statics" span={8}>
            <CountTo title="凤鸣关键词平均排名" value={overview?.rankingDetail?.fengMing} />
          </Col>
        </Row>
        <Divider />

        <h2>关键词统计</h2>
        <PieChart option={chartOptions} />
        <Divider />

        <h2>关键词排名明细</h2>
        <Query
          onQuery={queryDetailList}
          config={keywordRankListConfig({
            form: queryKeywordDetailForm,
            dataSource: detailListData,
          })}
        />
      </div>
    </div>
  )
}

// 生成饼图所需数据，数据缺失时，默认值需要为1，因为为0时数据不会展示在图中
function genChartOptions(data: KeywordOverviewData) {
  return {
    legend: {
      left: 'bottom',
      data: ['凤鸣','标王','易慧推','主营']
    },
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius : ['45%', '85%'],
        data:[
          {
            name: '凤鸣',
            value: data?.distributionDetail?.fengMing || 1
          },
          {
            name: '标王',
            value: data?.distributionDetail?.biaoWang || 1
          },
          {
            name: '易慧推',
            value: data?.distributionDetail?.yiHuiTui || 1
          },
          {
            name: '主营',
            value: data?.distributionDetail?.main || 1
          }
        ],
      }
    ]
  }
}
