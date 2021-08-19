import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Upload, notification } from 'antd'
import { UploadFile, RcFile } from 'antd/lib/upload/interface'

import styles from './index.less'

declare global {
  interface Window {
    _quick_upload: boolean
    _quick_upload_file: RcFile
  }
}

// 获取图片 base64 预览地址
const getBase64 = function (file: Blob): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export interface UploadItem extends UploadFile {
  // 图片预览地址
  preview: string
  // 赤壁审核
  inChibi: boolean
  // 出错原因
  error: string
}

type Props = {
  // 上传类型 image 图片、video 视频
  type: 'image' | 'video'
  // 最大上传数量
  maxCount?: number
  // 上传后钩子函数
  afterUploadHook?: (item: UploadItem, update: Function) => Promise<UploadItem>
}
export function useUpload(props: Props) {
  const { type, maxCount = 15, afterUploadHook } = props
  const [lists, setLists] = useState<UploadItem[]>([])
  const uploadItemLabel = useMemo(() => type === 'image' ? '图片' : '视频', [type])
  const uploadConf = type === 'image'
    ? {
      accept: ['image/jpeg', 'image/png', 'image/jpg'],
      action: window.__upyunImgConfig?.uploadUrl,
      data: {
        policy: window.__upyunImgConfig?.uploadParams?.policy,
        signature: window.__upyunImgConfig?.uploadParams?.signature,
      }
    } : {
      accept: ['video/mp4', 'video/mpeg', 'video/mov'],
      action: window.__upyunVideoConfig?.uploadUrl,
      data: {
        policy: window.__upyunVideoConfig?.uploadParams?.policy,
        signature: window.__upyunVideoConfig?.uploadParams?.signature,
      }
    }

  // 增加一项
  const add = useCallback((item: UploadItem) => {
    console.log('TODO ?')
  }, [lists])

  // 修改项目
  const update = useCallback((item: UploadItem, props?: Partial<UploadItem>) => {
    const tempList = [...lists]
    const findIDX = tempList.findIndex(x => x.uid === item.uid)
    if (findIDX !== -1) {
      tempList.splice(findIDX, 1, props ? Object.assign(item, props) : item)
      setLists(tempList)
    } else {
      console.warn('[WARN] update item not found', item, lists)
    }
  }, [lists])

  const updateRef = useRef<Function>(() => {})
  useEffect(() => {
    updateRef.current = update
  }, [update])

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

  // 同步本地 fileList 和 Ant Upload 中的 fileList
  const handleChange = async (e: any) => {
    // 给上传增加一个测试开关
    // @ts-ignore
    if (window._quick_upload) {
      return
    }
    const { uid, status } = e.file
    // 读取到图片的预览地址
    if (status === 'done') {
      if (e.file && !(e.file.preview)) {
        getBase64(e.file.originFileObj)
          .then(preview => {
            updateRef.current(e.file, { preview })
          })
          .catch(error => {
            console.error(error)
            updateRef.current(e.file, { status: 'error', error: '解析失败' })
          })
      }
      if (afterUploadHook) {
        afterUploadHook(e.file, updateRef.current)
      }
    }
    if (status) {
      setLists(e.fileList)
    }
  }

  // 检测资源属性是否合规
  const checkAssets = useCallback((file: RcFile) => {
    // 给上传增加一个测试开关
    if (window._quick_upload) {
      window._quick_upload_file = file
      return true
    }
    const isExtAndSizeValid = (file: RcFile, exts: string[], size: number) => {
      if (!file) {
        return false
      }
      const isValidType = exts.includes(file.type)
      if (!isValidType) {
        notification.open({
          key: 'imageset-upload-error-filetype',
          message: `${uploadItemLabel}格式错误`,
          description: `请上传 ${exts.map(x => x.split('/')[1]).join('、')} 格式的${uploadItemLabel}`,
        })
        return false
      }
      const validSize = file.size / 1024 / 1024 < size
      if (!validSize) {
        notification.open({
          key: 'imageset-upload-error-filesize',
          message: `${uploadItemLabel}体积过大`,
          description: `请上传小于${size}M的${uploadItemLabel}`,
        })
        return false
      }
      return true
    }
    // TODO
    const isVideoDurationValid = () => {
      return true
    }
    return type === 'image'
      ? isExtAndSizeValid(file, uploadConf.accept, 3)
      : isExtAndSizeValid(file, uploadConf.accept, 100) && isVideoDurationValid()
  }, [type])

  /***************************************************** Renders */

  return [
    <Upload
      className={styles['tranparent-uploader']}
      accept={uploadConf.accept.map(x => '.' + (x.split('/')[1])).join(',')}
      action={uploadConf.action}
      data={uploadConf.data}
      multiple={true}
      fileList={lists}
      showUploadList={false}
      beforeUpload={checkAssets}
      onChange={handleChange}
      maxCount={maxCount}
    >
      {/* ! 别去掉这个 div，为了使 upload 展示出来，子项至少要非空 */}
      <div></div>
    </Upload>,
    lists,
    setLists,
    update,
    remove,
    add
  ] as const

}
