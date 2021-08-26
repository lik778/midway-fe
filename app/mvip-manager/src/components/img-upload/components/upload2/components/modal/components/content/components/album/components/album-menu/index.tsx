import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import ImgUploadContext from '@/components/img-upload/context'
import { TabsKeys } from '../../../../data'
import styles from './index.less'

interface Props {
  tabsCurrent: TabsKeys
  menuKey?: number
  handleChangeMenuKey: (newMenuKey?: number) => void
}

const AlbumMenu: FC<Props> = (props) => {
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

  return <div className={styles['album-menu-container']}>
    <div className={styles['album-menu-content']}>
      {/* key = `${item.id}-${item.name}` 是因为获取全部图片是不传id的，所以用name加强一下独特性 */}
      {
        menuList.map(item => <div className={`${styles['menu-item']} ${menuKey === item.id && styles['active']}`} onClick={() => handleChangeMenuKey(item.id)} key={`${item.id}-${item.name}`}>{item.name}</div>)
      }
    </div>
  </div>
}
export default AlbumMenu