import React, { useCallback, useEffect, useMemo, useState, useContext, FC, ReactEventHandler } from 'react';
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox'
import { ImageItem, CheckStatusType } from '@/interfaces/shop';
import ImgUploadContext from '@/components/img-upload/context'
import styles from './index.less'
import { UploadFile } from 'antd/lib/upload/interface';
import CropModal from '@/components/img-upload/components/crop-modal'

interface Props {
  detail: ImageItem,
  itemHeight?: number
}

// 用于区分单双击
let clickCount = 0

const ImgItem: FC<Props> = (props) => {
  const { detail, itemHeight } = props
  const context = useContext(ImgUploadContext)
  const { checkFileObject, localFileList, handleChangeLocalFileList, handlePreview, initConfig: { maxLength, cropProps } } = context
  const [originSize, setOriginSize] = useState<{
    width: number,
    heigth: number
  }>({
    width: 0,
    heigth: 0
  })
  const [cropVisible, setCropVisible] = useState(false)
  const handleLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    e.persist()
    setOriginSize({
      width: (e.target as HTMLImageElement).naturalWidth,
      heigth: (e.target as HTMLImageElement).naturalHeight
    })
  }

  const handleSelectItem = () => {
    if (detail.checkStatus !== 'APPROVE') return
    setCropVisible(true)
  }

  const handleDoubleClick = () => {
    handlePreview({
      preview: detail.imgUrl,
    } as UploadFile)
  }

  const handleClickItem: React.MouseEventHandler<HTMLImageElement> = (e) => {
    clickCount++
    setTimeout(() => {
      if (clickCount === 1) {
        // 单击
        handleSelectItem()
      } else if (clickCount === 2) {
        // 双击事件处理
        handleDoubleClick()
      }
      clickCount = 0
    }, 300);
  }

  // 取消裁剪
  const handleCropClose = () => {
    setCropVisible(false)
  }

  // 传入url ，返回裁剪后的图的uid
  const handleCropSuccess = (uid: string, previewUrl: string) => {
    const newFile: UploadFile = { uid: `${detail.id}`, status: 'done', url: uid, thumbUrl: previewUrl, preview: previewUrl as string, size: 0, name: '', originFileObj: null as any, type: '' }
    if (maxLength === 1) {

      handleChangeLocalFileList([newFile])
    } else {
      if (localFileList.length >= maxLength) return
      const newLocalFileList = [...localFileList, newFile]
      handleChangeLocalFileList(newLocalFileList)
    }

    setCropVisible(false)
  }

  return <>
    <div className={styles['img-item']} style={{
      height: itemHeight
    }} onClick={handleClickItem}>
      <img className={styles['img']} src={detail.imgUrl} onLoad={handleLoad} />
      <div className={styles["tip"]}>
        {`${originSize.width}*${originSize.heigth}`}
      </div>
    </div>
    <CropModal cropVisible={cropVisible} handleCropClose={handleCropClose} cropProps={cropProps} cropUrl={detail.imgUrl} handleCropSuccess={handleCropSuccess}></CropModal>
  </>
}
export default ImgItem