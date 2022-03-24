import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import styles from './index.less';
import { ImgUploadProps, MediaDataAlbumListItem, MediaItem, MediaType, SelectModalType } from './data';
import { SelectModalProps } from '@/components/img-upload/components/select-modal/data';
import ImgUploadContext from '@/components/img-upload/context'
import Upload1 from '@/components/img-upload/components/upload1'
import Upload2 from '@/components/img-upload/components/upload2'
import Upload3 from '@/components/img-upload/components/upload3'
import SelectModal from '@/components/img-upload/components/select-modal'
import CropModal from '@/components/img-upload/components/crop-modal'
import PreviewModal from '@/components/img-upload/components/preview-modal'

import { getFileBase64 } from '@/utils/index'

// 返回的url/开始初始化的url 处理方式不同
const getUrl = (url: string) => {
  // 判断url里是否有二级域名baixing.
  if (url.indexOf('.baixing.') !== -1) {
    return url
  } else {
    if (!url.startsWith('/')) {
      return url
    } else {
      return `${url.slice(1,)}${window.__upyunImgConfig.imageSuffix}`
    }
  }
}

// 将图片的信息缓存到对象中 key是 当前资源的url 如果是视频还要加上封面图url  因为url值会被getUrl修改 导致触发修改前后 key不一样 所以 找到一个baseUrl就行~
const getSaveImageOriginUrl = (urlParam: any) => {
    let url = urlParam
    if(urlParam && typeof urlParam === 'object'){
        url = urlParam['url']
    }
  // 判断url里是否有二级域名baixing.
  if (url.indexOf('.baixing.') !== -1) {
    return url
  } else {
    let newUrlKey = url
    if (newUrlKey.startsWith('/')) {
      newUrlKey = newUrlKey.slice(1)
    }
    newUrlKey = newUrlKey.replace(window.__upyunImgConfig.imageSuffix, '')
    return newUrlKey
  }
}

const getPreviewUrl = async (file: UploadFile): Promise<string | any> => {
  if (file.preview) {
    return file.preview
  } else if (file.url && file.url.indexOf('.baixing.') !== -1) {
    return file.url
  } else if (file.originFileObj) {
    return getFileBase64(file.originFileObj);
  } else {
    return ''
  }
}

// 当前组件不要使用useContext(ImgUploadContext)
// 因为在上面解构出来的是初始值，ImgUploadContextComponent组件实际上还没有渲染赋值，一定到ImgUploadContextComponent渲染好后再useContext(ImgUploadContext)
const ImgUpload: FC<ImgUploadProps> = (props) => {
  const { children, uploadType, unique = false, showImage = true, showVideo = false, value, maxSize = 1, uploadBtnText = '', maxLength, disabled = false, aspectRatio, showUploadList, cropProps, actionBtn, onChange, itemRender, onFileChange } = props
  // 下面两个通过connect传进来的，没写到ImgUploadProps里
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // 用 file的url做key，然后存储对应的item 主要是为了存住图片对应的 preview 图片  所以 相同的图片会覆盖掉
  const fileImageInfoObj = useMemo(() => {
    const fileImageInfoObj: {
      [key: string]: UploadFile
    } = {}
    fileList.forEach(item => {
      if (item.type === 'IMAGE') {
        fileImageInfoObj[getSaveImageOriginUrl(item.url!)] = item
      } else {
        fileImageInfoObj[`${item.url}-${getSaveImageOriginUrl(item.thumbUrl!)}`] = item
      }
    })
    return fileImageInfoObj
  }, [fileList])

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewMedia, setPreviewMedia] = useState<UploadFile>()

  const [cropVisible, setCropVisible] = useState(false)
  const [cropItem, setCropItem] = useState<UploadFile<any>>()
  const [cropItemIndex, setCropItemIndex] = useState<number>()

  const [itemWidth] = useState<number | undefined>(() => {
    return aspectRatio ? aspectRatio * 86 + 16 : undefined
  })

  // 为了保证出参入参不被修改 从这以下不能修改 下面用for循环是因为 setFileList需要循环完全结束  二
  // [包装一下setFileList函数，不需要触发onChange时调用
  const createFileList = async (fileList: UploadFile[]) => {
    const newFileList: UploadFile<any>[] = []
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].preview) {
        newFileList.push(fileList[i])
      } else {
        newFileList.push({
          ...fileList[i],
          preview: await getPreviewUrl(fileList[i])
        })
      }
    }
    return newFileList
  }

  const reloadFileList =  async (fileList: UploadFile[]) => {
    const newFileList = await createFileList(fileList)
    if (uploadType !== 3) {
      setFileList(newFileList)
    }
    return newFileList
  }

  // 包装一下setFileList函数，需要触发onChange时调用 做一下图片处理
  const decorateSetFileList = useCallback(async (fileList: UploadFile[], oldFileList: UploadFile[]) => {
    const newFileList = await reloadFileList(fileList)

    // 每次更新文件列表，只要变化就触发文件更新函数
    if (onFileChange) {
      onFileChange([...newFileList])
    }
    if (!onChange) return
    //  这里用嵌套if是为了理解简单
    if (newFileList.length === 0) {
      onChange('', fileList, oldFileList);
    } else if (newFileList.length === 1) {
      if (newFileList[0].url) {
        onChange({
          url: getUrl(newFileList[0].url!),
          mediaType: newFileList[0].type as MediaType,
          coverUrl: newFileList[0].thumbUrl
        }, newFileList, oldFileList);
      }
    } else {
      if (newFileList.every(item => item.url)) {
        onChange(newFileList.map((item: UploadFile<any>) => ({
          url: getUrl(item.url!),
          mediaType: item.type as MediaType,
          coverUrl: item.thumbUrl
        })), newFileList, oldFileList);
      }
    }
  }, [onChange])

  const creatFileItem = (item: MediaItem, index: number): UploadFile => {
    const fileItem: UploadFile = { uid: `${item.url}-${index}`, status: 'done', url: item.url, thumbUrl: item.mediaType === 'VIDEO' ? item.coverUrl : item.url, preview: item.mediaType === 'VIDEO' ? item.coverUrl : item.url, size: 0, name: '', originFileObj: null as any, type: item.mediaType }

    let fileImageInfoItem: UploadFile
    if (item.mediaType === 'IMAGE') {
      fileImageInfoItem = fileImageInfoObj[getSaveImageOriginUrl(item.url)]
    } else {
      fileImageInfoItem = fileImageInfoObj[`${item.url}-${getSaveImageOriginUrl(item.coverUrl || '')}`]
    }
    if (fileImageInfoItem) {
      fileItem.preview = fileImageInfoItem.preview
      fileItem.originFileObj = fileImageInfoItem.originFileObj
      fileItem.size = fileImageInfoItem.size
    }
    return fileItem
  }
  // 修改值初始化 值是可以传给后端的
  // url 是当前媒体的值
  // thumbUrl mediaType==='VIDEO' ? 封面图的值 : 当前媒体的值
  // preview  mediaType==='VIDEO'？封面图预览 : 图片的预览
  const initEdit = (editData: "" | MediaItem | MediaItem[] | undefined) => {
    if (editData) {
      let fileList: UploadFile[] = []
      if (Array.isArray(editData)) {
        fileList = (editData).map((item, index) => creatFileItem(item, index))
        reloadFileList(fileList)
      } else {
        fileList = [creatFileItem(editData, 0)]
        reloadFileList(fileList)
      }
    }
  }

  // 页面后续对value的更新会触发视图更新 但是感觉是重复渲染。淦  开始设计的时候没考虑 value字段
  useEffect(() => {
    initEdit(value)
  }, [value])

  // 为了保证出参入参不被修改 从这以上不能修改


  // context 需要
  const [albumVisible, setAlbumVisible] = useState<boolean>(false)
  const [imageData, setImageData] = useState<MediaDataAlbumListItem[]>([])
  const [videoData, setVideoData] = useState<MediaDataAlbumListItem[]>([])
  const [baixingImageData, setBaixingImageData] = useState<MediaDataAlbumListItem[]>([])
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  // 弹窗模式需要 开始
  // 弹窗是给正常文件还是给封面图
  const [selectModalType, setSelectModalType] = useState<SelectModalType>('FILE')
  const [selectCoverFile, setSelectCoverFile] = useState<UploadFile>()

  const handleChangeCover = useCallback((coverFileList: UploadFile[], oldCoverFileList: UploadFile[]) => {
    if (coverFileList.length > 0) {
      decorateSetFileList(fileList.map(item => {
        if (item.uid === selectCoverFile?.uid) {
          return {
            ...item,
            thumbUrl: coverFileList[0].url,
            preview: coverFileList[0].preview
          }
        }
        return item
      }), [...fileList])
    }
  }, [selectCoverFile, fileList, decorateSetFileList])

  const SelectModalOption = useMemo<SelectModalProps>(() => {
    if (selectModalType === 'COVER' && selectCoverFile) {
      return {
        showVideo: false,
        maxLength: 1,
        fileList: [{ uid: `${selectCoverFile.url}-${0}`, status: 'done', url: selectCoverFile.thumbUrl, thumbUrl: selectCoverFile.thumbUrl, preview: selectCoverFile.preview, size: 0, name: '', originFileObj: null as any, type: 'IMAGE', }],
        handleChangeFileList: handleChangeCover
      }
    } else {
      return {
        showVideo,
        maxLength,
        fileList: fileList,
        handleChangeFileList: decorateSetFileList
      }
    }
  }, [selectModalType, maxSize, fileList, decorateSetFileList, selectCoverFile, handleChangeCover])

  // 选择封面图
  const handleSelectCover = (file: UploadFile, fileIndex: number) => {
    setSelectCoverFile(file)
    setSelectModalType('COVER')
    setAlbumVisible(true)
  }

  useEffect(() => {
    if (!albumVisible) {
      setSelectModalType('FILE')
      setSelectCoverFile(undefined)
    }
  }, [albumVisible])

  // 视频数据更改
  const handleChangeVideoData = (newVideoData: MediaDataAlbumListItem[], oldVideoData: MediaDataAlbumListItem[]) => {
    setVideoData(newVideoData)
  }

  // 图片数据更改
  const handleChangeImageData = (newImageData: MediaDataAlbumListItem[], oldImageData: MediaDataAlbumListItem[]) => {
    setImageData(newImageData)
  }

  // 图片数据更改
  const handleChangeBaixingImageData = (newBaixingImageData: MediaDataAlbumListItem[], oldBaixingImageData: MediaDataAlbumListItem[]) => {
    setBaixingImageData(newBaixingImageData)
  }

  // 弹窗模式需要 结束

  // 预览
  const handlePreview = (file: UploadFile) => {
    setPreviewMedia(file)
    setPreviewVisible(true)
  }

  // 取消预览
  const handlePreviewCancel = () => {
    setPreviewVisible(false)
    setPreviewMedia(undefined)
  }

  // 删除
  const handleRemove = (_file: UploadFile, fileIndex: number) => {
    const nowFileList = fileList.filter((item, index) => fileIndex !== index)
    decorateSetFileList(nowFileList, [...fileList])
  }

  // 裁剪
  const handleCrop = (file: UploadFile, fileIndex: number) => {
    setCropItem(file)
    setCropItemIndex(fileIndex)
    setCropVisible(true)
  }

  // 取消裁剪
  const handleCropClose = () => {
    setCropVisible(false)
    setCropItemIndex(undefined)
  }

  // 传入url ，返回裁剪后的图的uid
  const handleCropSuccess = (uid: string, previewUrl: string) => {
    let nowFileList: UploadFile<any>[] = []
    if (!cropProps.notSelectCrop) {
      nowFileList = [...fileList, {
        ...cropItem!,
        uid,
        status: 'done',
        url: uid,
        preview: previewUrl,
        thumbUrl: uid
      }]
    } else {
      nowFileList = fileList.map((item, index) => {
        if (index === cropItemIndex) {
          return {
            ...item,
            url: uid,
            preview: previewUrl,
            thumbUrl: uid
          }
        } else {
          return item
        }
      })
      setCropItemIndex(undefined)
    }
    //  这里file的寻找用|| 是因为 当时上传前裁剪的话，将文件id作为图片的uid使用，保证唯一性
    decorateSetFileList(nowFileList, fileList)
    handleCropClose()
  }

  // 移动事件
  const handleMove = async (file: UploadFile, fileIndex: number, order: -1 | 1) => {
    if (fileList.length <= 1) return
    const newFileList = [...fileList]
    const item = newFileList[fileIndex]
    newFileList[fileIndex] = newFileList[fileIndex + order]
    newFileList[fileIndex + order] = item
    decorateSetFileList(newFileList, fileList)
  }

  // TODO; 暂时没有下载功能就 a标签跳新页面了，就不写这个函数了

  const initConfig = {
    uploadType,
    unique,
    showImage,
    showVideo,
    uploadBtnText,
    maxSize,
    maxLength,
    disabled,
    aspectRatio,
    itemWidth,
    cropProps,
    showUploadList,
    actionBtn,
    itemRender,
  }

  return (
    <>
      <ImgUploadContext.Provider value={{
        fileList,
        imageData,
        videoData,
        baixingImageData,
        initConfig: {
          ...initConfig
        },
        albumVisible,
        selectModalType,
        upDataLoading,
        handleChangeAlbumVisible: setAlbumVisible,
        handleChangeUpDataLoading: setUpDataLoading,
        handleChangeVideoData: handleChangeVideoData,
        handleChangeImageData: handleChangeImageData,
        handleChangeBaixingImageData: handleChangeBaixingImageData,
        handleReloadFileList: reloadFileList,
        handleChangeFileList: decorateSetFileList,
        handlePreview,
        handleRemove,
        handleCrop,
        handleMove,
        handleSelectCover,
      }}>
        {
          uploadType === 1 && <div className={styles['img-upload']}>
            <Upload1
              fileList={fileList}
              initConfig={{ ...initConfig }}
              handleChangeFileList={decorateSetFileList}
              handlePreview={handlePreview}
              handleRemove={handleRemove}
              handleCrop={handleCrop} ></Upload1>
          </div>
        }
        {
          uploadType === 2 && <div className={styles['img-upload']}>
            <Upload2></Upload2>
          </div>
        }
        {
          uploadType === 3 && <Upload3>{children}</Upload3>
        }
        <SelectModal {...SelectModalOption}></SelectModal>
      </ImgUploadContext.Provider>
      <PreviewModal previewVisible={previewVisible} previewMedia={previewMedia} handleCloseModal={handlePreviewCancel}></PreviewModal>
      <CropModal cropVisible={cropVisible} handleCropClose={handleCropClose} cropProps={cropProps} cropUrl={cropItem?.preview} handleCropSuccess={handleCropSuccess}></CropModal>
    </>
  )
}

export const getImgUploadValueModel = (mediaType: MediaType, media: string | null | undefined, coverUrl?: string): MediaItem | '' => {
  if (media) {
    return {
      url: media,
      coverUrl,
      mediaType
    }
  } else {
    return ''
  }
}

export const getImgUploadModelValue = (value: MediaItem | '', isCover?: boolean) => {
  if (value) {
    if (isCover) {
      return value.coverUrl || ''
    } else {
      return value.url
    }
  } else {
    return ''
  }
}

export default ImgUpload
