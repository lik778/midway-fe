import * as React from 'react'
import { FC, useEffect, useState } from 'react'
import { Upload, Modal, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface Props {
  onChange?: (val: []) => void
}

const UpFile: FC<Props> = (props) => {
  const { onChange } = props
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)
  const [previewMedia, setPreviewMedia] = useState<string>('')
  const uploadButton = (
    <div>
      <div style={{ marginTop: 8, color: '#999' }}>选择图片</div>
    </div>
  );

  const handleChange = ({ fileList }) => {
    onChange(fileList)
    setFileList(fileList)
  }

  const handlePreview = (file: UploadFile) => {
    setPreviewMedia(file.thumbUrl)
    setPreviewVisible(true)
  }

  return <><Upload
    accept="image/jpeg,image/jpg,image/png"
    listType="picture-card"
    beforeUpload={() => false}
    fileList={fileList}
    onChange={handleChange}
    onPreview={handlePreview}
    multiple={true}
  >
    {fileList.length >= 10 ? null : uploadButton}
  </Upload>
    <Modal
      visible={previewVisible}
      title={'预览图片'}
      width={'600px'}
      footer={null}
      onCancel={() => setPreviewVisible(false)}
    >
      <img alt="example" style={{ width: '100%' }} src={previewMedia} />
    </Modal>
  </>
}

export default UpFile