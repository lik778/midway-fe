import React, { FC, useState, useEffect } from 'react';
import { Select } from 'antd'
import { PageType } from '../../data'
import styles from './index.less'
const Option = Select.Option


interface Props {
  page: PageType
  handleChangePage: (value: PageType) => void
}

const SelectPage: FC<Props> = (props) => {
  const { page, handleChangePage } = props
  const [selectOptions] = useState<{
    key: PageType,
    label: string
  }[]>([{
    key: 'home',
    label: '首页'
  }, {
    key: 'article-detail',
    label: '文章详情页'
  }])

  return <div className={styles['container']}>
    <div className={styles['label']}>页面</div>
    <Select className={styles['select']} size="large" onChange={handleChangePage} value={page} >
      {
        selectOptions.map(item => <Option key={item.key} value={item.key}>{item.label}</Option>)
      }
    </Select>
  </div>
}

export default SelectPage