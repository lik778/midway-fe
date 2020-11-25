//主要的页面方式
import React from 'react';
import { message, Button, Upload } from 'antd';

const uploadProps = {
  name: 'file',
  multiple: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info: any) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export const ImgUpload = (props: any) => {
  return (
    <div>
      <Upload {...uploadProps}>
        <Button>上传</Button>
      </Upload>
      <p>图片格式：jpg、jpeg、png，大小不超过1M，图片比例1：1，建议最小尺寸100*100</p>
    </div>
  )
}
