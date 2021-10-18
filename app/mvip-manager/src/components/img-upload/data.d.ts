import React from 'react';
import { ShowUploadListInterface, UploadFile } from 'antd/lib/upload/interface'
import { CropProps } from '../crop/data';
import { MediaAssetsItem, MediaCatesNameListItem } from '@/interfaces/shop'

export type MediaType = 'IMAGE' | 'VIDEO'
export type SelectModalType = 'FILE' | 'COVER'

// 对外的值
/**
 * url 媒体项的url
 * coverUrl 如果是视频则需要传入它的封面图
 * mediaType 媒体项类型
 */
export type MediaItem = {
  url: string,
  coverUrl?: string,
  mediaType: MediaType
}

export interface ExpandShowUploadListInterface extends ShowUploadListInterface {
  showCropIcon?: boolean // 是否显示裁剪icon
  cropIcon?: React.ReactNode
  previewIcon?: React.ReactNode
  showSelectCoverIcon?: boolean // 是否显示选择封面图
  selectCoverIcon?: React.ReactNode
}

export interface ActionBtnListItem {
  icon: (file: UploadFile, fileList: UploadFile[]) => (React.ReactElement | null),
  action: (file: UploadFile, fileList: UploadFile[], fileIndex: number, handleChangeFileList: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => void) => any
  title?: string // 动作描述
}

export interface ImgUploadProps {
  uploadType: 1 | 2,//1：直接上传  2：打开图库
  unique?: boolean,// 是否禁止选择重复图片
  showImage?: boolean,// 是否显示图片相关tab
  showVideo?: boolean,// 是否显示视频相关tab
  editData?: MediaItem | MediaItem[] | '';// 传入的数据
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
  // 当uploadType === 1 时的可选 结束
  /**
   * onChange
   * @param values 当前输出的值 '' 就是无输入状态
   * @param fileList 当前文件列表
   * @param oldFileList 上一次文件列表
   */
  onChange?(values: MediaItem | MediaItem[] | '', fileList: UploadFile[], oldFileList: UploadFile[]): void;
  [key: string]: any
  /**
 * onChange
 * @description 当前文件列表变化 可能还在上传中状态
 * @param fileList 当前文件列表
 */
  onFileChange?(fileList: UploadFile[]): void
}

export interface MediaDataAlbumListItem {
  id: number,
  name: string,
  media: MediaAssetsItem[]
  page: number,// 当前类型数据已经翻到多少页
  total: number,// 当前类型总页数
  init: boolean // 是否初始化过
}

export interface ImgUploadContextInitConfig {
  uploadType: 1 | 2,//1：直接上传  2：打开图库
  unique: boolean,// 是否禁止选择重复图片
  showImage: boolean,// 是否显示图片相关tab
  showVideo: boolean,// 是否显示视频相关tab
  uploadBtnText: string;// 上传按钮上的提示文本
  maxSize: number;// 单个图片最大尺寸
  maxLength: number;// 本次上传个数上线
  disabled: boolean;// 是否禁用
  aspectRatio?: number// 图片不是正方形的时候通过传比例去设置长度
  itemWidth?: number// 根据aspectRatio算出的长度
  showUploadList?: ExpandShowUploadListInterface// 按钮控制
  cropProps: CropProps,// 裁剪参数
  actionBtn?: ActionBtnListItem[] // 自定义图片上的功能
  // 当uploadType === 1 时的可选 开始
  uploadBeforeCrop?: boolean,// 选择时裁剪
  itemRender?: (originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => React.ReactNode // 自定义图片样式
}

export interface ImgUploadContextProps {
  fileList: UploadFile[],// 当前选择的文件列表
  initConfig: ImgUploadContextInitConfig,
  albumVisible: boolean, // 图片库是否显示
  selectModalType: SelectModalType,
  videoData: MediaDataAlbumListItem[],
  imageData: MediaDataAlbumListItem[],
  baixingImageData: MediaDataAlbumListItem[],
  upDataLoading: boolean
  handleChangeAlbumVisible: (albumVisible: boolean) => void
  handleChangeUpDataLoading: (upDataLoading: boolean) => void // 更新组件内打接口的loading
  handleChangeVideoData: (newVideoData: MediaDataAlbumListItem[], oldVideoData: MediaDataAlbumListItem[]) => void // 更新视频数据
  handleChangeImageData: (newImageData: MediaDataAlbumListItem[], oldImageData: MediaDataAlbumListItem[]) => void // 更新图片数据
  handleChangeBaixingImageData: (newImageData: MediaDataAlbumListItem[], oldImageData: MediaDataAlbumListItem[]) => void // 更新图片数据
  /**
 * onFileChange
 * @param newFileList: 操作后的数组
 * @param oldFileList: 操作前的数组
 * @param file: 引发本次操作的文件
 */
  handleChangeFileList: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => void
  // 更新确认选择文件
  handleReloadFileList: (fileList: UploadFile[]) => Promise<UploadFile<any>[]> // 更新数组但是不会触发onChange通知外部
  handlePreview: (file: UploadFile) => void
  handleRemove: (file: UploadFile, fileIndex: number) => void
  handleCrop: (file: UploadFile, fileIndex: number) => void
  handleSelectCover: (file: UploadFile, fileIndex: number) => void
}
