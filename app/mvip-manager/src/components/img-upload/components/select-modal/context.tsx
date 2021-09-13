import React, { FC, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { ShopInfo } from '@/interfaces/shop';


const defaultValue = {
  showVideo: false,
  maxLength: 0,
  localFileList: [],
  handleChangeLocalFileList: (newLocalFileList: UploadFile[]) => { },
}

const ImgUploadContext = React.createContext<{
  showVideo: boolean,
  maxLength: number,
  localFileList: UploadFile[],
  handleChangeLocalFileList: (newLocalFileList: UploadFile[]) => void
}>(defaultValue);

export default ImgUploadContext