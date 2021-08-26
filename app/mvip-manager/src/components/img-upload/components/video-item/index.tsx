import React, { FC, useEffect, useMemo, useState } from 'react';
import { EyeOutlined, DeleteOutlined, ScissorOutlined, DownloadOutlined } from '@ant-design/icons'
import { UploadFile, } from 'antd/lib/upload/interface'
import styles from './index.less'
import { ActionBtnListItem, ExpandShowUploadListInterface } from '../../data'
import StatusBox from '@/components/img-upload/components/status-box'

interface Props {
  file: UploadFile,
  fileList: UploadFile[],
  fileIndex: number,
  showUploadList?: ExpandShowUploadListInterface,
  itemWidth?: number // 图片块的宽度
  actionBtn?: ActionBtnListItem[]
  onPreview: (file: any, fileIndex: number) => void,
  onRemove: (file: any, fileIndex: number) => void,
  onCrop?: (file: any, fileIndex: number) => void,
  onDownload?: (file: any, fileIndex: number) => void,
}

const ImgItem: FC<Props> = (props) => {
  const { file, fileList, fileIndex, itemWidth, actionBtn, showUploadList, onPreview, onRemove, onCrop, onDownload } = props
  const localShopUploadList = useMemo<ExpandShowUploadListInterface>(() => {
    const initShowUploadList: ExpandShowUploadListInterface = {
      showPreviewIcon: true,
      previewIcon: <EyeOutlined color={'#fff'} />,
      showRemoveIcon: true,
      removeIcon: <DeleteOutlined color={'#fff'} />,
      showCropIcon: true,
      cropIcon: <ScissorOutlined color={'#fff'} />,
      showDownloadIcon: false,
      downloadIcon: <DownloadOutlined color={'#fff'} />
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
    <div className={styles['img-item']} style={{ width: itemWidth }}>
      <div className={styles['img']} style={{ backgroundImage: `url(${file.preview || file.url})` }}>
        <div className={styles['mask']}>
          {
            // 预览
            (localShopUploadList.showPreviewIcon) && <div className={styles['action-btn']} title="预览图片" onClick={() => onPreview(file, fileIndex)}>
              {
                localShopUploadList.previewIcon
              }
            </div>
          }
          {
            // 删除
            (localShopUploadList.showRemoveIcon) && <div className={styles['action-btn']} title="删除图片" onClick={() => onRemove(file, fileIndex)}>
              {
                localShopUploadList.removeIcon
              }
            </div>
          }
          {
            // 裁剪
            (localShopUploadList.showCropIcon) && file.status === 'done' && <div className={styles['action-btn']} title="裁剪图片" onClick={() => onCrop && onCrop(file, fileIndex)}>
              {
                localShopUploadList.cropIcon
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
                () => item.action(file, fileList, fileIndex)
              } key={`${index}-${item.title}`}>
                {icon}
              </div>
            })
          }
        </div>
      </div>
    </div>
  </StatusBox>
}
export default ImgItem