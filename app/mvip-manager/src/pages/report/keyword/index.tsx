import React, { useState, useEffect } from 'react';
import { Row, Col, Divider } from 'antd';
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
          title: '关键词报表',
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
