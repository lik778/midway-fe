import React, { useCallback, useEffect, useMemo, useState, Ref, useImperativeHandle, forwardRef, useRef } from 'react';
import { Upload, Modal, } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface'
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { errorMessage } from '@/components/message';
import ImgItem from './components/img-item'
import { ExpandShowUploadListInterface, ActionBtnListItem } from './data';
import Crop from '@/components/crop'
import { CropProps } from '../crop/data';
const getBase64 = function (file: Blob): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = error => reject(error);
  });
}

// 返回的url/开始初始化的url 处理方式不同
const getUrl = (url: string) => {
  if (url.indexOf('http') !== -1) {
    return url
  } else {
    return `${url.slice(1,)}${window.__upyunImgConfig.imageSuffix}`
  }
}

const getPreviewUrl = async (file: UploadFile): Promise<string | any> => {
  if (file.preview) {
    return file.preview
  } else if (file.url && file.url.indexOf('http') !== -1) {
    return file.url
  } else {
    const preview = getBase64(file.originFileObj);
    return preview
  }
}

interface Props {
  editData: any;
  text: string;
  maxSize?: number;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  maxLength: number;
  disabled?: boolean | undefined;
  fileList?: any[];
  itemWidth?: number | string
  showUploadList?: ExpandShowUploadListInterface
  cropProps: CropProps,
  actionBtn?: ActionBtnListItem[] // 自定义图片上的功能
  /**
   * onChange
   * @param values 当前输出的值
   * @param file 触发本次修改的值
   * @param fileList 当前文件列表
   */
  onChange?(values: string | string[], file: UploadFile | null, fileList: UploadFile[], oldFileList: UploadFile[]): void;
}

const ImgUpload = (props: Props) => {
  const { editData, maxSize, text, maxLength, disabled, itemWidth, showUploadList, cropProps, actionBtn, onChange } = props
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [lastFileList, setLastFileList] = useState<UploadFile[]>([])
  const localMaxSize = useMemo(() => maxSize || 1, [maxSize])

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const [cropVisible, setCropVisible] = useState(false)
  const [cropItem, setCropItem] = useState<UploadFile<any>>()
  const uploadButton = useMemo(() => {
    const txt = text || ''
    const cls = disabled ? 'upload-btn disabled' : 'upload-btn'
    return (
      <div className={cls} style={itemWidth ? { width: itemWidth } : {}}>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </div>
    );
  }, [text, disabled])

  // 包装一下setFileList函数，不需要触发onChange时调用
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
  const decorateSetFileList = useCallback(async (fileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => {
    const newFileList = await createFileList(fileList)
    if (!onChange) return
    //  这里用嵌套if是为了理解简单
    if (newFileList.length === 0) {
      onChange('', file, fileList, oldFileList);
    } else if (newFileList.length === 1) {
      if (newFileList[0].url) {
        onChange(getUrl(newFileList[0].url!), file, newFileList, oldFileList);
      }
    } else {
      if (newFileList.every(item => item.url)) {
        onChange(newFileList.map((item: UploadFile<any>) => getUrl(item.url!)), file, newFileList, oldFileList);
      }
    }
  }, [onChange])

  // 修改值初始化
  const initEdit = () => {
    if (editData) {
      if (Array.isArray(editData)) {
        createFileList(editData.map((item: string, index: number) => ({ uid: `${item}-${index}`, status: 'done', url: item, thumbUrl: item, size: 0, name: '', originFileObj: null as any, type: '', })))
      } else {
        createFileList([{ uid: '-1', size: 0, name: '', originFileObj: null as any, type: '', status: 'done', url: editData, thumbUrl: editData }] as UploadFile[])
      }
    }
  }

  useEffect(() => {
    initEdit()
  }, [editData])

  const beforeUpload = (file: any) => {
    if (file.url) {
      return true;
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      errorMessage('请上传jpg、jpeg、png格式的图片');
    }
    const overrun = file.size / 1024 / 1024 < localMaxSize;
    if (!overrun && isJpgOrPng) {
      errorMessage(`请上传不超过${localMaxSize}M的图片`);
    }
    return isJpgOrPng && overrun;
  }

  const handleChange = async (e: any) => {
    if (!!e.file.status) {
      console.log(e.file)
      if (e.file.status === 'done') {
        const nowFileList = e.fileList.map((item: any) => {
          if (item.url) {
            return item
          } else {
            return {
              ...item,
              url: item.response ? item.response.url : ''
            }
          }
        })
        decorateSetFileList(nowFileList, fileList.filter(item => item.uid !== e.file.uid), e.file)
      } else {
        createFileList([...e.fileList])
      }
    }
  }

  // 预览
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.preview!)
    setPreviewVisible(true)
  }

  const handlePreviewCancel = () => {
    setPreviewVisible(false)
  }

  // 删除
  const handleRemove = (file: UploadFile) => {
    const nowFileList = fileList.filter(item => item.uid !== file.uid)
    decorateSetFileList(nowFileList, [...fileList], file)
  }

  // 裁剪
  const handleCrop = (file: UploadFile) => {
    setCropItem(file)
    setCropVisible(true)
  }

  const handleCropClose = () => {
    setCropVisible(false)
    setCropItem(undefined)
  }

  // 传入url ，返回裁剪后的图的uid
  const handleCropSuccess = (uid: string, previewUrl: string) => {
    const nowFileList = fileList.map(item => {
      if (cropItem?.uid === item.uid) {
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
    decorateSetFileList(nowFileList, fileList, nowFileList.find(item => cropItem?.uid === item.uid)!)
    handleCropClose()
  }

  // TODO; 暂时没有下载功能就 a标签跳新页面了，就不写这个函数了

  return (
    <div className={styles["img-upload"]}>
      <Upload
        action={window.__upyunImgConfig?.uploadUrl}
        data={{
          policy: window.__upyunImgConfig?.uploadParams?.policy,
          signature: window.__upyunImgConfig?.uploadParams?.signature
        }}
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={handleRemove}
        onPreview={handlePreview}
        isImageUrl={(file) => { return true }}
        disabled={disabled}
        itemRender={(originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => <ImgItem file={file} fileList={fileList || []} showUploadList={showUploadList} width={itemWidth} onPreview={handlePreview} onRemove={handleRemove} onCrop={handleCrop} actionBtn={actionBtn}></ImgItem>}
      >
        {fileList.length < maxLength && uploadButton}
      </Upload >
      <Modal
        title="预览图片"
        width={800}
        visible={previewVisible}
        onOk={handlePreviewCancel}
        onCancel={handlePreviewCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal
        width={1220}
        title="裁剪图片"
        visible={cropVisible}
        footer={null}
        maskClosable={false}
        onCancel={handleCropClose}
      >
        <Crop cropProps={cropProps} url={cropItem?.preview!} handleCropSuccess={handleCropSuccess}></Crop>
      </Modal>
    </div >
  )
}

export default ImgUpload