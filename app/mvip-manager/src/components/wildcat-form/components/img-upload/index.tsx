import React, { useEffect, useMemo, useState } from 'react';
import {Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';
import { errorMessage } from '@/components/message';

const getBase64 = function(file: Blob) {
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
  maxSize?:number;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  maxLength: number | undefined;
  disableBtn?: boolean | undefined;
  onChange(url: string): void;
  fileList?:any[];
}
export const ImgUpload = (props: Props) => {
  const { editData, name, maxSize, onChange } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any[]>([])
  const localMaxSize = useMemo(()=>maxSize||1 ,[maxSize])
  const uploadButton = (isDisable?:boolean | undefined) =>{
    const txt = props.text || ''
    const cls = isDisable? 'upload-btn disabled' : 'upload-btn'
    return (
      <div className={cls}>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </div>
    );
  }

  useEffect(() => {
    if (editData) {
      if (name && editData[name]) {
        setFileList([{ uid: '-1', status: 'done', url: editData[name], thumbUrl: editData[name] }])
      }
    }
  }, [editData])

  const handleCancel = ()=> {
    setPreviewVisible(false)
  }

  const handlePreview = async (file: any) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
  }

  const handleChange = async (e: any) => {
    if(!!e.file.status){
      if (e.file.status === 'done') {
        const { url } = e.file.response
        onChange(`${url.slice(1, )}${window.__upyunImgConfig.imageSuffix}`);
      }
      setFileList([...e.fileList])
    }
  }

  const handleRemove = (file: any) => {
    setFileList([])
    onChange('')
  }

  const beforeUpload= (file: any) => {
    if (file.url) {
      return true;
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      errorMessage('请上传jpg、jpeg、png格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < localMaxSize;
    if (!isLt2M && isJpgOrPng) {
      errorMessage(`请上传不超过${localMaxSize}M的图片`);
    }
    return isJpgOrPng && isLt2M;
  }

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
