import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { ImgUploadContext } from '../../../../../../../../context'
import { TabsKeys } from '../../../../data'
import styles from './index.less'

interface Props {
  tabsCurrent: TabsKeys
  menuKey?: number
  handleChangeMenuKey: (newMenuKey: number) => void
}

const AtlasMenu: FC<Props> = (props) => {
  const { tabsCurrent, menuKey, handleChangeMenuKey } = props
  const context = useContext(ImgUploadContext)
  const { baixingImageData, imageData } = context
  const menuList = useMemo(() => {
    if (tabsCurrent === "百姓图库") {
      return baixingImageData
    } else if (tabsCurrent === "我的图库") {
      return imageData
    } else {
      return []
    }
  }, [tabsCurrent, baixingImageData, imageData])

  return <div className={styles['atlas-menu-container']}>
    <div className={styles['atlas-menu-content']}>
      {
        menuList.map(item => <div className={`${styles['menu-item']} ${menuKey === item.id && styles['active']}`} onClick={() => handleChangeMenuKey(item.id)} key={item.id}>{item.name}</div>)
      }
    </div>
  </div>
}
export default AtlasMenu