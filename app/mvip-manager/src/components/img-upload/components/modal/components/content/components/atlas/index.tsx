import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { Spin } from 'antd'
import { ImgUploadContext } from '../../../../../../context'
import styles from './index.less'
import AtlasMenu from './components/atlas-menu'
import ImgList from './components/img-list'
import { mockData } from '@/utils';
import { AtlasTypeListItem } from '@/interfaces/shop';
import { TabsKeys } from '../../data'
import { ImageDataAtlasTypeListItem } from '@/components/img-upload/data';
interface Props {
  tabsCurrent: TabsKeys
  tabKey: TabsKeys
}

const Atlas: FC<Props> = (props) => {
  const { tabsCurrent, tabKey } = props
  const context = useContext(ImgUploadContext)
  const { initConfig, shopCurrent, baixingImageData, imageData, handleChangeBaixingImageData, handleChangeImageData } = context
  const [menuKey, setMenuKey] = useState<number>()
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const createNewData = (result: AtlasTypeListItem[], oldData: ImageDataAtlasTypeListItem[], updateFc: (newImageData: ImageDataAtlasTypeListItem[], oldImageData: ImageDataAtlasTypeListItem[]) => void) => {
    const newData = [...oldData, ...result.map<ImageDataAtlasTypeListItem>(item => {
      return {
        ...item,
        images: [],
        page: 1,
        total: 1,
        init: false
      }
    })]
    // 这里顺序不能颠倒 必须得先给 context里的imageData赋值再设置初始key，不然ImgList里还没拿到新的imageData就开始初始化了。
    updateFc(newData, oldData)
    setInitMenuKey(newData)
  }

  const getAtlasMenu = async () => {
    setGetDataLoading(true)
    const res = await mockData<AtlasTypeListItem>('list', { id: 1, name: '类型名' }, 'name', 1, 20)
    if (tabKey === '百姓图库') {
      createNewData(res.data.result, baixingImageData, handleChangeBaixingImageData)
    } else if (tabKey === '我的图库') {
      createNewData(res.data.result, imageData, handleChangeImageData)
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getAtlasMenu()
  }, [])

  // 封装这个函数是为了在请求到menu时触发一次（useState是异步的）
  const setInitMenuKey = (sourceData: ImageDataAtlasTypeListItem[]) => {
    if (sourceData.length > 0) {
      setMenuKey(sourceData[0].id)
    }
  }

  // 切换tab需要将左侧选到第一位
  const handleListenTabsCurrent = () => {
    if (tabsCurrent !== tabKey) return
    if (tabKey === '百姓图库') {
      setInitMenuKey(baixingImageData)
    } else if (tabKey === '我的图库') {
      setInitMenuKey(imageData)
    }
  }

  useEffect(() => {
    handleListenTabsCurrent()
  }, [tabsCurrent])

  return <Spin spinning={getDataLoading}>
    <div className={styles['atlas']}>
      <AtlasMenu tabsCurrent={tabsCurrent} menuKey={menuKey} handleChangeMenuKey={setMenuKey}></AtlasMenu>
      <ImgList tabsCurrent={tabsCurrent} tabKey={tabKey} menuKey={menuKey}></ImgList>
    </div>
  </Spin>
}
export default Atlas