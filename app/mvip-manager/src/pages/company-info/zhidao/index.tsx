import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import MainTitle from '@/components/main-title';
import { connect } from 'dva';
import { cloneDeepWith } from 'lodash';
import { zhidaoInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { UserEnterpriseInfo } from '@/interfaces/user';
import { companyInfoStateToProps, USER_NAMESPACE, GET_COMPANY_INFO_ACTION, SET_COMPANY_INFO_ACTION } from '@/models/user';
import { saveEnterpriseForShopApi, getZhidaoMaterial } from '@/api/user'
import Loading from '@/components/loading';
import { errorMessage, successMessage } from '@/components/message';
import './index.less';

function CompanyInfoBase(props: any) {
  const { companyInfo } = props
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [enterpriseInfo, setEnterpriseInfo] = useState<UserEnterpriseInfo | null>(null)
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(zhidaoInfoForm));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
      console.log(companyInfo)
      if (companyInfo) {
      console.log(companyInfo)
      setEnterpriseInfo(companyInfo)
      setFormLoading(false)
      setConfig({ ...config })
    } else {
      setFormLoading(true)
    }
  }, [companyInfo])

  const getFomeData = async () => {
    const res = await getZhidaoMaterial()
    console.log(res);
  }

  useEffect(() => {
    getFomeData()
  }, [])

  const sumbit = async (values: any) => {
    setLoading(true)
    const { success, message, data } = await saveEnterpriseForShopApi(values)
    setLoading(false)
    if (success) {
      successMessage('保存成功')
    } else {
      errorMessage(message || '出错了')
    }
  }
  return (
    <div>
      <MainTitle title="问答素材" />
      <div className="container">
        {/*{ formLoading && <Loading />}*/}
        <WildcatForm
          editDataSource={enterpriseInfo}
          useLabelCol={true}
          submit={sumbit}
          config={config}
          submitBtn={
            <Row className="save-base-info-box">
              <Col span={3}></Col>
              <Col><Button loading={loading} className="btn"
                type="primary" size="large" htmlType="submit">保存</Button></Col>
            </Row>
          }
        />
      </div>
    </div>)
}
export default connect(companyInfoStateToProps)(CompanyInfoBase)
