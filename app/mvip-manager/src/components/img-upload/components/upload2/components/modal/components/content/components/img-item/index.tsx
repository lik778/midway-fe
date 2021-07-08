import React, { useCallback, useEffect, useMemo, useState, useContext, FC, ReactEventHandler } from 'react';
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox'
import { ImageItem, CheckStatusType } from '@/interfaces/shop';
import ImgUploadContext from '@/components/img-upload/context'
import styles from './index.less'
import { UploadFile } from 'antd/lib/upload/interface';

interface Props {
  detail: ImageItem
}

const ImgItem: FC<Props> = (props) => {
  const { detail } = props
  const context = useContext(ImgUploadContext)
  const { checkFileObject, localFileList, handleChangeLocalFileList, initConfig: { maxLength } } = context
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

  const handleChangeCheckbox = (e: CheckboxChangeEvent) => {
    console.log(e.target.checked)
    if (e.target.checked && localFileList.length < maxLength) {

      const newFile: UploadFile = { uid: `${detail.id}`, status: 'done', url: detail.imgUrl, thumbUrl: detail.imgUrl, preview: detail.imgUrl as string, size: 0, name: '', originFileObj: null as any, type: '' }
      const newLocalFileList = [...localFileList, newFile]
      handleChangeLocalFileList(newLocalFileList)
    } else {
      handleChangeLocalFileList(localFileList.filter(item => item.url !== detail.imgUrl))
    }
  }

  return <div className={styles['img-item']}>
    <img className={styles['img']} src={detail.imgUrl} onLoad={handleLoad} />
    <Checkbox
      className={styles['checkbox']}
      disabled={detail.checkStatus !== 'APPROVE'}
      onChange={handleChangeCheckbox}
      checked={checkFileObject[detail.imgUrl]}
    >
    </Checkbox>
    <div className={styles["tip"]}>
      {`${originSize.width}*${originSize.heigth}`}
    </div>
  </div>
}
export default ImgItem