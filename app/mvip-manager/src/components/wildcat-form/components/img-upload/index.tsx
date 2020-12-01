import React, {useState} from 'react';
import { Button, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadImgToUpyunHandle } from '@/utils';

const uploadProps = {
  name: 'file',
  multiple: false,
  onChange(e: any) {
    if (e.file.status === 'done') {
      uploadImgToUpyunHandle(e.file.originFileObj).then(res => {
        console.log('上传又拍云成功', res)
      })
    }
  },
};

function getBase64(file) {
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
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className='upload-img'>上传</div>
    </div>
  );

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
  
  return (
    <div className="img-upload">
      <Upload {...uploadProps} listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}>
        {fileList.length >= 8 ? null : uploadButton}
        
      </Upload>
      <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <p className="tip">{props.tip}</p>
    </div>
  )
}
