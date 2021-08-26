import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface'
import styles from './index.less';
import { ImgUploadProps, MediaDataAlbumListItem, MediaItem, MediaType } from './data';
import ImgUploadContext from '@/components/img-upload/context'
import Upload1 from '@/components/img-upload/components/upload1'
import Upload2 from '@/components/img-upload/components/upload2'
import CropModal from '@/components/img-upload/components/crop-modal'
import { getFileBase64 } from '@/utils/index'

// 返回的url/开始初始化的url 处理方式不同
const getUrl = (url: string) => {
  // 判断url里是否有二级域名baixing.
  if (url.indexOf('.baixing.') !== -1) {
    return url
  } else {
    return `${url.slice(1,)}${window.__upyunImgConfig.imageSuffix}`
  }
}

const getPreviewUrl = async (file: UploadFile): Promise<string | any> => {
  if (file.preview) {
    return file.preview
  } else if (file.url && file.url.indexOf('.baixing.') !== -1) {
    return file.url
  } else {
    const preview = getFileBase64(file.originFileObj);
    return preview
  }
}

// 当前组件不要使用useContext(ImgUploadContext)
// 因为在上面解构出来的是初始值，ImgUploadContextComponent组件实际上还没有渲染赋值，一定到ImgUploadContextComponent渲染好后再useContext(ImgUploadContext)
const ImgUpload: FC<ImgUploadProps> = (props) => {
  const { uploadType, editData, maxSize, uploadBtnText, maxLength, disabled, aspectRatio, showUploadList, cropProps, actionBtn, onChange, itemRender, uploadBeforeCrop, onFileChange } = props
  // 下面两个通过connect传进来的，没写到ImgUploadProps里
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const localMaxSize = useMemo(() => maxSize || 1, [maxSize])

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const [cropVisible, setCropVisible] = useState(false)
  const [cropItem, setCropItem] = useState<UploadFile<any>>()
  const [cropItemIndex, setCropItemIndex] = useState<number>()

  const [itemWidth] = useState<number | undefined>(() => {
    return aspectRatio ? aspectRatio * 86 + 16 : undefined
  })

  // 为了保证出参入参不被修改 从这以下不能修改
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
    setFileList(newFileList)
    return newFileList
  }

  // 包装一下setFileList函数，需要触发onChange时调用 做一下图片处理
  const decorateSetFileList = useCallback(async (fileList: UploadFile[], oldFileList: UploadFile[]) => {
    const newFileList = await createFileList(fileList)
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
          mediaType: newFileList[0].type as MediaType
        }, newFileList, oldFileList);
      }
    } else {
      if (newFileList.every(item => item.url)) {
        onChange(newFileList.map((item: UploadFile<any>) => ({
          url: getUrl(item.url!),
          mediaType: newFileList[0].type as MediaType
        })), newFileList, oldFileList);
      }
    }
  }, [onChange])

  // 修改值初始化
  const initEdit = () => {
    if (editData) {
      let fileList: UploadFile[] = []
      if (Array.isArray(editData)) {
        fileList = (editData).map((item, index) => ({ uid: `${item}-${index}`, status: 'done', url: item.url, thumbUrl: item.url, preview: item.url, size: 0, name: '', originFileObj: null as any, type: item.mediaType, }))
        createFileList(fileList)
      } else {
        fileList = [{ uid: '-1', size: 0, name: '', originFileObj: null as any, type: editData.mediaType, status: 'done', url: editData.url, thumbUrl: editData.url, preview: editData.url }]
        createFileList(fileList)
      }
    }
  }

  useEffect(() => {
    initEdit()
  }, [editData])

  // 为了保证出参入参不被修改 从这以上不能修改


  // context 需要
  const [localFileList, setLocalFileList] = useState<UploadFile[]>([])
  const checkFileObject = useMemo(() => {
    const checkFileObject: { [key: string]: boolean } = {}
    localFileList.forEach(item => checkFileObject[item.url!] = true)
    return checkFileObject
  }, [localFileList])
  const [albumVisible, setAlbumVisible] = useState<boolean>(false)
  const [imageData, setImageData] = useState<MediaDataAlbumListItem[]>([])
  const [videoData, setVideoData] = useState<MediaDataAlbumListItem[]>([])
  const [baixingImageData, setBaixingImageData] = useState<MediaDataAlbumListItem[]>([])
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  // 弹窗模式需要 开始
  // 初始化弹窗 开始
  useEffect(() => {
    if (albumVisible) {
      handleChangeLocalFileList([...fileList])
    }
  }, [albumVisible])
  // 初始化弹窗 结束

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

  // 预选择图片
  const handleChangeLocalFileList = (newLocalFileList: UploadFile[]) => {
    setLocalFileList(newLocalFileList)
  }
  // 弹窗模式需要 结束

  // 预览
  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.preview!)
    setPreviewVisible(true)
  }

  // 取消预览
  const handlePreviewCancel = () => {
    setPreviewVisible(false)
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
    if (uploadBeforeCrop) {
      nowFileList = [...fileList, {
        ...cropItem!,
        uid,
        status: 'done',
        url: uid,
        preview: previewUrl,
        thumbUrl: previewUrl
      }]
    } else {
      nowFileList = fileList.map((item, index) => {
        if (index === cropItemIndex) {
          return {
            ...item,
            url: uid,
            preview: previewUrl,
            thumbUrl: previewUrl
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

  // TODO; 暂时没有下载功能就 a标签跳新页面了，就不写这个函数了

  return (
    <>
      <div className={styles['img-upload']}>
        <ImgUploadContext.Provider value={{
          fileList,
          localFileList,
          checkFileObject,
          imageData,
          videoData,
          baixingImageData,
          initConfig: {
            uploadType,
            uploadBtnText,
            maxSize: localMaxSize,
            maxLength,
            disabled,
            aspectRatio,
            itemWidth,
            cropProps,
            showUploadList,
            actionBtn,
            itemRender,
            uploadBeforeCrop
          },
          albumVisible,
          upDataLoading,
          handleChangeAlbumVisible: setAlbumVisible,
          handleChangeUpDataLoading: setUpDataLoading,
          handleChangeVideoData: handleChangeVideoData,
          handleChangeImageData: handleChangeImageData,
          handleChangeBaixingImageData: handleChangeBaixingImageData,
          handleChangeLocalFileList: handleChangeLocalFileList,
          handleReloadFileList: createFileList,
          handleChangeFileList: decorateSetFileList,
          handlePreview,
          handleRemove,
          handleCrop,
        }}>
          {
            uploadType === 1 && <Upload1></Upload1>
          }
          {
            uploadType === 2 && <Upload2></Upload2>
          }
        </ImgUploadContext.Provider>
      </div>
      <Modal
        title="预览图片"
        width={800}
        visible={previewVisible}
        onOk={handlePreviewCancel}
        onCancel={handlePreviewCancel}
        footer={null}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <CropModal cropVisible={cropVisible} handleCropClose={handleCropClose} cropProps={cropProps} cropUrl={cropItem?.preview} handleCropSuccess={handleCropSuccess}></CropModal>
    </>
  )
}

export const getImgUploadValueModel = (mediaType: MediaType, value: string | null | undefined): MediaItem | '' => {
  if (value) {
    return {
      url: value,
      mediaType
    }
  } else {
    return ''
  }
}

export const getImgUploadModelValue = (value: MediaItem | '') => {
  if (value) {
    return value.url
  } else {
    return ''
  }
}

export default ImgUpload