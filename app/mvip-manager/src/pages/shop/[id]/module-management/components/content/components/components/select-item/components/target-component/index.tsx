import React, { FC, useState, useEffect } from 'react';
import { Button } from 'antd'
import { ConfigItem, ConfigItemTypeText, ConfigItemType } from '../../data.d';
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
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  useEffect(() => {
    console.log(value)
  }, [value])

  const handleClickBtn = () => {
    setModalVisible(true)
  }

  return <>
    <div className={styles['select-btn-container']}>
      <Button className={styles['btn']} onClick={handleClickBtn}>
        +  添加{ConfigItemTypeText[componentConfig.type]}
      </Button>
      <div className={styles['tip']}>（最多可添加{componentConfig.maxLength}个{ConfigItemTypeText[componentConfig.type]}）</div>
    </div>
    <SelectList value={value} onChange={onChange} componentConfig={componentConfig}></SelectList>
    <SelectModal value={value} onChange={onChange} modalVisible={modalVisible} componentConfig={componentConfig} setModalVisible={setModalVisible}></SelectModal>
  </>
}

export default TargetComponent