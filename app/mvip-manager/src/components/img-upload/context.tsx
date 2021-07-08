import React, { FC, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { ImgUploadContextProps, ImageDataAtlasTypeListItem } from './data'
import { ShopInfo } from '@/interfaces/shop';

const defaultValue = {
  fileList: [],
  localFileList: [],
  checkFileObject: {},
  imageData: [],
  baixingImageData: [],
  initConfig: {
    uploadType: 1 as 1,
    uploadBtnText: '',
    maxSize: 3,
    maxLength: 1,
    disabled: false,
    aspectRatio: 1 / 1,
    itemWidth: undefined,
    cropProps: {
      aspectRatio: 1 / 1,
    },
  },
  upDataLoading: false,
  atlasVisible: false,
  handleChangeAtlasVisible: (atlasVisible: boolean) => { },
  handleChangeUpDataLoading: (upDataLoading: boolean) => { },
  handleChangeFileList: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => { },
  handleReloadFileList: (newFileList: UploadFile[]) => Promise.resolve([]),
  shopList: [],
  shopCurrent: null,
  loadingShopModel: false,
  handleChangeShopCurrent: (newShopCurrent: ShopInfo) => { },
  handleChangeImageData: (newImageData: ImageDataAtlasTypeListItem[], oldImageData: ImageDataAtlasTypeListItem[]) => { },
  handleChangeBaixingImageData: (newBaixingImageData: ImageDataAtlasTypeListItem[], oldBaixingImageData: ImageDataAtlasTypeListItem[]) => { },
  handleChangeLocalFileList: (newLocalFileList: UploadFile[]) => { },
  handlePreview: (file: UploadFile) => { },
  handleRemove: (file: UploadFile) => { },
  handleCrop: (file: UploadFile) => { },
}

const ImgUploadContext = React.createContext<ImgUploadContextProps>(defaultValue);

export default ImgUploadContext