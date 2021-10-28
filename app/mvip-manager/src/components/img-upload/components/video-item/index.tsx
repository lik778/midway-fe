import React, { FC, useEffect, useMemo, useState, useContext } from 'react';
import { EyeOutlined, DeleteOutlined, ScissorOutlined, DownloadOutlined } from '@ant-design/icons'
import { UploadFile, } from 'antd/lib/upload/interface'
import styles from './index.less'
import { ActionBtnListItem, ExpandShowUploadListInterface } from '../../data'
import StatusBox from '@/components/img-upload/components/status-box'
import ImgUploadContext from '@/components/img-upload/context'

interface Props {
  disabled: boolean
  file: UploadFile,
  fileList: UploadFile[],
  fileIndex: number,
  showUploadList?: ExpandShowUploadListInterface,
  itemWidth?: number // 图片块的宽度
  actionBtn?: ActionBtnListItem[]
  onPreview: (file: UploadFile, fileIndex: number) => void,
  onRemove: (file: UploadFile, fileIndex: number) => void,
  onCrop?: (file: UploadFile, fileIndex: number) => void,
  onDownload?: (file: UploadFile, fileIndex: number) => void,
  onSelectCover?: (file: UploadFile, fileIndex: number) => void
}

const VideoItem: FC<Props> = (props) => {
  const context = useContext(ImgUploadContext)
  const { handleChangeFileList } = context
  const { disabled, file, fileList, fileIndex, itemWidth, actionBtn, showUploadList, onPreview, onRemove, onDownload, onSelectCover } = props

  const localShopUploadList = useMemo<ExpandShowUploadListInterface>(() => {
    const initShowUploadList: ExpandShowUploadListInterface = {
      showPreviewIcon: true,
      previewIcon: <EyeOutlined color={'#fff'} />,
      showRemoveIcon: true,
      removeIcon: <DeleteOutlined color={'#fff'} />,
      showDownloadIcon: false,
      downloadIcon: <DownloadOutlined color={'#fff'} />,
      showSelectCoverIcon: true,
      selectCoverIcon: <img style={{
        width: 14,
        height: 14
      }} src="//file.baixing.net/202108/be570e4aba6980dda40f5dfbb5cc2937.png"></img>,
    }
    if (showUploadList) {
      return {
        ...initShowUploadList,
        ...showUploadList
      }
    } else {
      return initShowUploadList
    }
  }, [showUploadList])




  return <StatusBox file={file}>
    <div className={`${styles['video-item']} ${disabled ? styles['disabled'] : ''}`} style={{ width: itemWidth }}>
      <div className={styles['img']} style={{ backgroundImage: `url(${file.preview || file.thumbUrl})` }}>
        <div className={styles['play-icon']}></div>
        <div className={styles['mask']}>
          {
            // 预览
            (localShopUploadList.showPreviewIcon) && <div className={styles['action-btn']} title="预览视频" onClick={() => onPreview(file, fileIndex)}>
              {
                localShopUploadList.previewIcon
              }
            </div>
          }
          {
            !disabled && <>
              {
                // 删除
                (localShopUploadList.showRemoveIcon) && <div className={styles['action-btn']} title="删除视频" onClick={() => onRemove(file, fileIndex)}>
                  {
                    localShopUploadList.removeIcon
                  }
                </div>
              }
              {
                // 选择封面图
                file.type === 'VIDEO' && (localShopUploadList.showSelectCoverIcon) && <div className={styles['action-btn']} title="选择封面图" onClick={() => onSelectCover && onSelectCover(file, fileIndex)}>
                  {
                    localShopUploadList.selectCoverIcon
                  }
                </div>
              }
              {
                // 下载
                localShopUploadList.showDownloadIcon && (onDownload ?
                  <div className={styles['action-btn']} title="下载图片" onClick={() => onDownload(file, fileIndex)}>
                    {
                      localShopUploadList.downloadIcon
                    }
                  </div> : <a className={styles['action-btn']} title="下载图片" href={file.preview} target='_block'>
                    {
                      localShopUploadList.downloadIcon
                    }
                  </a>)
              }
              {
                actionBtn && actionBtn.map((item, index) => {
                  const icon = item.icon(file, fileList)
                  return icon && <div className={styles['action-btn']} title={item.title} onClick={
                    () => item.action(file, fileList, fileIndex, handleChangeFileList)
                  } key={`${index}-${item.title}`}>
                    {icon}
                  </div>
                })
              }
            </>
          }
        </div>
      </div>
    </div>
  </StatusBox>
}
export default VideoItem