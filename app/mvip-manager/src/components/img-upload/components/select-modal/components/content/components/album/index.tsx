import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { Spin } from 'antd'
import ImgUploadContext from '@/components/img-upload/context'
import styles from './index.less'
import AlbumMenu from './components/album-menu'
import ImgList from './components/img-list'
import { getBaixingAlbumNameList, getMediaCatesNameList } from '@/api/shop'
import { mockData } from '@/utils';
import { MediaCatesNameListItem } from '@/interfaces/shop';
import { TabsKeys } from '../../data'
import { MediaDataAlbumListItem, MediaType } from '@/components/img-upload/data';
interface Props {
  tabsCurrent: TabsKeys
  tabKey: TabsKeys
  mediaType: MediaType
}

const Album: FC<Props> = (props) => {
  const { tabsCurrent, tabKey, mediaType } = props
  const context = useContext(ImgUploadContext)
  const { baixingImageData, imageData, videoData, handleChangeBaixingImageData, handleChangeImageData, handleChangeVideoData } = context
  const [menuKey, setMenuKey] = useState<number | undefined>()
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const createNewData = (result: MediaCatesNameListItem[]) => {
    return [...([{ id: -1, name: '全部' }, ...result]).map<MediaDataAlbumListItem>(item => {
      return {
        ...item,
        media: [],
        page: 1,
        total: 1,
        init: false
      }
    })]
  }

  const getAlbumMenu = async () => {
    if (tabKey === '百姓图库') {
      if (baixingImageData.length <= 0) {
        setMenuKey(undefined)
        setGetDataLoading(true)
        const res = await getBaixingAlbumNameList(468)
        const newData = createNewData(res.data)
        handleChangeBaixingImageData(newData, baixingImageData)
      }
    } else if (tabKey === '我的图库') {
      if (imageData.length <= 0) {
        setMenuKey(undefined)
        setGetDataLoading(true)
        const res = await getMediaCatesNameList({
          source: 'IMAGE'
        })
        const newData = createNewData(res.data)
        handleChangeImageData(newData, imageData)
      }
    } else if (tabKey === '我的视频') {
      console.log(videoData)
      if (videoData.length <= 0) {
        setMenuKey(undefined)
        setGetDataLoading(true)
        const res = await getMediaCatesNameList({
          source: 'VIDEO'
        })
        const newData = createNewData(res.data)
        handleChangeVideoData(newData, videoData)
      }
    }
    setGetDataLoading(false)
    setMenuKey(-1)
  }

  useEffect(() => {
    getAlbumMenu()
  }, [])

  return <Spin spinning={getDataLoading}>
    <div className={styles['album']}>
      <AlbumMenu tabsCurrent={tabsCurrent} menuKey={menuKey} handleChangeMenuKey={setMenuKey}></AlbumMenu>
      <ImgList tabsCurrent={tabsCurrent} tabKey={tabKey} menuKey={menuKey} mediaType={mediaType}></ImgList>
    </div>
  </Spin>
}
export default Album
