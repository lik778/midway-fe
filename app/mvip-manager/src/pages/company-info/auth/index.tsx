import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Row } from 'antd';
import MainTitle from '../../../components/main-title';
import './index.less';
import { getUserVerifyListApi } from '@/api/user';
import { VerifyStatus, VerifyType } from '@/enums';


export default (props: any) => {
  const [companyVerifyStatus, setCompanyVerifyStatus] = useState<VerifyStatus>(VerifyStatus.DEFAULT);
  const [userVerifyStatus, setUserVerifyStatus] = useState<VerifyStatus>(VerifyStatus.DEFAULT);

  useEffect(() => {
    (async () => {
      const res = await getUserVerifyListApi()
      if (res.success) {
        res.data.forEach(x => {
          if (x.verifyRequestType === VerifyType.LICENCE) {
            setCompanyVerifyStatus(x.status)
          } else if (x.verifyRequestType === VerifyType.IDCARD) {
            setUserVerifyStatus(x.status)
          }
        })
      }
    })()
  }, [])

  const actionButton = (status: VerifyStatus, name: string) => {
    if (status === VerifyStatus.ACCEPT) {
      return <Button type='primary' disabled>已完成{name}</Button>
    } else if (status === VerifyStatus.PENDING) {
      return <Button type='primary' disabled>审核中</Button>
    } else if (status === VerifyStatus.REFUSE || status === VerifyStatus.REVOKE || status === null) {
      // 这里先默认写死一下
      // http://wulei.baixing.cn/bind/#bindList
      return <Button href="https://www.baixing.com/bind/#bindList" type='primary'>去完成{name}</Button>
    } else if (status === VerifyStatus.DEFAULT) {
      return null
    }
  }
  return (
    <div>
      <MainTitle title="认证资料"/>
      <div className="container">
        <Row className="auth-box">
          <Col span={10} className="auth-item">
            <img src="//file.baixing.net/202011/a86b2b4d6907336443bacfff1e924e99.png"/>
            <div style={{ marginLeft: 203 }}>
              <h4 style={{ fontSize: 18 }}>企业认证</h4>
              <ul style={{ paddingLeft: 0 }}>
                <li><span className="point"></span>适合公司（企业）或个体工商户</li>
                <li><span className="point"></span>需要认证营业执照</li>
                <li><span className="point"></span>特殊行业的经营许可证</li>
              </ul>
              <p className="auth-example">例如：开锁行业需提供：公安备案； 搬家需提供：道路运输资质</p>
            </div>
          </Col>
          <Col offset={4} span={9} style={{ marginTop: 60 }}>
            { actionButton(companyVerifyStatus, '企业认证') }
          </Col>
        </Row>
        <Divider />
        <Row className="auth-box">
          <Col span={10} className="auth-item">
            <img src="//file.baixing.net/202011/9ef06d895702344481e49e5d5a11f9bf.png"/>
            <div style={{ marginLeft: 203 }}>
              <h4 style={{ fontSize: 18 }}>个人认证</h4>
              <ul style={{ paddingLeft: 0 }}>
                <li><span className="point"></span>适合个人商家</li>
                <li><span className="point"></span>需要认证身份证</li>
              </ul>
            </div>
          </Col>
          <Col offset={4} span={9} style={{ marginTop: 60 }}>
            { actionButton(userVerifyStatus, '个人认证') }
          </Col>
        </Row>
      </div>
    </div>
  );
}
