import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Form, Input, Button, Row, Col, Divider } from 'antd';

import LineChart from '@/components/charts/line-chart';
import { getPVData } from '@/api/report';

import './index.less';

type LayoutType = Parameters<typeof Form>[0]['layout'];

// get ready to update to echarts@5
// https://github.com/hustcc/echarts-for-react/issues/388

export default function IndexPage() {
  const [formConfig] = useState({ time: [] })
  const [formLoading, setFormLoading] = React.useState<boolean>(false)
  const [lineOptions, setLineOptions] = useState({})

  useEffect(() => {
    (async () => {
      setFormLoading(true)
      const { code, data } = await getPVData({ page: 1, size: 10 })
      if (code === 200) {
        const { result } = data
        setLineOptions(composeOptions({
          title: 'asdfasdf',
          result
        }))
      }
      setFormLoading(false)
    })()
  },[])

  return (
    <div className="page">
      <Row className="statics-con" gutter={16}>
        <Col className="statics" span={3} />
        <Col className="statics" span={7}>
          <span className="num">16888</span>
          <span className="num-label">凤鸣投放币</span>
        </Col>
        <Col className="statics" span={7}>
          <span className="num">16888</span>
          <span className="num-label">标王投放币</span>
        </Col>
        <Col className="statics" span={7}>
          <span className="num">16888</span>
          <span className="num-label">精品官网个数</span>
        </Col>
      </Row>
      <Row className="statics-con" gutter={16}>
        <Col className="statics-label" span={3}>
          <span>投放关键词数：</span>
        </Col>
        <Col className="statics" span={7}>
          <span className="num">6</span>
          <span className="num-label">凤鸣</span>
        </Col>
        <Col className="statics" span={7}>
          <span className="num">7</span>
          <span className="num-label">标王</span>
        </Col>
        <Col className="statics" span={7}>
          <span className="num">120</span>
          <span className="num-label">易慧推</span>
        </Col>
      </Row>
      <Row className="statics-con" gutter={16}>
        <Col className="statics-label" span={3}>
          <span>关键词平均排名：</span>
        </Col>
        <Col className="statics" span={7}>
          <span className="num">6</span>
          <span className="num-label">凤鸣</span>
        </Col>
        <Col className="statics" span={7}>
          <span className="num">7</span>
          <span className="num-label">标王</span>
        </Col>
      </Row>
      <Divider />
      <LineChart option={lineOptions} />
      <Divider />
      {/* <LineChart option={lineOptions} /> */}
    </div>
  );
}

function composeOptions(data) {
  const {title, result} = data
  return {
    title: {
      text: title
    },
    xAxis : {
      type: 'category',
      data: result.map(x => x.date)
    },
    yAxis : {
      type : 'value'
    },
    series : [{
      data: result.map(x => x.pv),
      type: 'bar',
    }]
  }
}
