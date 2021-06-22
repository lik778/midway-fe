import React, { FC, useEffect, useMemo, useState } from 'react';
import { Upload, Modal } from 'antd';
import { EyeOutlined } from '@ant-design/icons'
import { UploadFile, ShowUploadListInterface } from 'antd/lib/upload/interface'
import styles from './index.less'

interface Props {
  imgItemClass: string,// 用于给自定义item设置一些自己的样式 如果只传width 会
  file: UploadFile,
  showUploadList?: ShowUploadListInterface,
  onRemove?: (e: any) => Promise<void>
  onPreview?: (file: any) => Promise<void>,
  width?: number | string
}

const ImgItem: FC<Props> = (props) => {
  const { file, width, showUploadList, onPreview } = props
  const haveShowUploadList = useMemo<boolean>(() => {
    return typeof showUploadList !== 'undefined'
  }, [showUploadList])
  return <div className={styles['img-item']} style={width ? { width } : {}}>
    <div className={styles['img']} style={{ backgroundImage: `url(${file.preview || file.url})` }}>
      <div className={styles['mask']}>
        {
          showUploadList?.showPreviewIcon && <EyeOutlined onClick={onPreview} />
        }
        {
          showUploadList?.showRemoveIcon && <EyeOutlined onClick={onPreview} />
        }
      </div>
    </div>
  </div>
}
export default ImgItem