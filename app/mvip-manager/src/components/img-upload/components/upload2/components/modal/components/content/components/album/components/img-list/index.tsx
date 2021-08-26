import React, { useCallback, useEffect, useMemo, useState, useContext, useRef, FC } from 'react';
import { MediaDataAlbumListItem, MediaType } from '@/components/img-upload/data';
import { Spin } from 'antd'
import { TabsKeys } from '../../../../data';
import ImgItem from '../../../img-item'
import VideoItem from '../../../video-item'
import ImgUploadContext from '@/components/img-upload/context'
import { mockData } from '@/utils';
import { MediaAssetsItem } from '@/interfaces/shop';
import styles from './index.less'
import { getMediaAssets, getBaixingMediaAssets } from '@/api/shop'
import { useDebounce } from '@/hooks/debounce';
import { errorMessage } from '@/components/message';
import ScrollBox from '@/components/scroll-box'

interface Props {
  tabsCurrent: TabsKeys,
  tabKey: TabsKeys,
  menuKey?: number,
  mediaType: MediaType
}

const ImgList: FC<Props> = (props) => {
  const { tabsCurrent, tabKey, menuKey, mediaType } = props
  const context = useContext(ImgUploadContext)
  const { baixingImageData, imageData, handleChangeBaixingImageData, handleChangeImageData } = context
  const [albumTypeDetail, setAlbumTypeDetail] = useState<MediaDataAlbumListItem>()
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const createNewData = (result: MediaAssetsItem[], totalPage: number) => {
    // images: MediaAssetsItem[]
    // page: number,// 当前类型数据已经翻到多少页
    // total: number,// 当前类型总页数
    // init: boolean // 是否初始化过
    return {
      ...albumTypeDetail!,
      media: [...albumTypeDetail!.media, ...result],
      page: albumTypeDetail!.page + 1,
      total: totalPage,
      init: true
    }
  }

  const getList = async () => {
    if (!albumTypeDetail) return
    if (albumTypeDetail.page > albumTypeDetail.total) return
    if (getDataLoading) return
    setGetDataLoading(true)
    const postMethod = tabKey === '百姓图库'
      ? getBaixingMediaAssets
      : getMediaAssets
    const res = await postMethod({
      page: albumTypeDetail.page,
      size: 16,
      mediaCateId: albumTypeDetail.id !== -1 ? albumTypeDetail.id : undefined,
      source: 'IMAGE'
    })
    setGetDataLoading(false)
    if (!res.success) {
      errorMessage(res.message)
      return
    }
    const newAlbumTypeDetail = createNewData(res.data.mediaImgBos.result || [], res.data.mediaImgBos.totalPage)
    if (tabKey === '百姓图库') {
      handleChangeBaixingImageData(baixingImageData.map(item => {
        if (item.id === newAlbumTypeDetail.id) {
          return newAlbumTypeDetail
        } else {
          return item
        }
      }), baixingImageData)
    } else if (tabKey === '我的图库') {
      handleChangeImageData(imageData.map(item => {
        if (item.id === newAlbumTypeDetail.id) {
          return newAlbumTypeDetail
        } else {
          return item
        }
      }), imageData)
    }
    setAlbumTypeDetail(newAlbumTypeDetail)
  }

  const getData = () => {
    if (menuKey) {
      if (tabKey === '百姓图库') {
        const newAlbumTypeDetail = baixingImageData.find(item => item.id === menuKey)
        setAlbumTypeDetail(newAlbumTypeDetail)
      } else if (tabKey === '我的图库') {
        const newAlbumTypeDetail = imageData.find(item => item.id === menuKey)
        setAlbumTypeDetail(newAlbumTypeDetail)
      } else {
        setAlbumTypeDetail(undefined)
      }
    }
  }

  // 切换店铺图册滚动到顶部
  const scrollTop = () => {
    if (!ref.current) return
    ref.current.scrollTop = 0
  }

  // 初始化一个图册时需要看它是否已经请求过数据，缓存起来了
  useEffect(() => {
    if (albumTypeDetail && !albumTypeDetail.init) {
      getList()
    }
  }, [albumTypeDetail])

  // 切换图册，切换店铺，都要触发，切换店铺时，新的店铺的左侧图册列表还没请求，所以及时shopCurrent触发了更新，但是imageData，baixingImageData
  useEffect(() => {
    scrollTop()
    getData()
  }, [menuKey])

  return <Spin className={styles['img-list-spin']} spinning={getDataLoading}>
    <ScrollBox scrollY={true} handleScrollToLower={getList} height="337px">
      <div className={styles['img-list']}>
        <div className={styles['list']}>
          {
            albumTypeDetail && albumTypeDetail.media.map(item => {
              if (mediaType === 'IMAGE') {
                return <ImgItem detail={item} key={item.id} mediaType={mediaType}></ImgItem>
              } else if (mediaType === 'VIDEO') {
                return <VideoItem detail={item} key={item.id} mediaType={mediaType}></VideoItem>
              }
            })
          }
        </div>
      </div>
    </ScrollBox>
  </Spin>
}
export default ImgList
