import React, { useCallback, useEffect, useMemo, useState, useContext, FC, ReactEventHandler } from 'react';
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox'
import { ImageItem, CheckStatusType } from '@/interfaces/shop';
import ImgUploadContext from '@/components/img-upload/context'
import styles from './index.less'
import { UploadFile } from 'antd/lib/upload/interface';

interface Props {
  detail: ImageItem,
  itemHeight?: number
}

// 用于区分单双击
let clickCount = 0

const ImgItem: FC<Props> = (props) => {
  const { detail, itemHeight } = props
  const context = useContext(ImgUploadContext)
  const { checkFileObject, localFileList, handleChangeLocalFileList, handlePreview, initConfig: { maxLength } } = context
  const [originSize, setOriginSize] = useState<{
    width: number,
    heigth: number
  }>({
    width: 0,
    heigth: 0
  })
  const handleLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    e.persist()
    setOriginSize({
      width: (e.target as HTMLImageElement).naturalWidth,
      heigth: (e.target as HTMLImageElement).naturalHeight
    })
  }

  const handleSelectItem = () => {
    if (detail.checkStatus !== 'APPROVE') return
    const newFile: UploadFile = { uid: `${detail.id}`, status: 'done', url: detail.imgUrl, thumbUrl: detail.imgUrl, preview: detail.imgUrl as string, size: 0, name: '', originFileObj: null as any, type: '' }
    if (maxLength === 1) {
      handleChangeLocalFileList([newFile])
    } else {
      if (localFileList.length >= maxLength) return
      const newLocalFileList = [...localFileList, newFile]
      handleChangeLocalFileList(newLocalFileList)
      handleChangeLocalFileList(newLocalFileList)
    }
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

  return <div className={styles['img-item']} style={{
    height: itemHeight
  }} onClick={handleClickItem}>
    <img className={styles['img']} src={detail.imgUrl} onLoad={handleLoad} />
    <div className={styles["tip"]}>
      {`${originSize.width}*${originSize.heigth}`}
    </div>
  </div>
}
export default ImgItem