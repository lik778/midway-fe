import React, { useCallback, useEffect, useMemo, useState, useContext, FC, ReactEventHandler } from 'react';
import { ImageItem, CheckStatusType } from '@/interfaces/shop';
import AuditFailedIcon from '@/icons/failed'
import ImgUploadContext from '@/components/img-upload/context'
import { UploadFile } from 'antd/lib/upload/interface';
import CropModal from '@/components/img-upload/components/crop-modal'
import { successMessage, errorMessage } from "@/components/message"
import { reAuditImagesetImage } from '@/api/shop'

import styles from './index.less'

interface Props {
  shopId?: number;
  detail: ImageItem,
  itemHeight?: number
}

// 用于区分单双击
let clickCount = 0

const ImgItem: FC<Props> = (props) => {
  const { shopId, detail, itemHeight } = props
  const context = useContext(ImgUploadContext)
  const { localFileList, handleChangeLocalFileList, handlePreview, initConfig: { maxLength, cropProps } } = context
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
    if (maxLength > 1 && localFileList.length >= maxLength) {
      errorMessage('上传数量达到上限！')
      return
    }

    if (detail.checkStatus !== 'APPROVE') {
      errorMessage(detail.reason)
      return
    }
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
      const newLocalFileList = [...localFileList, newFile]
      handleChangeLocalFileList(newLocalFileList)
    }
    setCropVisible(false)
  }

  // 申诉图片
  const reAuditImage = useCallback(async (e: any) => {
    e.stopPropagation()
    reAuditImagesetImage(shopId, { id: detail.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('申诉成功，请到图片管理 - 申诉记录查看进度')
        } else {
          throw new Error(res.message || '出错啦，请稍后重试')
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
  }, [detail])

  return <>
    <div className={styles['img-item']} style={{
      height: itemHeight
    }} onClick={handleClickItem}>
      <img className={styles['img']} src={detail.imgUrl} onLoad={handleLoad} />
      {
        detail.checkStatus === 'APPROVE' && <div className={styles["size-tip"]}>
          {`${originSize.width}*${originSize.heigth}`}
        </div>
      }
      {detail.checkStatus !== 'APPROVE' && (
        <div className={styles["error-tip"]}>
          <AuditFailedIcon />
          <span>{detail.reason || '图片审核失败'}</span>
          <span className={styles["re-audit-btn"]} onClick={e => reAuditImage(e)}>点击申诉</span>
        </div>
      )}
    </div>
    <CropModal cropVisible={cropVisible} handleCropClose={handleCropClose} cropProps={cropProps} cropUrl={detail.imgUrl} handleCropSuccess={handleCropSuccess}></CropModal>
  </>
}

export default ImgItem
