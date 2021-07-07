import React, { useCallback, useEffect, useMemo, useState, FC, useContext } from 'react';
import { Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import styles from './index.less'
import { ImgUploadContext } from '../../../../context'
const Option = Select.Option

const ModalHeader: FC = () => {
  const context = useContext(ImgUploadContext)
  const { shopCurrent, shopList, handleChangeShopCurrent, loadingShopModel, upDataLoading, handleChangeAtlasVisible } = context
  const selectValue = useMemo<number | undefined>(() => shopCurrent?.id, [shopCurrent])
  const handleChange = (value: any) => {
    handleChangeShopCurrent(shopList!.find(item => item.id === value)!)
  }

  return <div className={styles['atlas-modal-header']}>
    <Select className={styles['select']} size="large" onChange={handleChange} value={selectValue} loading={loadingShopModel || upDataLoading}>
      {
        shopList && shopList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
      }
    </Select>
    <CloseOutlined className={styles['close']} onClick={() => handleChangeAtlasVisible(false)}></CloseOutlined>
  </div>
}
export default ModalHeader