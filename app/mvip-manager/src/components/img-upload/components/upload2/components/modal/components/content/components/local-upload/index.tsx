import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react'
import { Spin } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import ImgUpload from '@/components/img-upload'
import ImgUploadContext from '@/components/img-upload/context'
import { ImageItem } from '@/interfaces/shop'
import { createImagesetImage } from '@/api/shop'
import styles from './index.less'
import ImgItem from '../img-item'

const LocalUpload: FC = () => {
  const context = useContext(ImgUploadContext)
  const { initConfig: { uploadBtnText, maxSize, aspectRatio, cropProps }, shopCurrent } = context
  const [albumList, setAlbumList] = useState<ImageItem[]>([])
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const handleChange = async (values: string | string[], file: UploadFile<any> | null, fileList: UploadFile<any>[], oldFileList: UploadFile<any>[]) => {
    setUpDataLoading(true)
    const res = await createImagesetImage(shopCurrent!.id, {
      imgUrl: file!.url!
    })
    setAlbumList([...albumList, res.data])
    setUpDataLoading(false)
  }

  const itemRender = (originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>, file: UploadFile<any>, fileList?: UploadFile<any>[] | undefined) => {
    return undefined
  }

  return <Spin spinning={upDataLoading}>
    <div className={styles['local-upload']}>
      <div className={styles['line']}>
        {
          albumList.map(item => <ImgItem detail={item} itemHeight={102} key={item.id}></ImgItem>)
        }
        <ImgUpload uploadType={1} uploadBtnText={uploadBtnText} maxLength={1000} onChange={handleChange} maxSize={maxSize} aspectRatio={150 / 116} showUploadList={{
          showRemoveIcon: false,
          showCropIcon: false
        }} cropProps={cropProps} uploadBeforeCrop={true} itemRender={itemRender}></ImgUpload>
      </div>
    </div>
  </Spin>
}
export default LocalUpload