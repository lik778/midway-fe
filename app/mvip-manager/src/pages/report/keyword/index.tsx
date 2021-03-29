import React, { useEffect, useState } from 'react'
import { Tooltip, Form, Row, Col, Divider } from 'antd'
import Loading from '@/components/loading'
import MainTitle from '@/components/main-title'
import Query from '../components/search-list'
import CountTo from '../components/count-to'
import { PieChart } from '../components/charts'
import { getKeywordOverview, getKeywordDetailList } from '@/api/report'
import {
  KeywordOverviewData,
  KeywordDetailListParams,
  KeywordDetailListData,
} from "@/interfaces/report"
import { keywordRankListConfig } from './config'
import { ReportProductType } from '@/enums/report'
import './index.less'

function genChartOptions(data: KeywordOverviewData) {
  const res = {
    color: [
      'rgba(9, 109, 217, .68)',
      'rgba(255, 11, 26, .68)',
    ],
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { fontSize: 18 }
    },
    series : [
      {
        name: '关键词',
        type: 'pie',
        radius : ['45%', '80%'],
        data:[
          { name: '广告', value: data?.searchTotal || 0 },
          { name: '快照', value: data?.mainTotal || 0 }
        ],
        label: { fontSize: 18 }
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

  const genMainTitle = (key: string) => {
    const tooltipsMap: any = {
      total: { name: '总关键词数', tips: '总关键词数包括快照（SEO）关键词数与广告（SEM）关键词数总和' },
      mainTotal: { name: '快照关键词数', tips: '快照（SEO）关键词数包括店铺、帖子等关键词总和。店铺仅2-180天内有创建过AI发文的才会统计关键词数。' },
      searchTotal: { name: '广告关键词数', tips: '广告（SEM）关键词总数包括凤鸣广告、标王广告、易慧推广告（SEM）关键词数总和。'  },
      yihuitui: { name: '易慧推广告关键词数', tips: '易慧推广告（SEM）关键词数仅含广告关键词，易慧推广告（SEM）总关键词请结合快照（SEO）关键词数一起分析。' }
    }
    const titleItem = tooltipsMap[key]
    return (<Tooltip placement="top"
        title={titleItem.tips}>
      <p style={{ marginBottom: 4 }}>{titleItem.name}
      <span className="tips">?</span>
      </p>
    </Tooltip>)
  }

  const queryOverviewData = async () => {
    setLoading(true)
    const { data } = await getKeywordOverview()
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
              （说明：关键词数据为7天内最新一次查询数据；快照数据包含店铺、帖子、问答；广告数据包含标王广告、凤鸣广告、易慧推广告。）</span></h2>
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title={genMainTitle('total')}
                 value={overview?.total} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title={genMainTitle('mainTotal')}
                 type={ReportProductType.CATE} value={overview?.mainTotal} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title={genMainTitle('searchTotal')}
                 value={overview?.searchTotal} />
              </Col>
            </Row>
            <Divider />
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title="标王广告关键词数" isSub={true} type={ReportProductType.BIAOWANG}
                   value={overview?.biaoWangKeyword} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="凤鸣广告关键词数" isSub={true} type={ReportProductType.FENGMING}
                   value={overview?.fengMingKeyword} />
              </Col>
              <Col className="statics" span={8}>
                <CountTo title={genMainTitle('yihuitui')} isSub={true} type={ReportProductType.YIHUITUI}
                   value={overview?.yiHuiTuiKeyword} />
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
                dataSource: detailListData
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
