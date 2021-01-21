import React, { useEffect, useState } from 'react';
import {Upload, Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadImgToUpyunHandle } from '@/utils';
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
  text: string;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  maxLength: number;
  disableBtn?: boolean | undefined;
  onChange(url: string, status: number): void;
  fileList?:any[];
}
export const BannerImgUpload = (props: Props) => {
  const list = props.fileList || []
  const { onChange } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any[]>([])
  const uploadButton = (isDisable?:boolean | undefined) =>{
    const txt = props.text || '上传'
    const cls = isDisable? 'upload-btn disabled' : 'upload-btn'
    return (
      <Button className={cls} disabled={isDisable}>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </Button>
    );
  }

  useEffect(() => {
    setFileList(list)
  }, [list])

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

  const handleChange = async ({file}) => {
    if (file.status === 'done') {
      const res = await uploadImgToUpyunHandle(file.originFileObj);
      if(res?.code === 200) {
        onChange(`${res?.url.slice(1, )}${window.__upyunImgConfig.imageSuffix}`, 1);
      }else {
        errorMessage(res?.message);
      }
    }
  }

  const beforeUpload= (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      errorMessage('请上传jpg、jpeg、png格式的图片');
    }
    const isLt3M = file.size < 1024 * 1024 * 3;
    if (!isLt3M && isJpgOrPng) {
      errorMessage('请上传不超过3M的图片');
    }
    return isJpgOrPng && isLt3M;
  }

  const handleRemove = (file: any) => {
    onChange(`${file.id}`, 2);
  }


  return (
    <div className="img-upload">
      <Upload
        showUploadList={{showRemoveIcon:true}}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        isImageUrl={()=>{return true}}
        onRemove={handleRemove}
      >
        {fileList?.length >= props.maxLength ? (props.disableBtn? uploadButton(props?.disableBtn): null )
          : uploadButton()}
      </Upload>
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
