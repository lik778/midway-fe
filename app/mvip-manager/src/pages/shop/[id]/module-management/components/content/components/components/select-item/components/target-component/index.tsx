import React, { FC, useState, useEffect } from 'react';
import { Button } from 'antd'
import { ConfigItem } from '../../data';
import SelectList from './components/list'
import SelectModal from './components/modal'
import styles from './index.less'

interface Props {
  value?: any[],
  onChange?: (newValue: any[]) => void
  componentConfig: ConfigItem
}

const TargetComponent: FC<Props> = (props) => {
  const { componentConfig, value, onChange } = props
  useEffect(() => {
    console.log(value)
  }, [value])
  return <>
    <div className={styles['select-btn-container']}>
      <Button className={styles['btn']}>
        +{componentConfig.btnText}
      </Button>
      <div className={styles['tip']}>{componentConfig.tip}</div>
      <SelectList value={value}></SelectList>
    </div>
  </>
}

export default TargetComponent