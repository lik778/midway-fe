import React, { useEffect, useState } from 'react';
import {Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadImgToUpyunHandle } from '@/utils';
import './index.less';

const getBase64 = function(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface Props {
  url?: string;
  text: string;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  maxLength: number | undefined;
  disableBtn?: boolean | undefined;
  onChange(url: string): void;
  fileList?:any[];
}
export const ImgUpload = (props: Props) => {
  const list = props?.fileList || []
  const { text, url, onChange } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any[]>([])
  const uploadButton = (isDisable?:boolean | undefined) =>{
    const txt = props.text || '上传'
    const cls = isDisable? 'upload-btn disabled' : 'upload-btn'
    return (
      <div className={cls}>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </div>
    );
  }

  useEffect(() => {
    if (url) {
      setFileList([{ uid: '-1', status: 'done', url, thumbUrl: url }])
    }
  }, [url])

  const handleCancel = ()=> {
    setPreviewVisible(false)
  }

  const handlePreview = async (file: any) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleChange = async (e: any) => {
    if (e.file.status === 'done') {
      const res = await uploadImgToUpyunHandle(e.file.originFileObj);
      if(res.code === 200) {
        setFileList([e.file])
        onChange(`${res.url.slice(1, )}${window.__upyunImgConfig.imageSuffix}`);
      }
    } else if (e.file.status === 'removed') {
      setFileList([])
    }
  }

  const beforeUpload= (file: any) => {
    if (file.url) {
      return true;
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('请上传jpg、jpeg、png格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('请上传不超过1M的图片');
    }
    return isJpgOrPng && isLt2M;
  }

  return (
    <div className="img-upload">
      <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          disabled={ fileList.length > (props.maxLength || 0)}
        >
        { fileList.length === 0 && uploadButton() }
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
