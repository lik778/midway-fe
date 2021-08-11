import React, { FC, useState, useEffect } from 'react';
import { Select } from 'antd'
import { ModulePageType, ModuleComponentId } from '@/interfaces/shop'
import styles from './index.less'
const Option = Select.Option


interface Props {
  pageOptions: {
    key: ModulePageType,
    label: string
  }[],
  position: ModulePageType
  handleChangePosition: (value: ModulePageType) => void
}

const SelectPage: FC<Props> = (props) => {
  const { pageOptions, position, handleChangePosition } = props
  return <div className={styles['container']}>
    <div className={styles['label']}>页面</div>
    <Select className={styles['select']} size="large" onChange={handleChangePosition} value={position} >
      {
        pageOptions.map(item => <Option key={item.key} value={item.key}>{item.label}</Option>)
      }
    </Select>
  </div>
}

export default SelectPage