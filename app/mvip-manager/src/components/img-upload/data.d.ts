import { ShowUploadListInterface, UploadFile } from 'antd/lib/upload/interface'
import { CropProps } from '../crop/data';
import { ShopInfo, AtlasTypeListItem, AtlasImageListItem } from '@/interfaces/shop'
export interface ExpandShowUploadListInterface extends ShowUploadListInterface {
  showCropIcon?: boolean // 是否显示裁剪icon
  cropIcon?: React.ReactNode
  previewIcon?: React.ReactNode
}

export interface ActionBtnListItem {
  icon: (file: UploadFile, fileList: UploadFile[]) => (React.ReactElement | null),
  action: (file: UploadFile, fileList: UploadFile[]) => any
  title?: string // 动作描述
}

export interface ImgUploadProps {
  uploadType: 1 | 2,//1：直接上传  2：打开图库
  editData?: any;// 传入的数据
  uploadBtnText: string;// 上传按钮上的提示文本
  maxSize?: number;// 单个图片最大尺寸
  maxLength: number;// 本次上传个数上线
  disabled?: boolean | undefined;// 是否禁用
  aspectRatio?: number// 图片不是正方形的时候通过传比例去设置长度
  showUploadList?: ExpandShowUploadListInterface// 按钮控制
  cropProps: CropProps,// 裁剪参数
  actionBtn?: ActionBtnListItem[] // 自定义图片上的功能
  /**
   * onChange
   * @param values 当前输出的值
   * @param file 触发本次修改的值
   * @param fileList 当前文件列表
   */
  onChange?(values: string | string[], file: UploadFile | null, fileList: UploadFile[], oldFileList: UploadFile[]): void;
  [key: string]: any
}


export interface ImageDataAtlasTypeListItem extends AtlasTypeListItem {
  images: AtlasImageListItem[]
  page: number,// 当前类型数据已经翻到多少页
  total: number,// 当前类型总页数
  init: boolean // 是否初始化过
}

export interface ImgUploadContextProps {
  fileList: UploadFile[],// 当前选择的文件列表
  initConfig: {
    uploadType: 1 | 2,//1：直接上传  2：打开图库
    uploadBtnText: string;// 上传按钮上的提示文本
    maxSize?: number;// 单个图片最大尺寸
    maxLength: number;// 本次上传个数上线
    disabled?: boolean | undefined;// 是否禁用
    aspectRatio?: number// 图片不是正方形的时候通过传比例去设置长度
    itemWidth?: number// 根据aspectRatio算出的长度
    showUploadList?: ExpandShowUploadListInterface// 按钮控制
    cropProps: CropProps,// 裁剪参数
    actionBtn?: ActionBtnListItem[] // 自定义图片上的功能
  },
  atlasVisible: boolean, // 图片库是否显示
  shopList: ShopInfo[]  // 因为model里初始化时null
  shopCurrent: ShopInfo | null // 当前选择的店铺
  loadingShopModel: boolean,// 当前
  imageData: ImageDataAtlasTypeListItem[],
  baixingImageData: ImageDataAtlasTypeListItem[],
  upDataLoading: boolean
  handleChangeAtlasVisible: (atlasVisible: boolean) => void
  handleChangeUpDataLoading: (upDataLoading: boolean) => void // 更新组件内打接口的loading
  /**
   * onFileChange
   * @param newFileList: 操作后的数组
   * @param oldFileList: 操作前的数组
   * @param file: 引发本次操作的文件
   */
  handleChangeFileList: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => void // 更新确认选择文件
  handleChangeShopCurrent: (newShopCurrent: ShopInfo) => void // 更新当前店铺
  handleChangeImageData: (newImageData: ImageDataAtlasTypeListItem[], oldImageData: ImageDataAtlasTypeListItem[]) => void // 更新图片数据
  handleChangeBaixingImageData: (newImageData: ImageDataAtlasTypeListItem[], oldImageData: ImageDataAtlasTypeListItem[]) => void // 更新图片数据
}
