import React, { useEffect, useState } from 'react';
import { Col, Divider, Form, Row, Statistic } from 'antd';
import MainTitle from '@/components/main-title';
import Query from '@/components/search-list';
import { PieChart } from '@/components/charts';
import { getKeywordRankList, getKeywordStatics, keywordDetailList, reportHealth } from '@/api/report';
import { keywordRankListConfig } from './config';

import './index.less';
import { BaxProductType, DisplayType, PlatformType } from '@/enums/report';

export default function KeyWordPage(props: any) {
  const [queryKeywordStaticsForm] = Form.useForm()
  const [queryKeywordRankForm] = Form.useForm()
  const [staticsDataSource, setStaticsDataSource] = React.useState([])
  const [chartOptions, setChartOptions] = useState({})

  useEffect( () => {
    (async () => {
      await keywordDetailList({
        device: DisplayType.MOBILE,
        pageNo: 0,
        pageSize: 0,
        platform: PlatformType.BAI_DU,
        product: BaxProductType.BIAO_WANG,
        user_id: 0
      })
      await reportHealth()
      const { code, data } = await getKeywordStatics(null)
      if (code === 200) {
        const {
          fm = 1,
          bw = 1,
          qc = 1,
          cate = 1
        } = data
        setChartOptions(genChartOptions({ fm, bw, qc, cate }))
      }
    })()
  }, [])

  const queryRankList = async (query: any) => {
    const { code, data } = await getKeywordRankList(query)
    if (code === 200) {
      const { result } = data
      setStaticsDataSource(result)
    }
  }

  return (
    <div className='page-report page-report-keyword'>
      <MainTitle title="关键词报表"/>
      <div className="container">
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={8} style={{ marginBottom: 24 }}>
            <Statistic title="凤鸣投放币" value={16888}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="标王投放币" value={16888}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="精品官网个数" value={16888}/>
          </Col>
        </Row>
        <Row className="statics-con" gutter={16} style={{ marginBottom: 24 }}>
          <Col className="statics" span={8}>
            <Statistic title="凤鸣投放关键词数" value={6}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="标王投放关键词数" value={6}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="易慧推投放关键词数" value={120}/>
          </Col>
        </Row>
        <Row className="statics-con" gutter={16} style={{ marginBottom: 24 }}>
          <Col className="statics" span={8}>
            <Statistic title="凤鸣关键词平均排名" value={6}/>
          </Col>
          <Col className="statics" span={8}>
            <Statistic title="标王关键词平均排名" value={6}/>
          </Col>
        </Row>
        <Divider />

        <h2>关键词统计</h2>
        <PieChart option={chartOptions} />
        <Divider />

        <h2>关键词排名明细</h2>
        <Query
          onQuery={queryRankList}
          config={keywordRankListConfig({
            form: queryKeywordRankForm,
            dataSource: staticsDataSource
          })}
        />
      </div>
    </div>
  )
}

function genChartOptions({ fm, bw, qc, cate }) {
  return {
    legend: {
      left: 'bottom',
      data: ['凤鸣','标王','易慧推','主营']
    },
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius : ['35%', '75%'],
        data:[
          {value:fm, name:'凤鸣'},
          {value:bw, name:'标王'},
          {value:qc, name:'易慧推'},
          {value:cate, name:'主营'}
        ],
      }
    ]
  }
}
