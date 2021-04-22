import React from 'react'
import { FormItem } from '@/components/wildcat-form/interfaces';
import { Button } from 'antd'
import styles from './index.less'
interface Props {
  item: FormItem
  onClick: (...arg: any) => any
}

const GroupSelectBtn = (props: Props) => {
  const { onClick } = props
  return <Button type="primary" className={`${styles['primary-btn']} ${styles['mvip-primary-btn']}`} onClick={onClick}>+新建分组</Button>
}

export default GroupSelectBtn