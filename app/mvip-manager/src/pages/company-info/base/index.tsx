import React from 'react';
import { Steps } from 'antd';
import MainTitle from '@/components/main-title';
import styles from './index.less';
import { baseInfoPage } from '../../../config/page'
import Wildcat from '@/components/wildcat';

const { Step } = Steps


export default (props: any) => {
  const steps = [ '基础信息', '联系方式']
  return (
    <div>
      <MainTitle title="基础资料"/>
      <Steps current={-1} className={styles.stepContainer}>
        {steps.map(name => (
          <Step key={name} title={name} />
        ))}
      </Steps>
      <div className={styles.container}>
        <Wildcat config={baseInfoPage} />
      </div>
    </div>
  );
}
