import React, {useState} from 'react';
import {Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadImgToUpyunHandle } from '@/utils';
import classNames from 'classnames';
import './index.less';

const getBase64 = function(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


export const ImgUpload = (props: any) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([])
  const [imgUrlList, setImgUrlList] = useState<string[]>([])
  const uploadButton = () =>{
    const txt = props.txt || '上传'
    return (
      <div>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </div>
    );
  }

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
      }
    }
  }

  const beforeUpload= (file: any) => {
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

  const type = props.imgType || 'picture-card'
  
  return (
    <div className="img-upload">
      <Upload
          listType={type}
          fileList={fileList}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
        {fileList.length >= 1 ? null : uploadButton()}
      </Upload>
      <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}
