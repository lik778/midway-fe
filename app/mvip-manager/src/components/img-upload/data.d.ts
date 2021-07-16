import React from 'react';
import { ShowUploadListInterface, UploadFile } from 'antd/lib/upload/interface'
import { CropProps } from '../crop/data';
import { ShopInfo, ImageItem, AlbumNameListItem } from '@/interfaces/shop'

export interface ExpandShowUploadListInterface extends ShowUploadListInterface {
  showCropIcon?: boolean // 是否显示裁剪icon
  cropIcon?: React.ReactNode
  previewIcon?: React.ReactNode
}

export interface ActionBtnListItem {
  icon: (file: UploadFile, fileList: UploadFile[]) => (React.ReactElement | null),
  action: (file: UploadFile, fileList: UploadFile[], fileIndex: number) => any
  title?: string // 动作描述
}

export interface ImgUploadProps {
  uploadType: 1 | 2,//1：直接上传  2：打开图库
  editData?: string | string[];// 传入的数据
  uploadBtnText: string;// 上传按钮上的提示文本
  maxSize?: number;// 单个图片最大尺寸
  maxLength: number;// 本次上传个数上线
  disabled?: boolean | undefined;// 是否禁用
  aspectRatio?: number// 图片不是正方形的时候通过传比例去设置长度
  showUploadList?: ExpandShowUploadListInterface// 按钮控制
  cropProps: CropProps,// 裁剪参数
  actionBtn?: ActionBtnListItem[] // 自定义图片上的功能

  // 当uploadType === 1 时的可选 开始
  uploadBeforeCrop?: boolean,// 选择时裁剪 
  itemRender?: (originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => React.ReactNode // 自定义图片样式
  // 当uploadType === 1 时的可选 结束
  /**
   * onChange
   * @param values 当前输出的值
   * @param file 触发本次修改的值
   * @param fileList 当前文件列表
   */
  onChange?(values: string | string[], fileList: UploadFile[], oldFileList: UploadFile[]): void;
  [key: string]: any
}

export interface ImageDataAlbumListItem {
  id: number,
  name: string,
  images: ImageItem[]
  page: number,// 当前类型数据已经翻到多少页
  total: number,// 当前类型总页数
  init: boolean // 是否初始化过
}

export interface ImageData {
  [key: string]: ImageDataAlbumListItem[]
}

export interface ImgUploadContextProps {
  fileList: UploadFile[],// 当前选择的文件列表
  localFileList: UploadFile[],// 用户预选择的文件列表
  checkFileObject: {
    [key: string]: boolean
  },// 用户预选择文件的对象，空间换时间
  initConfig: {
    uploadType: 1 | 2,//1：直接上传  2：打开图库
    uploadBtnText: string;// 上传按钮上的提示文本
    maxSize: number;// 单个图片最大尺寸
    maxLength: number;// 本次上传个数上线
    disabled?: boolean | undefined;// 是否禁用
    aspectRatio?: number// 图片不是正方形的时候通过传比例去设置长度
    itemWidth?: number// 根据aspectRatio算出的长度
    showUploadList?: ExpandShowUploadListInterface// 按钮控制
    cropProps: CropProps,// 裁剪参数
    actionBtn?: ActionBtnListItem[] // 自定义图片上的功能
    // 当uploadType === 1 时的可选 开始
    uploadBeforeCrop?: boolean,// 选择时裁剪 
    itemRender?: (originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => React.ReactNode // 自定义图片样式
  },
  albumVisible: boolean, // 图片库是否显示
  shopList: ShopInfo[]  // 因为model里初始化时null
  shopCurrent: ShopInfo | null // 当前选择的店铺
  loadingShopModel: boolean,// 当前shop Model是否在请求状态
  imageData: ImageData,
  baixingImageData: ImageDataAlbumListItem[],
  upDataLoading: boolean
  handleChangeAlbumVisible: (albumVisible: boolean) => void
  handleChangeUpDataLoading: (upDataLoading: boolean) => void // 更新组件内打接口的loading
  /**
   * onFileChange
   * @param newFileList: 操作后的数组
   * @param oldFileList: 操作前的数组
   * @param file: 引发本次操作的文件
   */
  handleChangeFileList: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => void
  // 更新确认选择文件
  handleReloadFileList: (fileList: UploadFile[]) => Promise<UploadFile<any>[]> // 更新数组但是不会触发onChange通知外部
  handleChangeShopCurrent: (newShopCurrent: ShopInfo) => void // 更新当前店铺
  handleChangeImageData: (newImageData: ImageData, oldImageData: ImageData) => void // 更新图片数据
  handleChangeBaixingImageData: (newImageData: ImageDataAlbumListItem[], oldImageData: ImageDataAlbumListItem[]) => void // 更新图片数据
  handleChangeLocalFileList: (newLocalFileList: UploadFile[]) => void,
  handlePreview: (file: UploadFile) => void
  handleRemove: (file: UploadFile, fileIndex: number) => void
  handleCrop: (file: UploadFile, fileIndex: number) => void
}
