import React, { useState, useCallback } from 'react';
import { Upload } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'

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
  preview: string;
  // 赤壁审核
  inChibi: boolean;
  // 出错原因
  error: string;
}

type Props = {
  afterUploadHook?: (item: UploadItem) => void;
  afterRemoveHook?: (item: UploadItem) => void;
}
export function useUpload(props: Props) {
  const { afterUploadHook, afterRemoveHook } = props
  const [lists, setLists] = useState<UploadItem[]>([])

  // 增加一项
  const add = useCallback((item: UploadItem) => {
    console.log('TODO ?')
  }, [lists])

  // 修改项目
  const update = useCallback((item: UploadItem) => {
    const tempList = [...lists]
    const findIDX = tempList.findIndex(x => x.uid === item.uid)
    if (findIDX !== -1) {
      tempList.splice(findIDX, 1, item)
      setLists(tempList)
    } else {
      console.warn('[WARN] update item not found', item, lists)
    }
  }, [lists])

  // 删除项目
  const remove = useCallback((item: UploadItem) => {
    const tempList = [...lists]
    const findIDX = tempList.findIndex(x => x.uid === item.uid)
    if (findIDX !== -1) {
      tempList.splice(findIDX, 1)
      setLists(tempList)
    } else {
      console.warn('[WARN] remove item not found', item, lists)
    }
  }, [lists])

  const handleChange = useCallback(async (e: any) => {
    const { uid, status } = e.file

    // 读取到图片的预览地址
    if (status === 'done') {
      if (e.file && !(e.file.preview)) {
        await new Promise(resolve => setTimeout(resolve, (~~(Math.random() * 5 + 5)) * 1000))
        e.file.preview = await getBase64(e.file.originFileObj)
      }
      if (afterUploadHook) {
        await afterUploadHook(e.file)
      }
    }
    if (status === 'removed') {
      if (afterRemoveHook) {
        await (afterRemoveHook(e.file))
      }
    }

    setLists(e.fileList)
  }, [lists])

  return [
    <Upload
      className={styles['tranparent-uploader']}
      action={window.__upyunImgConfig?.uploadUrl}
      data={{
        policy: window.__upyunImgConfig?.uploadParams?.policy,
        signature: window.__upyunImgConfig?.uploadParams?.signature,
      }}
      multiple={true}
      fileList={lists}
      onChange={handleChange}
    ><div></div></Upload>,
    lists,
    setLists,
    update,
    remove,
    add
  ] as const
}
