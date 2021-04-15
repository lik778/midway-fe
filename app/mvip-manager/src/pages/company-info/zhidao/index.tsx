import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import MainTitle from '@/components/main-title';
import { connect } from 'dva';
import { cloneDeepWith } from 'lodash';
import { zhidaoInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { ZhidaoMaterial } from '@/interfaces/user';
import { setZhidaoMaterial, getZhidaoMaterial } from '@/api/user'
import Loading from '@/components/loading';
import { errorMessage, successMessage } from '@/components/message';
import './index.less';
import { objToTargetObj } from '@/utils';

function CompanyInfoZhudao(props: any) {
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [enterpriseInfo, setEnterpriseInfo] = useState<ZhidaoMaterial | null>({
    banner1: '',
    banner2: '',
    siteUrl: ''
  })
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(zhidaoInfoForm));
  const [loading, setLoading] = useState<boolean>(false);

  const getFormData = async () => {
    setFormLoading(true)
    const res = await getZhidaoMaterial()
    setEnterpriseInfo(res.data)
    console.log(res);
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
  }, [])

  const sumbit = async (values: ZhidaoMaterial) => {
    console.log(values)
    setLoading(true)
    const { success, message, data } = await setZhidaoMaterial(values)
    if (success) {
      successMessage('保存成功')
    } else {
      errorMessage(message || '出错了')
    }
    setLoading(false)
  }

  const formChange = (...arg: any) => {
    console.log(arg)
  }

  return (
    <div>
      <MainTitle title="问答素材" />
      <div className="container">
        {formLoading && <Loading />}
        {!formLoading &&
          <WildcatForm
            editDataSource={enterpriseInfo}
            useLabelCol={true}
            submit={sumbit}
            config={config}
            formChange={formChange}
            submitBtn={
              <Row className="save-base-info-box">
                <Col span={3}></Col>
                <Col><Button loading={loading} className="btn"
                  type="primary" size="large" htmlType="submit">保存</Button></Col>
              </Row>
            }
          />
        }
      </div>
    </div>)
}

CompanyInfoZhudao.wrappers = ['@/wrappers/path-auth']

export default CompanyInfoZhudao
