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
  maxLength?: number;
  disableBtn?: boolean | undefined;
  onChange(url: string): void;
  fileList?:any[];
}
export const ImgUpload = (props: Props) => {
  const list = props.fileList
  console.log('list', list)
  const { text, url, onChange } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any[]>([
    // 图片功能不支持正常格式
    // {
    //   displayImgUrl: "http://img4.baixing.net/3bcecddddc2080c5352b527ebdbac73b.png_bi",
    //   hrefUrl: "",
    //   id: 23,
    //   position: 1,
    //   status: "done",
    //   uid: "23",
    //   url: "http://img4.baixing.net/c42c675c6150fedd5956820440d7c9a2.jpg_815x108"
    // },
    // {
    //   uid: '-2',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-3',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-4',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-xxx',
    //   percent: 50,
    //   name: 'image.png',
    //   status: 'uploading',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-5',
    //   name: 'image.png',
    //   status: 'error',
    // },
  ])
  const [imgUrlList, setImgUrlList] = useState<string[]>([])
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

  const handleChange = async ({file, fileList}) => {
    if(beforeUpload(file)){
      setFileList(fileList)
    }

    if (file.status === 'done') {
      console.log('file', file)
      console.log('fileList', fileList)
      const res = await uploadImgToUpyunHandle(file.originFileObj);
      if(res.code === 200) {
        setImgUrlList([...imgUrlList, res.url])
        onChange(`${res.url.slice(1, )}${window.__upyunImgConfig.imageSuffix}`);
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
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          disabled={fileList?.length >= props?.maxLength}
        >
        {fileList?.length >= props?.maxLength ? (props.disableBtn? uploadButton(props?.disableBtn): null )
        : uploadButton()}
      </Upload>
      {/* <p style={{ textAlign: 'center' }}>{text || '上传'}</p> 上传文案显示在上传框里*/}
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
