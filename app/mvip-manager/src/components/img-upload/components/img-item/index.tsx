import React, { FC, useEffect, useMemo, useState } from 'react';
import { EyeOutlined, DeleteOutlined, ScissorOutlined, DownloadOutlined } from '@ant-design/icons'
import { UploadFile, } from 'antd/lib/upload/interface'
import styles from './index.less'
import { ActionBtnListItem, ExpandShowUploadListInterface } from '../../data'

interface Props {
  file: UploadFile,
  showUploadList?: ExpandShowUploadListInterface,
  width?: number | string // 图片块的宽度
  actionBtn?: ActionBtnListItem[]
  onPreview: (file: any) => Promise<void>,
  onRemove: (file: any) => void,
  onCrop?: (file: any) => void,
  onDownload?: (file: any) => void,
}

const ImgItem: FC<Props> = (props) => {
  const { file, width, actionBtn, showUploadList, onPreview, onRemove, onCrop, onDownload } = props
  const haveShowUploadList = useMemo<boolean>(() => {
    return typeof showUploadList !== 'undefined'
  }, [showUploadList])
  return <div className={styles['img-item']} style={width ? { width } : {}}>
    <div className={styles['img']} style={{ backgroundImage: `url(${file.preview || file.url})` }}>
      <div className={styles['mask']}>
        {
          // 预览
          (!haveShowUploadList || showUploadList?.showPreviewIcon) && <div className={styles['action-btn']} title="预览图片">
            {
              showUploadList?.previewIcon || <EyeOutlined color={'#fff'} onClick={() => onPreview(file)} />
            }
          </div>
        }
        {
          // 删除
          (!haveShowUploadList || showUploadList?.showRemoveIcon) && <div className={styles['action-btn']} title="删除图片">
            {
              showUploadList?.removeIcon || <DeleteOutlined color={'#fff'} onClick={() => onRemove(file)} />
            }
          </div>
        }
        {
          // 裁剪
          (!haveShowUploadList || showUploadList?.showCropIcon) && <div className={styles['action-btn']} title="裁剪图片">
            {
              showUploadList?.cropIcon || <ScissorOutlined color={'#fff'} onClick={() => onCrop && onCrop(file)} />
            }
          </div>
        }
        {
          // 下载
          haveShowUploadList && showUploadList?.showDownloadIcon && (onDownload ?
            <div className={styles['action-btn']} title="下载图片">
              {
                showUploadList?.downloadIcon || <DownloadOutlined color={'#fff'} onClick={() => onDownload(file)} />
              }
            </div> : <a className={styles['action-btn']} title="下载图片" href={file.preview} target='_block'>
              {
                showUploadList?.downloadIcon || <DownloadOutlined color={'#fff'} />
              }
            </a>)
        }
        {
          actionBtn && actionBtn.map((item, index) => <div className={styles['action-btn']} title={item.title} onClick={
            () => item.action(file)
          } key={`${index}-${item.title}`}>
            {item.icon(file)}
          </div>)
        }
      </div>
    </div>
  </div>
}
export default ImgItem