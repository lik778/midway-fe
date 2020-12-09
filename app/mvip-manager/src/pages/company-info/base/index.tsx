import React, { useEffect, useState } from 'react';
import { Steps, message, Button } from 'antd';
import MainTitle from '../../../components/main-title';
import styles from './index.less';
import { baseInfoForm } from '../../../config/form'
import WildcatForm from '@/components/wildcat-form';
import ContactForm from './contact-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { getEnterpriseForShopApi, saveEnterpriseForShopApi } from '@/api/user'
import { UserEnterpriseInfo } from '@/interfaces/user';

const { Step } = Steps


export default (props: any) => {
  const [enterpriseInfo, setEnterpriseInfo] = useState<UserEnterpriseInfo | null>(null)
  const [currentStep, setCurrentStep] = React.useState(0);
  const [config, setConfig] = useState<FormConfig>(baseInfoForm);
  const steps = [ '基础信息', '联系方式']

  useEffect(() => {
    (async () => {
      const res = await getEnterpriseForShopApi()
      if (res.success) {
        setEnterpriseInfo(res.data)
      }
    })()
  },[])

  const nextStep = async(values: any) => {
    console.log(values)
    // 这里先写死
    values.area = values.areaMap && Object.keys(values.areaMap).map(k => k)
    const res = await saveEnterpriseForShopApi(values)
    if (res.success) {
      message.success('修改基础资料成功')
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
      <Steps current={currentStep} className={styles.stepContainer}>
        {steps.map(name => (
          <Step key={name} title={name} />
        ))}
      </Steps>
      <div className={styles.container}>
        { currentStep == 0 && <WildcatForm editDataSource={enterpriseInfo} config={config} submit={nextStep}/> }
        { currentStep == 1 && <ContactForm back={prev} editDataSource={enterpriseInfo}/>}
      </div>
    </div>
  );
}
