import { ShowUploadListInterface, UploadFile } from 'antd/lib/upload/interface'

export interface ExpandShowUploadListInterface extends ShowUploadListInterface {
  showCropIcon?: boolean // 是否显示裁剪icon
  cropIcon?: React.ReactNode
  previewIcon?: React.ReactNode
}

export interface ActionBtnListItem {
  icon: (file: UploadFile) => React.ReactElement,
  action: (file: UploadFile) => any
  title?: string // 动作描述
}