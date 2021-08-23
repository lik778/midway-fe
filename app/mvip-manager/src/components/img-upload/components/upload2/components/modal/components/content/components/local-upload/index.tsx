import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react'
import { Spin } from 'antd'
import { useParams } from "umi";
import { UploadFile } from 'antd/lib/upload/interface'
import ImgUpload from '@/components/img-upload'
import ImgUploadContext from '@/components/img-upload/context'
import { RouteParams, ImageItem } from '@/interfaces/shop'
import { createMediaImage } from '@/api/shop'
import styles from './index.less'
import ImgItem from '../img-item'
import { errorMessage } from '@/components/message'

const LocalUpload: FC = () => {
  const context = useContext(ImgUploadContext)
  const { initConfig: { uploadBtnText, maxSize, aspectRatio, cropProps }, shopCurrent } = context

  const params: RouteParams = useParams();
  const shopId = Number(params.id);

  const [albumList, setAlbumList] = useState<ImageItem[]>([])
  const fileList = useMemo(() => {
    return albumList.map(item => item.imgUrl)
  }, [albumList])
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  // ImgUpload uploadType===1情况下，每次onChange只会操作一个动作
  const handleChange = async (values: string | string[], fileList: UploadFile<any>[], oldFileList: UploadFile<any>[]) => {
    setUpDataLoading(true)
    // 这里这么判断是因为在弹窗选图下，本地上传模块的图片后不存在删除操作，只有新增，所以比对一下url不同就知道是哪一个文件被修改了
    // 至于为什么不用最后一个，以免以后有裁剪功能什么的比对
    const file = fileList.find((item, index) => !oldFileList[index] || item.url !== oldFileList[index].url)
    const res = await createMediaImage(shopCurrent!.id, {
      imgUrl: file!.url!
    })
    if (res.success && res.data.checkStatus !== 'APPROVE') {
      errorMessage(res.data.reason)
    }
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
          albumList.map(item => <ImgItem shopId={shopId} detail={item} itemHeight={102} key={item.id}></ImgItem>)
        }
        <ImgUpload uploadType={1} editData={fileList} uploadBtnText={uploadBtnText} maxLength={1000} onChange={handleChange} maxSize={maxSize} aspectRatio={150 / 116} showUploadList={{
          showRemoveIcon: false,
          showCropIcon: false
        }} cropProps={cropProps} itemRender={itemRender}></ImgUpload>
      </div>
    </div>
  </Spin>
}
export default LocalUpload
