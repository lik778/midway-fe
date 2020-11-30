import React from 'react';
import { Button, Upload } from 'antd';
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
