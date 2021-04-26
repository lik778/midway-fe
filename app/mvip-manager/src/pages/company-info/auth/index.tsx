import React, { useState, useEffect } from 'react'
import { Button, Col, Divider, Row } from 'antd'
import MainTitle from '../../../components/main-title'
import Loading from '@/components/loading'
import { getUserVerifyListApi } from '@/api/user'
import { VerifyStatus } from '@/enums'
import { VerifyItem } from '@/interfaces/user'
import { useApi } from '@/hooks/api'
import { AuthConfigItem, getAuthConfig } from './config'
import './index.less'
// import config from '@/config/env'

const AuthPage = () => {
  const [ authConfig, setAuthConfig ] = useState<any>(getAuthConfig())
  const [ verifyList, loading ] = useApi<VerifyItem[] | null>(null, getUserVerifyListApi)
  const haojingHost = '//www.baixing.com'
  // const haojingHost = config().env;

  useEffect(() => {
    if (verifyList) {
      verifyList.forEach((x: VerifyItem) => authConfig[x.verifyRequestType]['status'] = x.status)
      setAuthConfig({ ...authConfig })
    }
  }, [verifyList])

  const actionButton = (item: AuthConfigItem) => {
    const { name, status, type } = item
    if (status === VerifyStatus.ACCEPT) {
      return <Button type='primary' disabled className="auth-disabled" size='large'>已完成{ name }</Button>
    } else if (status === VerifyStatus.PENDING) {
      return <Button type='primary' disabled className="auth-disabled" size='large'>审核中</Button>
    } else if (status === VerifyStatus.REFUSE || status === VerifyStatus.REVOKE || status === null) {
      return <Button href={`${haojingHost}/bind/?type=${ type.toLocaleLowerCase() }`} type='primary' size='large'>
        去完成{ name }</Button>
    } else if (status === VerifyStatus.DEFAULT) {
      return null
    }
  }

  return <div>
      <MainTitle title="认证资料" />
      <div className="container">
        { loading && <Loading /> }
        {
          !loading && verifyList && Object.keys(authConfig).map((key, i) => {
            const item: AuthConfigItem = authConfig[key]
            return (
              <div  key={item.type}>
              <Row className="auth-box" >
                <Col span={10} className="auth-item">
                  <img src={ item.imageSrc } />
                  <div style={{ marginLeft: 203 }}>
                    <h4 style={{ fontSize: 18 }}>{ item.name }</h4>
                    <ul style={{ paddingLeft: 0 }}>
                      { item.details.map(detail => <li key={detail}><span className="point"></span>{ detail }</li>) }
                    </ul>
                    { item.example }
                  </div>
                </Col>
                <Col offset={4} span={9} style={{ marginTop: 60 }}>
                  { actionButton(item) }
                </Col>
              </Row>
              { i === 0 && <Divider /> }
              </div>
            )
          })
        }
      </div>
    </div>
}


AuthPage.wrappers = ['@/wrappers/path-auth']
export default AuthPage
