import React, { FC, useState, useEffect } from 'react';
import { Select } from 'antd'
import { PageType } from '../../data'
import styles from './index.less'
const Option = Select.Option


interface Props {
  pageOptions: {
    key: PageType,
    label: string
  }[],
  page: PageType
  handleChangePage: (value: PageType) => void
}

const SelectPage: FC<Props> = (props) => {
  const { pageOptions, page, handleChangePage } = props
  return <div className={styles['container']}>
    <div className={styles['label']}>页面</div>
    <Select className={styles['select']} size="large" onChange={handleChangePage} value={page} >
      {
        pageOptions.map(item => <Option key={item.key} value={item.key}>{item.label}</Option>)
      }
    </Select>
  </div>
}

export default SelectPage