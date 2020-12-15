import React, { useEffect, useState } from 'react';
import { Steps, message, Button, Row, Col } from 'antd';
import MainTitle from '../../../components/main-title';
import './index.less';
import { baseInfoForm } from '../../../config/form'
import WildcatForm from '@/components/wildcat-form';
import ContactForm from './contact-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { getEnterpriseForShopApi, saveEnterpriseForShopApi } from '@/api/user'
import { UserEnterpriseInfo } from '@/interfaces/user';
import { formUnvalid } from '@/utils';

const { Step } = Steps


export default (props: any) => {
  const [enterpriseInfo, setEnterpriseInfo] = useState<UserEnterpriseInfo | null>(null)
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [formInstance, setFormInstance] = useState<any>(null);
  const [config, setConfig] = useState<FormConfig>(baseInfoForm);
  const steps = [ '基础信息', '联系方式']

  useEffect(() => {
    (async () => {
      const res = await getEnterpriseForShopApi()
      if (res.success) {
        setEnterpriseInfo(res.data)
        const { companyNameLock } = res.data
        if (companyNameLock) {
          // 不可修改公司名
          const  companyFiled: any = config.children.find((x: any) => x.name === 'companyName')
          companyFiled.disabled = true
          setConfig({...config})
        }
      }
    })()
  },[])

  const nextStep = async() => {
    if (formUnvalid(formInstance)) return
    const values = formInstance.getFieldsValue()
    // 这里处理一下
    if (!Array.isArray(values.area)) {
      values.area = Object.keys(values.area).map(k => k)
    }
    setLoading(true)
    const res = await saveEnterpriseForShopApi(values)
    setLoading(false)
    if (res.success) {
      message.success('修改基础资料成功')
      setEnterpriseInfo(Object.assign(enterpriseInfo, formInstance.getFieldsValue()))
      next()
    } else {
      message.error(res.message)
    }
  }

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      <MainTitle title="基础资料"/>
      <Steps current={currentStep} className="step-container">
        {steps.map(name => (
          <Step key={name} title={name} />
        ))}
      </Steps>
      <div className="container">
        { currentStep == 0 &&
        <div>
          <WildcatForm  onInit={(form) => setFormInstance(form)}
               useLabelCol={true}
               editDataSource={enterpriseInfo} config={config}/>
          <Row className="save-base-info-box">
            <Col span={3}></Col>
            <Col><Button loading={loading}
                type="primary" size="large" onClick={() => nextStep()}>保存并下一步</Button></Col>
          </Row>
        </div> }
        { currentStep == 1 && <ContactForm back={prev} editDataSource={enterpriseInfo}/>}
      </div>
    </div>
  );
}
