import { ImageDataAtlasTypeListItem } from '@/components/img-upload/data';
import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { Spin } from 'antd'
import { TabsKeys } from '../../../../data';
import ImgItem from './components/img-item'
import { ImgUploadContext } from '../../../../../../../../context'
import { mockData } from '@/utils';
import { AtlasImageListItem } from '@/interfaces/shop';
import styles from './index.less'
interface Props {
  tabsCurrent: TabsKeys,
  tabKey: TabsKeys,
  menuKey?: number
}

const ImgList: FC<Props> = (props) => {
  const { tabsCurrent, tabKey, menuKey } = props
  const context = useContext(ImgUploadContext)
  const { baixingImageData, imageData, handleChangeBaixingImageData, handleChangeImageData } = context
  const [atlasTypeDetail, setAtlasTypeDetail] = useState<ImageDataAtlasTypeListItem>()
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const createNewData = (result: AtlasImageListItem[], totalRecord: number, oldData: ImageDataAtlasTypeListItem[], updataFc: (newImageData: ImageDataAtlasTypeListItem[], oldImageData: ImageDataAtlasTypeListItem[]) => void) => {
    // images: AtlasImageListItem[]
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
    const res = await mockData<AtlasImageListItem>('list', {
      id: 1,
      url: 'qwe',
      status: 1
    }, '', atlasTypeDetail.page, 16)
    if (tabKey === '百姓图库') {
      createNewData(res.data.result, res.data.totalRecord, baixingImageData, handleChangeBaixingImageData)
    } else if (tabKey === '我的图库') {
      createNewData(res.data.result, res.data.totalRecord, imageData, handleChangeImageData)
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

  return <Spin spinning={getDataLoading}>
    <div className={styles['img-list']}>
      {
        atlasTypeDetail && atlasTypeDetail.images.map(item => <ImgItem detail={item} key={item.id}></ImgItem>)
      }
    </div>
  </Spin>
}
export default ImgList