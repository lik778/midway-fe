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
  editData: any;
  text: string;
  maxSize?: number;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  maxLength: number;
  disabled?: boolean | undefined;
  fileList?: any[];
  itemWidth?: number | string
  showUploadList?: ExpandShowUploadListInterface
  cropProps: CropProps,
  actionBtn?: ActionBtnListItem[] // 自定义图片上的功能
  /**
   * onChange
   * @param values 当前输出的值
   * @param file 触发本次修改的值
   * @param fileList 当前文件列表
   */
  onChange?(values: string | string[], file: UploadFile | null, fileList: UploadFile[], oldFileList: UploadFile[]): void;
}

