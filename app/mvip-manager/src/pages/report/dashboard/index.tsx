import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import MainTitle from '@/components/main-title';
import { Col, Row } from 'antd';
import CountTo from '@/components/count-to';
import { PieChart, LineChart } from '@/components/charts';
import { getPublishData } from '@/api/report';
import './index.less';

function genChartOptions({ fm, bw, qc, cate }: any) {
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
          { value:fm, name:'凤鸣', },
          { value:bw, name:'标王' },
          { value:qc, name:'易慧推' },
          { value:cate, name:'主营' }
        ],
      }
    ]
  }
}

function genLineChartOptions(result: any) {
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

function genPublishChartOptions(result: any) {
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

interface TitleProps { value: number; type: string }
const Title = ({ value, type }: TitleProps) => {
  interface Item { title: string; subTitle: string; link: string }
  interface Config { [key: string]: Item; }
  const config: Config = {
    keyword: { title: '排名关键词数：', subTitle: '总关键词数：', link: '/report/keyword' },
    pv: { title: '流量：', subTitle: '总PV：', link: '/report/cate-flow' },
    publish: { title: '发布数：', subTitle: '总发布数：', link: '/report/cate-publish' }
  }
  const item  = config[type]
  if (!item) return null;
  return <h3 className="report-dashboard-section-title">
      <span>{item.subTitle}<strong>{value}</strong></span>
      <Link className="link" target="_blank" to={item.link}>&nbsp;&nbsp;查看详细></Link>
   </h3>
}

export default (props: any) => {
  const [chartOptions, setChartOptions] = useState({})
  const [pvChartOptions, setPVChartOptions] = useState({})
  const [publishChartOptions, setPublishChartOptions] = useState({})
  useEffect(() => {
    setChartOptions(genChartOptions({ fm: 1, bw: 2, qc: 3, cate: 4 }));
    (async () => {
      const publishData = await getPublishData({ page: 1, size: 10 })
      if (publishData.code === 200) {
        const { result } = publishData.data
        setPublishChartOptions(genPublishChartOptions(result))
      }
    })()
  }, [])
  return <div className='page-report page-report-keyword'>
      <MainTitle title="总览"/>
      <div className="container">
        <div className="segment">
          <h2>账户信息</h2>
          <Row className="statics-con" gutter={16}>
            <Col className="statics" span={6}>
              <CountTo title="总关键词数" value={98712}/>
            </Col>
            <Col className="statics" span={6}>
              <CountTo title="总PV" value={2342}/>
            </Col>
            <Col className="statics" span={6}>
              <CountTo title="总PV" value={112}/>
            </Col>
            <Col className="statics" span={6}>
              <CountTo title="总发布数" value={112}/>
            </Col>
          </Row>
          <Row className="statics-con" gutter={16}>
            <Col className="statics" span={6}>
              <CountTo title="主营关键词总数" value={1638}/>
            </Col>
            <Col className="statics" span={6}>
              <CountTo title="标王关键词数" value={7}/>
            </Col>
            <Col className="statics" span={6}>
              <CountTo title="凤鸣关键词数" value={6}/>
            </Col>
            <Col className="statics" span={6}>
              <CountTo title="易慧推关键词数" value={1200}/>
            </Col>
          </Row>
        </div>
        <div className="segm">
          <Row className="section">
            <Col span={12}>
              <Title value={2851} type="keyword" />
              <PieChart option={chartOptions} />
            </Col>
            <Col span={12}>
              <Title value={99993} type="pv" />
              <LineChart option={pvChartOptions} />
            </Col>
          </Row>
        </div>
        <div className="segment">
          <Row className="section">
            <Col span={24}>
              <Title value={99993} type="publish" />
              <LineChart option={publishChartOptions} />
            </Col>
          </Row>
        </div>
      </div>
    </div>
}
