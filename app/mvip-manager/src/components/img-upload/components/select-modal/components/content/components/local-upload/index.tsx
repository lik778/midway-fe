import React, { useState, useContext, FC } from 'react'
import { Spin } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import ImgUploadContext from '@/components/img-upload/context'
import { MediaAssetsItem, } from '@/interfaces/shop'
import { createMediaAssets } from '@/api/shop'
import styles from './index.less'
import ImgItem from '../img-item'
import { errorMessage } from '@/components/message'
import Upload1 from '@/components/img-upload/components/upload1'

const LocalUpload: FC = () => {
  const context = useContext(ImgUploadContext)
  const { initConfig: { uploadBtnText, maxSize, aspectRatio, cropProps, itemWidth } } = context

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [albumList, setAlbumList] = useState<MediaAssetsItem[]>([])

  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  // ImgUpload uploadType===1情况下，每次onChange只会操作一个动作
  const handleChange = async (fileList: UploadFile[], oldFileList: UploadFile[]) => {
    setUpDataLoading(true)
    setFileList(fileList)
    // 这里这么判断是因为在弹窗选图下，本地上传模块的图片后不存在删除操作，只有新增，所以比对一下url不同就知道是哪一个文件被修改了
    // 至于为什么不用最后一个，以免以后有裁剪功能什么的比对
    const file = fileList.find((item, index) => !oldFileList[index] || item.url !== oldFileList[index].url)
    if (file && file.status === 'done') {
      const res = await createMediaAssets({
        imgUrl: file.url!,
        source: 'IMAGE'
      })
      if (res.success && res.data.checkStatus !== 'APPROVE') {
        errorMessage(res.data.reason)
      }
      setAlbumList([...albumList, res.data])
      setUpDataLoading(false)
    }
  }

  const itemRender = (originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>, file: UploadFile<any>, fileList?: UploadFile<any>[] | undefined) => {
    return undefined
  }

  // console.log('fileList:', fileList)

  return <Spin spinning={upDataLoading}>
    <div className={styles['tip']}>因视频转码时间较久，“本地上传”仅支持上传图片，若需使用视频，请直接在“我的视频”中调用</div>
    <div className={styles['local-upload']}>
      <div className={styles['line']}>
        {
          fileList.map((item, index) => <ImgItem mediaType="IMAGE" detail={albumList[index]} file={item} itemHeight={102} key={item.uid} ></ImgItem>)
        }
        <div>
          <Upload1 fileList={fileList} initConfig={{
            uploadType: 1,
            unique: false,
            showImage: true,
            showVideo: false,
            uploadBtnText,
            maxSize,
            maxLength: 1000,
            disabled: false,
            aspectRatio,
            itemWidth: 102,
            cropProps,
            itemRender,
          }}
            handleChangeFileList={handleChange}
          ></Upload1>
        </div>

      </div>
    </div>
  </Spin>
}
export default LocalUpload
