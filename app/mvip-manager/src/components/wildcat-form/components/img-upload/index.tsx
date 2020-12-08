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
  url: string;
  text: string;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  onChange(url: string): void;
}
export const ImgUpload = (props: Props) => {
  const { text, url, onChange } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any>([])
  const [imgUrlList, setImgUrlList] = useState<string[]>([])

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

  const handleChange = async ({file, fileList}) => {
    if(beforeUpload(file)){
      setFileList(fileList)
    }

    if (file.status === 'done') {
      const res = await uploadImgToUpyunHandle(file.originFileObj);
      if(res.code === 200) {
        setImgUrlList([...imgUrlList, res.url])
        onChange(`${res.url}${window.__upyunImgConfig.imageSuffix}`);
      }
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
          listType='picture-card'
          fileList={fileList}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
        {fileList.length < 1 && (
          <div>
            <PlusOutlined />
          </div>
        )}
      </Upload>
      <p style={{ textAlign: 'center' }}>{text || '上传'}</p>
      <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}
