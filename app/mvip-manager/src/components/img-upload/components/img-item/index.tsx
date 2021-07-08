import React, { FC, useEffect, useMemo, useState } from 'react';
import { EyeOutlined, DeleteOutlined, ScissorOutlined, DownloadOutlined } from '@ant-design/icons'
import { UploadFile, } from 'antd/lib/upload/interface'
import styles from './index.less'
import { ActionBtnListItem, ExpandShowUploadListInterface } from '../../data'

interface Props {
  file: UploadFile,
  fileList: UploadFile[],
  showUploadList?: ExpandShowUploadListInterface,
  itemWidth?: number // 图片块的宽度
  actionBtn?: ActionBtnListItem[]
  onPreview: (file: any) => void,
  onRemove: (file: any) => void,
  onCrop?: (file: any) => void,
  onDownload?: (file: any) => void,
}

const ImgItem: FC<Props> = (props) => {
  const { file, fileList, itemWidth, actionBtn, showUploadList, onPreview, onRemove, onCrop, onDownload } = props
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

  return <div className={styles['img-item']} style={{ width: itemWidth }}>
    <div className={styles['img']} style={{ backgroundImage: `url(${file.preview || file.url})` }}>
      <div className={styles['mask']}>
        {
          // 预览
          (localShopUploadList.showPreviewIcon) && <div className={styles['action-btn']} title="预览图片" onClick={() => onPreview(file)}>
            {
              localShopUploadList.previewIcon
            }
          </div>
        }
        {
          // 删除
          (localShopUploadList.showRemoveIcon) && <div className={styles['action-btn']} title="删除图片" onClick={() => onRemove(file)}>
            {
              localShopUploadList.removeIcon
            }
          </div>
        }
        {
          // 裁剪
          (localShopUploadList.showCropIcon) && <div className={styles['action-btn']} title="裁剪图片" onClick={() => onCrop && onCrop(file)}>
            {
              localShopUploadList.cropIcon
            }
          </div>
        }
        {
          // 下载
          localShopUploadList.showDownloadIcon && (onDownload ?
            <div className={styles['action-btn']} title="下载图片" onClick={() => onDownload(file)}>
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
              () => item.action(file, fileList)
            } key={`${index}-${item.title}`}>
              {icon}
            </div>
          })
        }
      </div>
    </div>
  </div>
}
export default ImgItem