import React, {useState} from 'react';
import { Button, Upload, Modal } from 'antd';
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
    setFileList(fileList)
    if (file.status === 'done') {
      const res = await uploadImgToUpyunHandle(file.originFileObj);
      if(res.code === 200) {
        setImgUrlList([...imgUrlList, res.url])
        console.log('imgList', imgUrlList)
      }
    }
  }

  // const beforeUpload={beforeUpload}
  
  return (
    <div className="img-upload">
      <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
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
