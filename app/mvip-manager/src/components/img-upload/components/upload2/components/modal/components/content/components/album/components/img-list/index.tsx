import React, { useCallback, useEffect, useMemo, useState, useContext, useRef, FC } from 'react';
import { ImageData, ImageDataAlbumListItem } from '@/components/img-upload/data';
import { Spin } from 'antd'
import { TabsKeys } from '../../../../data';
import ImgItem from '../../../img-item'
import ImgUploadContext from '@/components/img-upload/context'
import { mockData } from '@/utils';
import { ImageItem } from '@/interfaces/shop';
import styles from './index.less'
import { getImagesetImage, getBaixingImagesetImage } from '@/api/shop'
import { useDebounce } from '@/hooks/debounce';
import { errorMessage } from '@/components/message';
import ScrollBox from '@/components/scroll-box'

interface Props {
  tabsCurrent: TabsKeys,
  tabKey: TabsKeys,
  menuKey?: number
}

const ImgList: FC<Props> = (props) => {
  const { tabsCurrent, tabKey, menuKey } = props
  const context = useContext(ImgUploadContext)
  const { shopCurrent, baixingImageData, imageData, handleChangeBaixingImageData, handleChangeImageData } = context
  const [albumTypeDetail, setAlbumTypeDetail] = useState<ImageDataAlbumListItem>()
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const createNewData = (result: ImageItem[], totalPage: number) => {
    // images: ImageItem[]
    // page: number,// 当前类型数据已经翻到多少页
    // total: number,// 当前类型总页数
    // init: boolean // 是否初始化过
    return {
      ...albumTypeDetail!,
      images: [...albumTypeDetail!.images, ...result],
      page: albumTypeDetail!.page + 1,
      total: totalPage,
      init: true
    } as ImageDataAlbumListItem
  }

  const getList = async () => {
    if (!albumTypeDetail) return
    if (albumTypeDetail.page > albumTypeDetail.total) return
    if (getDataLoading) return
    setGetDataLoading(true)
    const res = await (tabKey === '百姓图库' ? getBaixingImagesetImage : getImagesetImage)(shopCurrent!.id, {
      page: albumTypeDetail.page,
      size: 16,
      mediaCateId: albumTypeDetail.id !== -1 ? albumTypeDetail.id : undefined
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
      handleChangeImageData({
        ...imageData,
        [shopCurrent!.id]: imageData[shopCurrent!.id].map(item => {
          if (item.id === newAlbumTypeDetail.id) {
            return newAlbumTypeDetail
          } else {
            return item
          }
        })
      }, imageData)
    }
    setAlbumTypeDetail(newAlbumTypeDetail)
  }

  const getData = () => {
    if (menuKey) {
      if (tabKey === '百姓图库') {
        const newAlbumTypeDetail = baixingImageData.find(item => item.id === menuKey)
        setAlbumTypeDetail(newAlbumTypeDetail)
      } else if (tabKey === '我的图库') {
        const newAlbumTypeDetail = imageData[shopCurrent!.id]?.find(item => item.id === menuKey)
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
  }, [menuKey, shopCurrent])

  const handleScroll: React.UIEventHandler<HTMLDivElement> = useDebounce((e) => {
    // 未滚动到底部
    if (!ref.current) return
    if ((ref.current.scrollHeight - ref.current.clientHeight) > ref.current.scrollTop) {
      //未到底
    } else {
      //已到底部
      getList()
    }
  }, 200)

  return <Spin className={styles['img-list-spin']} spinning={getDataLoading}>
    <ScrollBox scrollY={true} handleScrollToLower={getList} height="337px">
      <div className={styles['img-list']}>
        <div className={styles['list']}>
          {
            albumTypeDetail && albumTypeDetail.images.map(item => <ImgItem detail={item} key={item.id}></ImgItem>)
          }
        </div>
      </div>
    </ScrollBox>
  </Spin>
}
export default ImgList