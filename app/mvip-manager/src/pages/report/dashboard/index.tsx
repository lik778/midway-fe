import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { Link } from 'umi';
import MainTitle from '@/components/main-title';
import Loading from '@/components/loading';
import CountTo from '@/components/count-to';
import { PieChart, LineChart } from '@/components/charts';
import { getSummaryFlowData, getSummaryOverviewData } from '@/api/report';
import { FlowChartData, SummaryOverviewData } from '@/interfaces/report';
import { ReportProductType } from '@/enums/report';
import { notInIframe } from '@/utils';

function genChartOptions({ fm, bw, qc, cate }: any) {
  return {
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
          { value: fm || 0, name:'凤鸣', },
          { value: bw || 0, name:'标王' },
          { value: qc || 0, name:'易慧推' },
          { value: cate || 0, name:'VIP产品' }
        ],
        label: { fontSize: 16 }
      }
    ]
  }
}

function genLineChartOptions(result: FlowChartData[]) {
  return {
    xAxis : {
      type: 'category',
      data: result.map((x: FlowChartData) => x.date),
    },
    series : [{
      data: result.map((x: FlowChartData) => x.visits),
      type: 'bar',
    }]
  }
}

const Title = ({ type }: { type: string }) => {
  const config: { [key: string]: { title: string; link: string } } = {
    keyword: { title: '总关键词统计', link: '/report/keyword' },
    pv: { title: '总访问量统计', link: '/report/bax-flow' },
    publish: { title: '发布数', link: '/report/cate-publish' }
  }
  const item  = config[type]
  if (!item) return null;
  return <h2>
      <span>{ item.title }</span>
      { notInIframe() && <Link style={{ fontSize: 14, color: '#096DD9' }} to={ item.link }>(查看详细)</Link> }
   </h2>
}

function DashboardPage(props: any) {
  const [loading, setLoading] = useState<boolean>(false)
  const [overview, setOverview] = useState<SummaryOverviewData>()
  const [chartOptions, setChartOptions] = useState({})
  const [pvChartOptions, setPVChartOptions] = useState({})
  useEffect(() => {
    (async function() {
      setLoading(true)
      const summaryOverviewData = await getSummaryOverviewData();
      const summaryFlowData = await getSummaryFlowData();
      setLoading(false)
      const { data: { fengMingKeyword, biaoWangKeyword, mainTotalKeyword, yiHuiTuiKeyword } } = summaryOverviewData
      setOverview(summaryOverviewData.data)
      setPVChartOptions(genLineChartOptions(summaryFlowData.data))
      setChartOptions(genChartOptions({
        fm: fengMingKeyword, bw: biaoWangKeyword, qc: yiHuiTuiKeyword, cate: mainTotalKeyword }));
    }())
  }, [])

  return <div className='page-report page-report-keyword'>
      { notInIframe() &&<MainTitle title="总览"/> }
      <div className="container">
        { loading && <Loading/> }
        { !loading && <div>
          <div className="segment">
            <h2>账户信息<span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
              （说明：关键词数据每周更新一次；VIP产品数据包含店铺、帖子、问答；搜索通数据包含标王、凤鸣、易慧推。）</span></h2>
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title="总关键词数" value={overview?.totalKeyword}/>
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="总PV" value={overview?.totalVisits}/>
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="VIP产品关键词数" type={ReportProductType.CATE} value={overview?.mainTotalKeyword}/>
              </Col>
            </Row>
            <Row className="statics-con" gutter={16}>
              <Col className="statics" span={8}>
                <CountTo title="标王关键词数" type={ReportProductType.BIAOWANG} value={overview?.biaoWangKeyword}/>
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="凤鸣关键词数" type={ReportProductType.FENGMING} value={overview?.fengMingKeyword}/>
              </Col>
              <Col className="statics" span={8}>
                <CountTo title="易慧推关键词数" type={ReportProductType.YIHUITUI} value={overview?.yiHuiTuiKeyword}/>
              </Col>
            </Row>
          </div>
          <div className="segment">
            <Title type="keyword" />
            <PieChart option={chartOptions} />
          </div>
          <div className="segment">
            <Title type="pv" />
            <LineChart option={pvChartOptions} />
          </div>
        </div> }
      </div>
    </div>
}

DashboardPage.wrappers = ['@/wrappers/report-auth']

export default DashboardPage
