import React, { useState, useEffect } from 'react';
import { Row, Col, Statistic, Divider } from 'antd';
import LineChart from '@/components/charts/line-chart';
import { getPVData } from '@/api/report';
import MainTitle from '@/components/main-title';
import './index.less';

export default (props: any) => {
  const [lineOptions, setLineOptions] = useState({})

  useEffect(() => {
    (async () => {
      const { code, data } = await getPVData({ page: 1, size: 10 })
      if (code === 200) {
        const { result } = data
        setLineOptions(composeOptions({
          title: '关键词',
          result
        }))
      }
    })()
  },[])

  return (
    <div>
      <MainTitle title="关键词报表"/>
      <div className="page container">
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={7} style={{ marginBottom: 16 }}>
            <Statistic title="凤鸣投放币" value={16888}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="标王投放币" value={16888}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="精品官网个数" value={16888}/>
          </Col>
        </Row>
        <Row className="statics-con" gutter={16} style={{ marginBottom: 16 }}>
          <Col className="statics" span={7}>
            <Statistic title="凤鸣投放关键词数" value={6}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="标王投放关键词数" value={6}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="易慧推投放关键词数" value={120}/>
          </Col>
        </Row>
        <Row className="statics-con" gutter={16} style={{ marginBottom: 16 }}>
          <Col className="statics" span={7}>
            <Statistic title="凤鸣关键词平均排名" value={6}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="标王关键词平均排名" value={6}/>
          </Col>
        </Row>
        <Divider />
        <LineChart option={lineOptions} />
        <Divider />
        {/* <LineChart option={lineOptions} /> */}
      </div>
    </div>
  );
}

function composeOptions(data: any) {
  const {title, result} = data
  return {
    title: {
      text: title
    },
    xAxis : {
      type: 'category',
      data: result.map((x: any) => x.date)
    },
    yAxis : {
      type : 'value'
    },
    series : [{
      data: result.map((x: any) => x.pv),
      type: 'bar',
    }]
  }
}
