import { ShowUploadListInterface, UploadFile } from 'antd/lib/upload/interface'
import { CropProps } from '../crop/data';

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
  editData: any;// 传入的数据
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
}

