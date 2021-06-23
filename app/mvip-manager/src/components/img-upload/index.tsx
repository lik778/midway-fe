import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Upload, Modal, } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface'
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { errorMessage } from '@/components/message';
import ImgItem from './components/img-item'
import { ExpandShowUploadListInterface } from './data';
import Crop from '@/components/crop'

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
  name: string;
  editData: any;
  text: string;
  maxSize?: number;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  maxLength: number;
  disabled?: boolean | undefined;
  onChange?(url: string | string[]): void;
  fileList?: any[];
  itemWidth?: number | string
  showUploadList?: ExpandShowUploadListInterface
}
export const ImgUpload = (props: Props) => {
  const { editData, name, maxSize, onChange, text, maxLength, disabled, itemWidth, showUploadList } = props
  const [fileList, setFileList] = useState<any[]>([])
  const localMaxSize = useMemo(() => maxSize || 1, [maxSize])

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const [cropVisible, setCropVisible] = useState(false)
  const [cropItem, setCropItem] = useState<UploadFile<any>>()

  const uploadButton = useMemo(() => {
    const txt = text || ''
    const cls = disabled ? 'upload-btn disabled' : 'upload-btn'
    return (
      <div className={cls}>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </div>
    );
  }, [text, disabled])

  // 包装一下setFileList函数 做一下图片处理
  const decorateSetFileList = useCallback(async (fileList: UploadFile[]) => {
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
    console.log(newFileList)
    setFileList(newFileList)
  }, [setFileList])

  // 修改值初始化
  const initEdit = () => {
    if (editData) {
      if (name && editData[name]) {
        if (Array.isArray(editData[name])) {
          decorateSetFileList(editData[name].map((item: any, index: number) => ({ uid: `${item}-${index}`, status: 'done', url: item, thumbUrl: item })))
        } else {
          decorateSetFileList([{ uid: '-1', size: 0, name: '', originFileObj: null as any, type: '', status: 'done', url: editData[name], thumbUrl: editData[name] }] as UploadFile[])
        }
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
      if (e.file.status === 'done') {
        const { url } = e.file.response
        console.log(e.fileList)
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
        if (e.fileList.length === 1) {
          onChange!(getUrl(url));
        } else {
          onChange!(nowFileList.map((item: any) => getUrl(item.url)));
        }
        decorateSetFileList(nowFileList)
      } else {
        decorateSetFileList([...e.fileList])
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
    decorateSetFileList(nowFileList)
    // TODO ; 暂时为了兼容过去的代码 没有图的时候传空字符串
    onChange!(nowFileList.length > 0 ? nowFileList.map(item => getUrl(item.url)) : '')
  }

  // 裁剪
  const handleCrop = (file: UploadFile) => {
    console.log(file)
    setCropItem(file)
    setCropVisible(true)
  }

  const handleCropCancel = () => {
    setCropVisible(false)
    setCropItem(undefined)
  }

  // 传入url ，返回裁剪后的图的uid
  const handleCropSuccess = (uid: string) => {
    const nowFileList = fileList.map(item => {
      if (cropItem?.uid === item.uid) {
        return {
          ...item,
          url: getUrl(uid)
        }
      } else {
        return item
      }
    })
    decorateSetFileList(nowFileList)
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
        itemRender={(originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => <ImgItem file={file} showUploadList={showUploadList} width={itemWidth} onPreview={handlePreview} onRemove={handleRemove} onCrop={handleCrop}></ImgItem>}
      >
        {fileList.length < maxLength && uploadButton}
      </Upload>
      <Modal
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
        onCancel={handleCropCancel}
      >
        <Crop url={cropItem?.preview!} handleCropSuccess={handleCropSuccess}></Crop>
      </Modal>
    </div>
  )
}
