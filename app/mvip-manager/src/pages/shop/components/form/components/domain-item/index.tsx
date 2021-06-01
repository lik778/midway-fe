import React, { FC, useEffect, useState } from 'react';
import { Input } from 'antd'
import { DomainStatus } from '@/enums/index'
import styles from './index.less'

interface Props {
  disabled: boolean
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type: DomainStatus
}

const DomainItem: React.FC<Props> = (props) => {
  const { disabled, value, onChange, type } = props
  return <>
    <div className={styles['domain-item']}>
      {
        type === DomainStatus.SUFFIX && <div className={styles['text']}>shop.baixing.com/</div>
      }
      <Input className={styles['domian-item-input']} value={value} onChange={onChange} disabled={disabled}></Input>
      {
        type === DomainStatus.PREFIX && <div className={styles['text']}>.shop.baixing.com</div>
      }
    </div>
    <div className={styles['domain-item-tip']}>
      注：20个字符以内，填写英文/数字，不支持中文，<span className={styles['red']}>提交后不支持修改</span>
    </div>
  </>
}

export default DomainItem