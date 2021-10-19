import React, { useCallback, useEffect, useMemo, useState, useContext, FC, ReactEventHandler } from 'react';
import AuditFailedIcon from '@/icons/failed'
import ImgUploadContext from '@/components/img-upload/context'
import SelectModalContext from '@/components/img-upload/components/select-modal/context'
import StatusBox from '@/components/img-upload/components/status-box'
import { successMessage, errorMessage } from "@/components/message"
import { reAuditMediaAssets } from '@/api/shop'

import { UploadFile } from 'antd/lib/upload/interface';
import { MediaAssetsItem, RouteParams } from '@/interfaces/shop';
import styles from './index.less'
import { MediaType } from '@/components/img-upload/data';

/**
 * 当用fileList循环这个数组时，file一定存在，但是可能处于上传中状态，所以图片库详情可能为空
 * 当用图册list循环这个数组，file一定不存在 ，但detail一定存在
 */
interface Props {
  mediaType: MediaType
  detail: MediaAssetsItem,
  file?: UploadFile
  itemHeight?: number,
}

// 用于区分单双击
let clickCount = 0

const VideoItem: FC<Props> = (props) => {
  const { file, detail = {} as MediaAssetsItem, itemHeight, mediaType } = props
  const context = useContext(ImgUploadContext)
  const selectModalContext = useContext(SelectModalContext)
  const { handlePreview, initConfig: { cropProps, unique } } = context
  const { maxLength, localFileList, handleChangeLocalFileList } = selectModalContext

  const checkUrlUnique = (fileList: UploadFile<any>[], url: string) => {
    return fileList.some(item => item.url?.indexOf(url) !== -1)
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
    const newFile: UploadFile = { uid: `${detail.id}`, status: 'done', url: detail.videoUrl, thumbUrl: detail.imgUrl, preview: detail.imgUrl, size: 0, name: detail.title, originFileObj: null as any, type: mediaType }
    if (maxLength === 1) {
      handleChangeLocalFileList([newFile])
    } else {
      if (unique && checkUrlUnique(localFileList, newFile.url!)) {
        handleChangeLocalFileList(localFileList)
        errorMessage('请勿选择重复视频')
      } else {
        const newLocalFileList = [...localFileList, newFile]
        handleChangeLocalFileList(newLocalFileList)
      }
    }
  }

  const handleDoubleClick = () => {
    handlePreview({
      url: detail.videoUrl || (file && file.url),
      type: mediaType
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

  // 申诉视频
  const reAuditImage = useCallback(async (e: any) => {
    try {
      e.stopPropagation()
      const res = await reAuditMediaAssets({ id: detail.id })
      if (res.success) {
        successMessage('申诉成功，请到视频管理 - 申诉记录查看进度')
      } else {
        throw new Error(res.message || '出错啦，请稍后重试')
      }
    } catch (e) {
      errorMessage(e.message)
    }
  }, [detail])

  return <>
    <StatusBox file={file}>
      <div className={styles['video-item']} style={{
        height: itemHeight
      }} onClick={handleClickItem}>
        <div className={styles['play-icon']}></div>
        <img className={styles['img']} src={detail.imgUrl || (file && file.thumbUrl)} />
        <div className={styles['title']}>{detail.title}</div>
        {
          typeof detail.checkStatus === 'string' && detail.checkStatus !== 'APPROVE' && (
            <div className={styles["error-tip"]} onClick={(e) => e.stopPropagation()}>
              <AuditFailedIcon />
              <span>{detail.reason || '视频审核失败'}</span>
              <span className={styles["re-audit-btn"]} onClick={e => reAuditImage(e)}>点击申诉</span>
            </div>
          )
        }
      </div>
    </StatusBox>
  </>
}

export default VideoItem
