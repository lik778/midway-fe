import React, { useEffect, useState } from 'react'
import { Form, Row, Col } from 'antd'

import MainTitle from '@/components/main-title'
import Query from '@/components/search-list'
import CountTo from '@/components/count-to'
import { PieChart } from '@/components/charts'
import { getKeywordOverview, getKeywordDetailList } from '@/api/report'
import {
  KeywordOverviewData,
  KeywordDetailListParams,
  KeywordDetailListData,
} from "@/interfaces/report"
import { keywordRankListConfig } from './config'
import './index.less'
import { ReportProductType } from '@/enums/report';
import Loading from '@/components/loading';

function genChartOptions(data: KeywordOverviewData) {
  const res = {
    legend: {
      left: 'bottom',
      data: ['凤鸣','标王','易慧推','VIP产品']
    },
    series : [
      {
        name: '关键词',
        type: 'pie',
        radius : ['45%', '80%'],
        data:[
          { name: '凤鸣', value: data?.fengMingKeyword || 0 },
          { name: '标王', value: data?.biaoWangKeyword || 0 },
          { name: '易慧推', value: data?.yiHuiTuiKeyword || 0 },
          { name: 'VIP产品', value: data?.mainTotal || 0 }
        ],
        label: { fontSize: 16 }
      }
    ]
  }
  /* 优化值为 0 时的显示效果 */
  const totalZero = res.series[0].data.reduce((h, c) => h + c.value, 0) === 0
  if (!totalZero) {
    res.series[0].data = res.series[0].data.filter(x => x.value > 0)
  }
  return res
}

function KeyWordPage(props: any) {
  const [loading, setLoading] = useState<boolean>(false)
  const [overview, setOverview] = useState<KeywordOverviewData>()
  const [chartOptions, setChartOptions] = useState({})
  const [queryKeywordDetailForm] = Form.useForm()
  const [detailListData, setDetailListData] = useState<KeywordDetailListData[]>([])

  useEffect(() => {
    queryOverviewData()
  }, [])

  const queryOverviewData = async () => {
    setLoading(true)
    const { code, data } = await getKeywordOverview()
    setLoading(false)
    setOverview(data)
    setChartOptions(genChartOptions(data))
  }

  const queryDetailList = async (query: KeywordDetailListParams) => {
    const { data } = await getKeywordDetailList(query)
    const { result } = data
    setDetailListData(result)
    return data
  }

  return (
    <div className="page-report page-report-keyword">
      <MainTitle title="关键词报表" />
      <div className="container">
        { loading && <Loading/> }
        { !loading && <div>
          <div className="segment">
            <h2>概览<span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
              （说明：关键词数据每周更新一次。）</span></h2>
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title="排名关键词总数" value={overview?.total} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="VIP产品关键词总数" type={ReportProductType.CATE} value={overview?.mainTotal} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="搜索通关键词总数" value={overview?.searchTotal} />
              </Col>
            </Row>
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title="标王投放关键词数" type={ReportProductType.BIAOWANG} value={overview?.biaoWangKeyword} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="凤鸣投放关键词数" type={ReportProductType.FENGMING} value={overview?.fengMingKeyword} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="易慧推投放关键词数" type={ReportProductType.YIHUITUI} value={overview?.yiHuiTuiKeyword} />
              </Col>
            </Row>
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title="标王关键词平均排名" value={overview?.biaoWangRanking} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="凤鸣关键词平均排名" value={overview?.fengMingRanking} />
              </Col>
            </Row>
          </div>
          <div className="segment">
            <h2>关键词统计</h2>
            <PieChart option={chartOptions} />
          </div>
          <div className="segment">
            <h2>关键词排名明细</h2>
            <Query
              onQuery={queryDetailList}
              config={keywordRankListConfig({
                form: queryKeywordDetailForm,
                dataSource: detailListData,
              })}
            />
          </div>
        </div> }
      </div>
    </div>
  )
}

KeyWordPage.wrappers = ['@/wrappers/report-auth']
export default KeyWordPage
