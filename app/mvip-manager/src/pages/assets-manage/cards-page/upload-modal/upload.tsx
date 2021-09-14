import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Upload, Spin, notification } from 'antd'
import { UploadFile, RcFile } from 'antd/lib/upload/interface'

import { getFileMD5, getBase64 } from '@/utils'

import styles from './index.less'

declare global {
  // 上传后门设置
  interface Window {
    // 跳过上传检测
    _quick_upload: boolean
    _quick_upload_file: RcFile
    // 最小上传视频时间
    _min_duration: number
    // 最大上传大小
    _max_size: number
  }
}

// 获取视频的第一帧
// TODO FIXME 图片变绿！？
// TODO png 压缩
const getFirstVideoFrame = function (file: Blob): Promise<any> {
  return new Promise(resolve => {
    const $video = document.createElement('video')
    const $canvas = document.createElement('canvas')
    $video.preload = 'auto'
    $video.src = URL.createObjectURL(file)
    $video.onloadeddata = () => {
      $video.currentTime = 0
      $canvas.width = $video.videoWidth
      $canvas.height = $video.videoHeight
      $canvas.getContext('2d')!.drawImage($video, 0, 0, $canvas.width, $canvas.height)
      const preview = $canvas.toDataURL('image/png')
      resolve(preview)
    }
  }).catch(error => {
    console.error('[ERR] getFirstVideoFrame error', error, file)
  })
}

const checkUploadLoadingTick: any = null

export interface UploadItem extends UploadFile {
  // 图片预览地址
  preview: string
  // 赤壁审核
  inChibi: boolean
  // 出错原因
  error: string
}

type Props = {
  // 上传类型 IMAGE 图片、VIDEO 视频
  type: 'IMAGE' | 'VIDEO'
  // 最大上传数量
  maxCount?: number
  // 上传后钩子（在上传到又拍云后用来和后端交互）
  afterUploadHook?: (item: UploadItem, update?: Function) => Promise<UploadItem>
  // 上传前检查状态钩子
  setCheckUploadLoading?: (loading: boolean) => void
}
export function useUpload(props: Props) {
  const { type, maxCount = 1, afterUploadHook } = props
  const checkUploadLoadingHook = props.setCheckUploadLoading || (() => { })
  const [lists, setLists] = useState<UploadItem[]>([])
  const [checkUploadLoading, setCheckUploadLoading] = useState(false)
  const uploadItemLabel = useMemo(() => type === 'IMAGE' ? '图片' : '视频', [type])
  const uploadConf = type === 'IMAGE'
    ? {
      accept: ['image/jpeg', 'image/png', 'image/jpg'],
      action: window.__upyunImgConfig?.uploadUrl,
      data: {
        policy: window.__upyunImgConfig?.uploadParams?.policy,
        signature: window.__upyunImgConfig?.uploadParams?.signature,
      }
    } : {
      accept: ['video/mp4', 'video/mpeg', 'video/mov', 'video/quicktime'],
      action: window.__upyunVideoConfig?.uploadUrl,
      async data(file: RcFile) {
        setCheckUploadLoading(true)
        if (!checkUploadLoadingTick) {
          window.clearTimeout(checkUploadLoadingTick)
        }
        try {
          const defaultConf = {
            policy: window.__upyunVideoConfig?.uploadParams?.policy,
            signature: window.__upyunVideoConfig?.uploadParams?.signature,
          }
          const fileMD5 = await getFileMD5(file)
          let fileSuffix = `.${file.name.split('.').pop()}`
          const confWithMD5 = await window.__upyunGetTaskConfig({ fileMD5, fileSuffix })
          return {
            ...defaultConf,
            ...confWithMD5
          }
        } finally {
          setCheckUploadLoading(false)
        }
      }
    }
  const uploadAccept = uploadConf.accept
    .map(x => '.' + (x.split('/')[1]))
    .join(',')

  useEffect(() => {
    checkUploadLoadingHook(checkUploadLoading)
  }, [checkUploadLoading])

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

  const updateRef = useRef<Function>(() => { })
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
      let defer = false
      if (e.file && !(e.file.preview)) {
        defer = true
        if (e.file.type.match('video')) {
          getFirstVideoFrame(e.file.originFileObj)
            .then(preview => {
              updateRef.current(e.file, { preview })
              afterUploadHook && afterUploadHook(e.file, updateRef.current)
            })
            .catch(error => {
              console.error(error)
              updateRef.current(e.file, { status: 'error', error: '解析失败' })
            })
        } else {
          getBase64(e.file.originFileObj)
            .then(preview => {
              updateRef.current(e.file, { preview })
              afterUploadHook && afterUploadHook(e.file, updateRef.current)
            })
            .catch(error => {
              console.error(error)
              updateRef.current(e.file, { status: 'error', error: '解析失败' })
            })
        }
      }
      if (!defer) {
        afterUploadHook && afterUploadHook(e.file, updateRef.current)
      }
    }
    if (status) {
      setLists(e.fileList)
    }
  }

  /**
   * 上传前检测
   */
  const beforeUpload = useCallback(async (file: RcFile): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      // 给上传增加一个测试开关
      if (window._quick_upload) {
        window._quick_upload_file = file
        resolve(file)
      }
      const isExtAndSizeValid = (file: RcFile, exts: string[], size: number) => {
        if (!file) {
          return false
        }
        const extNotShow = ['quicktime', 'mpeg']
        const isValidType = exts.includes(file.type)
        if (!isValidType) {
          notification.open({
            key: 'media-upload-error-filetype',
            message: `${uploadItemLabel}格式错误`,
            description: `请上传 ${exts.map(x => x.split('/')[1]).filter(x => !extNotShow.includes(x)).join('、')} 格式的${uploadItemLabel}`,
          })
          return false
        }

        let fileSuffix = `.${file.name.split('.').pop()}`
        switch (file.type) {
          case 'video/mp4':
            if (fileSuffix.indexOf('mp4') === -1 && fileSuffix.indexOf('MP4') === -1) {
              notification.open({
                key: 'media-upload-error-filetype',
                message: `${uploadItemLabel}格式错误`,
                description: '该文件类型与后缀名不符，请检查',
              })
              console.log('fileSuffix:', fileSuffix)
              console.log('file.type:', file.type)
              return false
            }
            break
          case 'video/mpeg':
            if (fileSuffix.indexOf('mpg') === -1 && fileSuffix.indexOf('MPG') === -1 && fileSuffix.indexOf('mpeg') === -1 && fileSuffix.indexOf('MPEG') === -1) {
              notification.open({
                key: 'media-upload-error-filetype',
                message: `${uploadItemLabel}格式错误`,
                description: '该文件类型与后缀名不符，请检查',
              })
              console.log('fileSuffix:', fileSuffix)
              console.log('file.type:', file.type)
              return false
            }
            break
          case 'video/mov':
          case 'video/quicktime':
            if (fileSuffix.indexOf('mov') === -1 && fileSuffix.indexOf('MOV') === -1) {
              notification.open({
                key: 'media-upload-error-filetype',
                message: `${uploadItemLabel}格式错误`,
                description: '该文件类型与后缀名不符，请检查',
              })
              console.log('fileSuffix:', fileSuffix)
              console.log('file.type:', file.type)
              return false
            }
            break
        }

        const validSize = file.size / 1024 / 1024 < (window._max_size || size)
        if (!validSize) {
          notification.open({
            key: 'media-upload-error-filesize',
            message: `${uploadItemLabel}体积过大`,
            description: `请上传小于${size}M的${uploadItemLabel}`,
          })
          return false
        }
        return true
      }
      const isVideoDurationValid = () => {
        return new Promise(validResolve => {
          const $video = document.createElement('video')
          const src = URL.createObjectURL(file)
          $video.src = src
          $video.onloadedmetadata = () => {
            const duration = $video.duration
            const minDuration = window._min_duration || 3
            if (duration < minDuration) {
              notification.open({
                key: 'media-upload-error-filesize',
                message: '视频时长出错',
                description: `请上传时长大于3秒的视频`,
              })
              validResolve(false)
            }
            if (duration > 60) {
              notification.open({
                key: 'media-upload-error-filesize',
                message: '视频时长出错',
                description: `请上传时长小于60秒的视频`,
              })
              validResolve(false)
            }
            validResolve(true)
          }
        })
      }

      let validRes
      try {
        validRes = type === 'IMAGE'
          ? isExtAndSizeValid(file, uploadConf.accept, 3)
          : isExtAndSizeValid(file, uploadConf.accept, 100) && (await isVideoDurationValid())
      } catch (error) {
        console.error('[ERR] 上传出现错误', error)
        validRes = false
      }
      if (validRes) {
        resolve(file)
      } else {
        reject('valid error')
      }
    })
  }, [type])

  /***************************************************** Renders */

  return [
    <Upload
      className={styles['tranparent-uploader']}
      accept={uploadAccept}
      action={uploadConf.action}
      data={uploadConf.data}
      multiple={true}
      fileList={lists}
      showUploadList={false}
      beforeUpload={beforeUpload}
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
