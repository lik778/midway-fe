import React, { FC, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { connect } from 'react-redux';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { CropProps } from '../crop/data';
import { ImgUploadContextProps, ImageData, ExpandShowUploadListInterface, ActionBtnListItem, AtlasShopListItem } from './data'
import { useEffect } from 'react';
import { ShopInfo } from '@/interfaces/shop';

export const ImgUploadContext = React.createContext<ImgUploadContextProps>({
  fileList: [],
  initConfig: {
    uploadType: 1,
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
  shopList: [],
  shopCurrent: null,
  loadingShopModel: false,
  imageData: {},
  handleChangeShopCurrent: (newShopCurrent: ShopInfo) => { },
  handleChangeImageData: (newImageData: ImageData, oldImageData: ImageData) => { },
});

interface Props {
  uploadType: 1 | 2,//1：直接上传  2：打开图库
  uploadBtnText: string;// 上传按钮上的提示文本
  maxSize?: number;// 单个图片最大尺寸
  maxLength: number;// 本次上传个数上线
  disabled?: boolean | undefined;// 是否禁用
  aspectRatio?: number// 图片不是正方形的时候通过传比例去设置长度
  showUploadList?: ExpandShowUploadListInterface// 按钮控制
  cropProps: CropProps,// 裁剪参数
  actionBtn?: ActionBtnListItem[], // 自定义图片上的功能
  fileList: UploadFile[],
  handleChangeFileList: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => {},
  [key: string]: any
}

const ImgUploadContextComponent: FC<Props> = function (props): JSX.Element {
  const { uploadType, fileList, maxSize, uploadBtnText, maxLength, disabled, aspectRatio, showUploadList, cropProps, actionBtn, handleChangeFileList } = props
  const { shopList, getShopList, loadingShopModel } = props
  const [atlasVisible, setAtlasVisible] = useState<boolean>(uploadType === 2)
  const [imageData, setImageData] = useState<ImageData>({})
  const [shopListFilter, setShopListFilter] = useState<ShopInfo[]>([])
  const [shopCurrent, setShopCurrent] = useState<ShopInfo | null>(null)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  useEffect(() => {
    const newShopListFilter = shopList ? (shopList as ShopInfo[]).filter(item => item.status === 1) : []
    setShopListFilter(newShopListFilter)
    setShopCurrent(newShopListFilter.length > 0 ? newShopListFilter[0] : null)
  }, [shopList])

  useEffect(() => {
    if (!loadingShopModel) {
      getShopList()
    }
  }, [])

  // 当前店铺修改
  const handleChangeShopCurrent = (newShopCurrent: ShopInfo) => {
    setShopCurrent(newShopCurrent)
  }

  // 图片数据更改
  const handleChangeImageData = (newImageData: ImageData, oldImageData: ImageData) => {
    setImageData(newImageData)
  }

  return <ImgUploadContext.Provider value={{
    fileList,
    imageData,
    initConfig: {
      uploadType,
      uploadBtnText,
      maxSize,
      maxLength,
      disabled,
      aspectRatio,
      cropProps,
      showUploadList,
      actionBtn,
    },
    atlasVisible,
    shopList: shopListFilter,
    shopCurrent,
    loadingShopModel,
    upDataLoading,
    handleChangeAtlasVisible: setAtlasVisible,
    handleChangeUpDataLoading: setUpDataLoading,
    handleChangeShopCurrent: handleChangeShopCurrent,
    handleChangeFileList: handleChangeFileList,
    handleChangeImageData: handleChangeImageData,
  }}>
    {
      props.children
    }
  </ImgUploadContext.Provider>
};

export default connect<any, any, Props>((state: any) => {
  const { shopList } = (state as ConnectState)[SHOP_NAMESPACE]
  const { loading } = (state as ConnectState)
  return { shopList, loadingShopModel: loading.models.shop }
}, (dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
})(ImgUploadContextComponent);
