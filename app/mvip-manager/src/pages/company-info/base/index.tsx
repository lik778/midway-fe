import React from 'react';
import { Steps, Button } from 'antd';
import MainTitle from '../../../components/main-title';
import styles from './index.less';
import { baseInfoForm } from '../../../config/form'
import WildcatForm from '@/components/wildcat-form';
import ContactForm from './contact-form';

const { Step } = Steps


export default (props: any) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const steps = [ '基础信息', '联系方式']
  const nextStep = (values: any) => {
    console.log(values)
    next()
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
        { currentStep == 0 && <WildcatForm config={baseInfoForm} submit={nextStep}/> }
        { currentStep == 1 && <ContactForm back={prev}/>}
      </div>
    </div>
  );
}
