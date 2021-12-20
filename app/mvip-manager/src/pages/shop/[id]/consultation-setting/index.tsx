import React, { useState, useEffect, FC } from 'react';
import BasisHeader from '../components/basis-header';
import { ShopBasisType } from '@/enums';
import styles from './index.less'
import CommonMessageForm from './components/common-message-form'
const consultationSetting: FC = () => {


  return (
    <>
      <BasisHeader type={ShopBasisType.CONSULTATION} />
      <div className={styles['container']}>
        <CommonMessageForm />
      </div>
    </>
  )
}

export default consultationSetting