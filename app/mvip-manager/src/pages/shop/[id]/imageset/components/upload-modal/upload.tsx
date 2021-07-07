import React, { useState, useCallback } from 'react';
import { Upload } from 'antd'
import { UploadFile, UploadFileStatus } from 'antd/lib/upload/interface'

import styles from './index.less'

// 获取图片 base64 预览地址
const getBase64 = function (file: Blob): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export interface UploadItem extends UploadFile {
  // 图片预览地址
  preview: string
  // 扩展赤壁审核枚举
  state: UploadFileStatus | 'chibi'
  // 出错原因
  error: string
}

export function useUpload() {
  const [fileList, setFileList] = useState<UploadItem[]>([])

  // ? 竞争
  const handleChange = useCallback(async (e: any) => {
    const { uid, status } = e.file

    // 在上传开始就读取到图片的预览地址
    if (status === 'done') {
      if (e.file && !(e.file.preview)) {
        e.file.preview = await getBase64(e.file.originFileObj)
      }
    }

    e.file.state = e.file.status

    setFileList(e.fileList)
  }, [fileList])

  const add = useCallback(item => {
    console.log('TODO')
  }, [fileList])

  const remove = useCallback(item => {
    const tempList = [...fileList]
    const findIDX = tempList.findIndex(x => x.uid === item.uid)
    if (findIDX !== -1) {
      tempList.splice(findIDX, 1)
      setFileList(tempList)
    } else {
      console.warn('[WARN] Not found', item, fileList)
    }
  }, [fileList])

  return [
    <Upload
      className={styles['tranparent-uploader']}
      action={window.__upyunImgConfig?.uploadUrl}
      data={{
        policy: window.__upyunImgConfig?.uploadParams?.policy,
        signature: window.__upyunImgConfig?.uploadParams?.signature,
      }}
      fileList={fileList}
      onChange={handleChange}
    ><div></div></Upload>,
    fileList,
    add,
    remove
  ] as const
}
