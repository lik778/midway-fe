import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { ImageDataAtlasTypeListItem } from '@/components/img-upload/data';
import { Spin } from 'antd'
import { TabsKeys } from '../../../../data';
import ImgItem from '../../../img-item'
import ImgUploadContext from '@/components/img-upload/context'
import { mockData } from '@/utils';
import { ImageItem } from '@/interfaces/shop';
import styles from './index.less'
import { getImagesetImage } from '@/api/shop'

interface Props {
  tabsCurrent: TabsKeys,
  tabKey: TabsKeys,
  menuKey?: number
}

const ImgList: FC<Props> = (props) => {
  const { tabsCurrent, tabKey, menuKey } = props
  const context = useContext(ImgUploadContext)
  const { shopCurrent, baixingImageData, imageData, handleChangeBaixingImageData, handleChangeImageData } = context
  const [atlasTypeDetail, setAtlasTypeDetail] = useState<ImageDataAtlasTypeListItem>()
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const createNewData = (result: ImageItem[], totalRecord: number, oldData: ImageDataAtlasTypeListItem[], updataFc: (newImageData: ImageDataAtlasTypeListItem[], oldImageData: ImageDataAtlasTypeListItem[]) => void) => {
    // images: ImageItem[]
    // page: number,// 当前类型数据已经翻到多少页
    // total: number,// 当前类型总页数
    // init: boolean // 是否初始化过
    const newAtlasTypeDetail: ImageDataAtlasTypeListItem = {
      ...atlasTypeDetail!,
      images: [...atlasTypeDetail!.images, ...result],
      page: atlasTypeDetail!.page + 1,
      total: totalRecord,
      init: true
    }
    setAtlasTypeDetail(newAtlasTypeDetail)
    updataFc(oldData.map(item => {
      if (item.id === newAtlasTypeDetail.id) {
        return newAtlasTypeDetail
      } else {
        return item
      }
    }), oldData)
  }

  const getList = async () => {
    if (!atlasTypeDetail) return
    if (atlasTypeDetail.page > atlasTypeDetail.total) return
    setGetDataLoading(true)
    const res = await getImagesetImage(shopCurrent!.id, {
      page: atlasTypeDetail.page,
      size: 16
    })

    if (tabKey === '百姓图库') {
      createNewData(res.data.mediaImgBos.result || [], res.data.mediaImgBos.totalPage, baixingImageData, handleChangeBaixingImageData)
    } else if (tabKey === '我的图库') {
      createNewData(res.data.mediaImgBos.result || [], res.data.mediaImgBos.totalPage, imageData, handleChangeImageData)
    }
    setGetDataLoading(false)
  }

  const getData = () => {
    if (menuKey) {
      if (tabKey === '百姓图库') {
        const newAtlasTypeDetail = baixingImageData.find(item => item.id === menuKey)
        setAtlasTypeDetail(newAtlasTypeDetail)
      } else if (tabKey === '我的图库') {
        const newAtlasTypeDetail = imageData.find(item => item.id === menuKey)
        setAtlasTypeDetail(newAtlasTypeDetail)
      }
    }
  }

  // 初始化一个图册时需要看它是否已经请求过数据，缓存起来了
  useEffect(() => {
    if (atlasTypeDetail && !atlasTypeDetail.init) {
      getList()
    }
  }, [atlasTypeDetail])

  useEffect(() => {
    getData()
  }, [menuKey])

  return <Spin className={styles['img-list-spin']} spinning={getDataLoading}>
    <div className={styles['img-list']}>
      {
        atlasTypeDetail && atlasTypeDetail.images.map(item => <ImgItem detail={item} key={item.id}></ImgItem>)
      }
    </div>
  </Spin>
}
export default ImgList