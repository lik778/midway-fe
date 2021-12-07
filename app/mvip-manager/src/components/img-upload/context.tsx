import React, { FC, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { ImgUploadContextProps, MediaDataAlbumListItem, SelectModalType } from './data'
import { ShopInfo } from '@/interfaces/shop';

const defaultValue = {
  fileList: [],
  initConfig: {
    uploadType: 1 as 1,
    unique: false,
    uploadBtnText: '',
    maxSize: 3,
    maxLength: 1,
    disabled: false,
    aspectRatio: 1 / 1,
    itemWidth: undefined,
    cropProps: {
      aspectRatio: 1 / 1,
    },
    showImage: true,
    showVideo: false
  },
  imageData: [],
  videoData: [],
  baixingImageData: [],
  upDataLoading: false,
  albumVisible: false,
  selectModalType: 'FILE' as SelectModalType,
  handleChangeAlbumVisible: (albumVisible: boolean) => { },
  handleChangeUpDataLoading: (upDataLoading: boolean) => { },
  handleChangeFileList: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => { },
  handleReloadFileList: (newFileList: UploadFile[]) => Promise.resolve([]),
  shopList: [],
  shopCurrent: null,
  loadingShopModel: false,
  handleChangeShopCurrent: (newShopCurrent: ShopInfo) => { },
  handleChangeImageData: (newImageData: MediaDataAlbumListItem[], oldImageData: MediaDataAlbumListItem[]) => { },
  handleChangeVideoData: (newImageData: MediaDataAlbumListItem[], oldImageData: MediaDataAlbumListItem[]) => { },
  handleChangeBaixingImageData: (newBaixingImageData: MediaDataAlbumListItem[], oldBaixingImageData: MediaDataAlbumListItem[]) => { },
  handlePreview: (file: UploadFile) => { },
  handleRemove: (file: UploadFile, fileIndex: number) => { },
  handleCrop: (file: UploadFile, fileIndex: number) => { },
  handleSelectCover: (file: UploadFile, fileIndex: number) => { },
  handleMove: (file: UploadFile, fileIndex: number, order: -1 | 1) => { },
}

const ImgUploadContext = React.createContext<ImgUploadContextProps>(defaultValue);

export default ImgUploadContext