import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { Spin } from 'antd'
import ImgUploadContext from '@/components/img-upload/context'
import styles from './index.less'
import AlbumMenu from './components/album-menu'
import ImgList from './components/img-list'
import { getBaixingAlbumNameList, getAlbumNameList } from '@/api/shop'
import { mockData } from '@/utils';
import { AlbumNameListItem } from '@/interfaces/shop';
import { TabsKeys } from '../../data'
import { ImageData } from '@/components/img-upload/data'
import { ImageDataAlbumListItem } from '@/components/img-upload/data';
interface Props {
  tabsCurrent: TabsKeys
  tabKey: TabsKeys
}

const Album: FC<Props> = (props) => {
  const { tabsCurrent, tabKey } = props
  const context = useContext(ImgUploadContext)
  const { shopCurrent, baixingImageData, imageData, handleChangeBaixingImageData, handleChangeImageData } = context
  const [menuKey, setMenuKey] = useState<number | undefined>()
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const createNewData = (result: AlbumNameListItem[]) => {
    return [...([{ id: -1, name: '全部' }, ...result]).map<ImageDataAlbumListItem>(item => {
      return {
        ...item,
        images: [],
        page: 1,
        total: 1,
        init: false
      }
    })]
  }

  const getAlbumMenu = async () => {
    // 选择好店铺后，先判断是否有请求过左侧相册名列表
    if (shopCurrent) {
      if (tabKey === '百姓图库') {
        if (baixingImageData.length <= 0) {
          setMenuKey(undefined)
          setGetDataLoading(true)
          const res = await getBaixingAlbumNameList(shopCurrent!.id)
          const newData = createNewData(res.data)
          handleChangeBaixingImageData(newData, baixingImageData)
        }
      } else if (tabKey === '我的图库') {
        if (!imageData[shopCurrent.id]) {
          setMenuKey(undefined)
          setGetDataLoading(true)
          const res = await getAlbumNameList(shopCurrent!.id)
          const newData = createNewData(res.data)
          handleChangeImageData({
            ...imageData,
            [shopCurrent.id]: newData
          }, imageData)
        }
      }
      setGetDataLoading(false)
      setMenuKey(-1)
    }
  }

  useEffect(() => {
    getAlbumMenu()
  }, [shopCurrent])

  return <Spin spinning={getDataLoading}>
    <div className={styles['album']}>
      <AlbumMenu tabsCurrent={tabsCurrent} menuKey={menuKey} handleChangeMenuKey={setMenuKey}></AlbumMenu>
      <ImgList tabsCurrent={tabsCurrent} tabKey={tabKey} menuKey={menuKey}></ImgList>
    </div>
  </Spin>
}
export default Album