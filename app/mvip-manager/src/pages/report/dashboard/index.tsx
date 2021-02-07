import React from 'react';
import MainTitle from '@/components/main-title';
import { Col, Divider, Row } from 'antd';
import CountTo from '@/components/count-to';

export default (props: any) => {
  return <div className='page-report page-report-keyword'>
      <MainTitle title="总览"/>
      <div className="container">
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
        <Divider />
        <div className="section">

        </div>
      </div>
    </div>
}
