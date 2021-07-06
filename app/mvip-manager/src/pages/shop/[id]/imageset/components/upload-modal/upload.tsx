import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Upload } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'

import styles from './index.less'

const getBase64 = function (file: Blob): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function useUpload() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [lists, setLists] = useState<any[]>([])

  const handleChange = async (e: any) => {
    if (e.file.status) {
      if (e.file.status === 'done') {
        e.file.preview = await getBase64(e.file.originFileObj)
      }
      setFileList(e.fileList)
      setLists(e.fileList)
    }
  }

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
    lists
  ] as const
}
