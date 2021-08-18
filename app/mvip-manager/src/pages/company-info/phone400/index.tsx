import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import MainTitle from '@/components/main-title';
import { cloneDeepWith } from 'lodash';
import { zhidaoInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { Phone400Detail } from '@/interfaces/user';
import { getPhone400Api, setPhone400Api, getPhone400ListApi } from '@/api/user'
import Loading from '@/components/loading';
import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less';
import { mockData } from '@/utils';

interface FormSourceData {
  phone1: string
  phone2: string
  phone3: string
  phone4: string
  phone5: string
}

function CompanyInfoPhone400(props: any) {
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<Phone400Detail | null>(null)
  const [enterpriseInfo, setEnterpriseInfo] = useState<FormSourceData | null>(null)
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(zhidaoInfoForm));
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false);

  const getFormData = async () => {
    setGetDataLoading(true)
    const res = await getPhone400Api()
    // const res = await mockData<Phone400Detail[]>('data', [{
    //   account: '40088888888',
    //   destNums: '11111111111,1222222222,13333333333,14444444444,555555555555555',
    // }])
    console.log(res)
    const data: FormSourceData = {
      phone1: '',
      phone2: '',
      phone3: '',
      phone4: '',
      phone5: '',
    }
    const phoneList = res.data[0].destNums ? res.data[0].destNums.split(',') : []
    Object.keys(data).map((item: string, index: number) => {
      data[item as keyof FormSourceData] = phoneList.shift() || ''
    })
    setDetail(res.data[0])
    setEnterpriseInfo(data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    getFormData()
  }, [])

  const sumbit = async (values: FormSourceData) => {
    const requestData: Phone400Detail = {
      account: detail!.account,
      destNums: [values.phone1, values.phone2, values.phone3, values.phone4, values.phone5].filter(item => item).join(',')
    }
    setUpdataLoading(true)
    console.log(requestData)
    const { success, message, data } = await setPhone400Api(requestData)
    // const { success, message, data } = await mockData<Phone400Detail>('data', requestData)
    if (success) {
      successMessage('保存成功')
    } else {
      errorMessage(message || '出错了')
    }
    setUpdataLoading(false)
  }

  const formChange = (...arg: any) => {
    //console.log(arg)
  }

  return (
    <>
      <MainTitle title="400电话管理" />
      <div className={`container ${styles['phone400-container']}`}>
        {getDataLoading && <Loading />}
        {!getDataLoading && detail &&
          <>
            <div className={styles['phone-number']}>400号码：{detail.account}</div>
            <div className={styles['tip']}>设置您的转接号码，支持设置手机固话，为了保证电话接通，请设置正确的电话号码。</div>
            <WildcatForm
              editDataSource={enterpriseInfo}
              submit={sumbit}
              config={config}
              formChange={formChange}
              submitBtn={
                <Row className="save-base-info-box">
                  <Col span={3}></Col>
                  <Col style={{ paddingLeft: 16 }}><Button loading={upDataLoading} className="btn"
                    type="primary" size="large" htmlType="submit">保存</Button></Col>
                </Row>
              }
            />
          </>
        }
      </div>
    </>)
}

CompanyInfoPhone400.wrappers = ['@/wrappers/path-auth']

export default CompanyInfoPhone400
