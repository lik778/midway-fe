import React from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { CropProps } from '../crop/data';

const ImgUploadContext = React.createContext<{
  fileList: UploadFile[],
  uploadBtnText: string;// 上传按钮上的提示文本
  maxSize?: number;// 单个图片最大尺寸
  maxLength: number;// 本次上传个数上线
  disabled?: boolean | undefined;// 是否禁用
  aspectRatio?: number// 图片不是正方形的时候通过传比例去设置长度
  itemWidth?: number// 根据aspectRatio算出的长度
  cropProps: CropProps,// 裁剪参数
  /**
 * onFileChange 
 * @param newFileList: 操作后的数组
 * @param oldFileList: 操作前的数组
 * @param file: 引发本次操作的文件
 */
  onChange: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => void
}>({
  fileList: [],
  uploadBtnText: '',
  maxSize: 3,
  maxLength: 1,
  disabled: false,
  aspectRatio: 1 / 1,
  itemWidth: undefined,
  cropProps: {
    aspectRatio: 1 / 1,
  },
  onChange: (newFileList: UploadFile[], oldFileList: UploadFile[], file: UploadFile | null) => { }
});

export default ImgUploadContext