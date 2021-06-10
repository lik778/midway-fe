import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';
import { errorMessage } from '@/components/message';

const getBase64 = function (file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
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
}
export const ImgUpload = (props: Props) => {
  const { editData, name, maxSize, onChange, text, maxLength, disabled } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any[]>([])
  const localMaxSize = useMemo(() => maxSize || 1, [maxSize])
  const uploadButton = (isDisable?: boolean | undefined) => {
    const txt = text || ''
    const cls = isDisable ? 'upload-btn disabled' : 'upload-btn'
    return (
      <div className={cls}>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </div>
    );
  }

  // 修改值初始化
  const initEdit = () => {
    if (editData) {
      if (name && editData[name]) {
        if (Array.isArray(editData[name])) {
          setFileList(editData[name].map((item: any) => ({ uid: item, status: 'done', url: item, thumbUrl: item })))
        } else {
          setFileList([{ uid: '-1', status: 'done', url: editData[name], thumbUrl: editData[name] }])
        }
      }
    }
  }

  useEffect(() => {
    initEdit()
  }, [editData])

  const handleCancel = () => {
    setPreviewVisible(false)
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }

  // 返回的url/开始初始化的url 处理方式不同
  const getUrl = (url: string) => {
    if (url.indexOf('http') !== -1) {
      return url
    } else {
      return `${url.slice(1,)}${window.__upyunImgConfig.imageSuffix}`
    }
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
        setFileList(nowFileList)
      } else {
        setFileList([...e.fileList])
      }
    }
  }

  const handleRemove = (file: any) => {
    console.log(file)
    console.log(file)
    const nowFileList = fileList.filter(item => item.uid !== file.uid)
    setFileList(nowFileList)
    onChange!(nowFileList.map(item => getUrl(item.url)))
  }

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


  useEffect(() => {
    console.log(fileList)
  }, [fileList])

  return (
    <div className="img-upload">
      <Upload
        action={window.__upyunImgConfig?.uploadUrl}
        data={{
          policy: window.__upyunImgConfig?.uploadParams?.policy,
          signature: window.__upyunImgConfig?.uploadParams?.signature
        }}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={handleRemove}
        isImageUrl={(file) => { return true }}
        disabled={disabled}
      >
        {fileList.length < maxLength && uploadButton()}
      </Upload>
      <Modal
        visible={previewVisible}
        onOk={handleCancel}
        onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}
