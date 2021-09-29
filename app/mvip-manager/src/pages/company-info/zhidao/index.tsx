import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import MainTitle from '@/components/main-title';
import { cloneDeepWith } from 'lodash';
import { zhidaoInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { ZhidaoMaterial, InitZhidaoMaterial } from '@/interfaces/user';
import { setZhidaoMaterial, getZhidaoMaterial } from '@/api/user'
import Loading from '@/components/loading';
import { errorMessage, successMessage } from '@/components/message';
import './index.less';
import { objToTargetObj } from '@/utils';
import { getImgUploadModelValue, getImgUploadValueModel } from '@/components/img-upload';
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'
function CompanyInfoZhudao(props: any) {
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [enterpriseInfo, setEnterpriseInfo] = useState<InitZhidaoMaterial | null>({
    banner1: '',
    banner2: '',
    siteUrl: ''
  })
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(zhidaoInfoForm));
  const [loading, setLoading] = useState<boolean>(false);

  const getFormData = async () => {
    setFormLoading(true)
    const res = await getZhidaoMaterial()
    const { siteUrl, banner1, banner2 } = res.data
    setEnterpriseInfo({
      banner1: getImgUploadValueModel('IMAGE', banner1),
      banner2: getImgUploadValueModel('IMAGE', banner2),
      siteUrl: res.data.siteUrl
    })
    const newChildren = config.children.map(item => {
      if (item.name === 'siteUrl') {
        item.options = objToTargetObj(res.data.siteUrls)
      }
      return item
    })
    setConfig({ ...config, children: newChildren })
    setFormLoading(false)
  }

  useEffect(() => {
    getFormData()
    track({
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        action: 'entry-page',
        action_page: 'company-info-zhidao',
      }
    })
  }, [])

  const sumbit = async (values: InitZhidaoMaterial) => {
    setLoading(true)
    const { success, message, data } = await setZhidaoMaterial({
      ...values,
      banner1: getImgUploadModelValue(values.banner1),
      banner2: getImgUploadModelValue(values.banner2),
    })
    if (success) {
      successMessage('保存成功')
      track({
        eventType: BXMAINSITE,
        data: {
          event_type: BXMAINSITE,
          action:  'time-end',
          action_page: 'company-info-zhidao',
        }
      })
    } else {
      errorMessage(message || '出错了')
    }
    setLoading(false)
  }

  const formChange = (...arg: any) => {
    //console.log(arg)
  }

  return (
    <>
      <MainTitle title="问答素材" />
      <div className="container">
        {formLoading && <Loading />}
        {!formLoading &&
          <WildcatForm
            editDataSource={enterpriseInfo}
            submit={sumbit}
            config={config}
            formChange={formChange}
            submitBtn={
              <Row className="save-base-info-box">
                <Col span={2}></Col>
                <Col style={{ paddingLeft: 16 }}><Button loading={loading} className="btn"
                  type="primary" size="large" htmlType="submit">保存</Button></Col>
              </Row>
            }
          />
        }
      </div>
    </>)
}

CompanyInfoZhudao.wrappers = ['@/wrappers/path-auth']

export default CompanyInfoZhudao
