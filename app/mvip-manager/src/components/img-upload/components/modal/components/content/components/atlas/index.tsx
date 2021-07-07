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

  const createNewData = (result: AtlasTypeListItem[], oldData: ImageDataAtlasTypeListItem[], updataFc: (newImageData: ImageDataAtlasTypeListItem[], oldImageData: ImageDataAtlasTypeListItem[]) => void) => {
    const newData = [...oldData, ...result.map<ImageDataAtlasTypeListItem>(item => {
      return {
        ...item,
        images: [],
        page: 1,
        total: 1,
        init: false
      }
    })]
    setInitMenuKey(newData)
    updataFc(newData, oldData)
  }

  const getAtlasMenu = async () => {
    setGetDataLoading(true)
    const res = await mockData<AtlasTypeListItem>('list', { id: 1, name: '类型名' }, 'name', 1, 20)
    if (tabsCurrent === '百姓图库') {
      createNewData(res.data.result, baixingImageData, handleChangeBaixingImageData)
    } else {
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
    if (tabsCurrent === '百姓图库') {
      setInitMenuKey(baixingImageData)
    } else if (tabsCurrent === '我的图库') {
      setInitMenuKey(imageData)
    } else {
      setMenuKey(undefined)
    }
  }

  useEffect(() => {
    handleListenTabsCurrent()
  }, [tabsCurrent])

  return <Spin spinning={getDataLoading}>
    <div className={styles['atlas']}>
      <AtlasMenu tabsCurrent={tabsCurrent} menuKey={menuKey} handleChangeMenuKey={setMenuKey}></AtlasMenu>
      <ImgList tabsCurrent={tabsCurrent} menuKey={menuKey}></ImgList>
    </div>
  </Spin>
}
export default Atlas