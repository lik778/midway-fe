import { Select } from "antd";
import { UploadFile } from 'antd/lib/upload/interface';

export interface SelectModalProps {
  showVideo: boolean,
  maxLength: number,
  fileList: UploadFile[],
  handleChangeFileList: (newFileList: UploadFile<any>[], oldFileList: UploadFile<any>[], file: UploadFile<any> | null) => void
}