import React from 'react';
import { Button, Divider, Row, Col } from 'antd';
import styles from './index.less';


export default (props: any) => {
  return (
    <div className={styles.container}>
      <Row>
        <Col span={4}>
          <img style={{ height: 162 }} src="//file.baixing.net/202011/a86b2b4d6907336443bacfff1e924e99.png"/>
        </Col>
        <Col span={6} style={{ marginLeft: 25 }}>
          <h4 style={{ fontSize: 18 }}>企业认证</h4>
          <ul style={{ paddingLeft: 20 }}>
            <li>适合公司（企业）或个体工商户</li>
            <li>需要认证营业执照</li>
            <li>特殊行业的经营许可证</li>
          </ul>
          <p className={styles.example}>例如：开锁行业需提供：公安备案； 搬家需提供：道路运输资质</p>
        </Col>
        <Col offset={4} span={9} style={{ marginTop: 60 }}>
            <Button type='primary'>去完成企业认证</Button>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={4}>
          <img style={{ height: 162 }} src="//file.baixing.net/202011/9ef06d895702344481e49e5d5a11f9bf.png"/>
        </Col>
        <Col span={6} style={{ marginLeft: 25 }}>
          <h4 style={{ fontSize: 18 }}>个人认证</h4>
          <ul style={{ paddingLeft: 20 }}>
            <li>适合个人商家</li>
            <li>需要认证身份证</li>
          </ul>
        </Col>
        <Col offset={4} span={9} style={{ marginTop: 60 }}>
          <Button type='primary'>去完成个人认证</Button>
        </Col>
      </Row>
    </div>

  );
}
