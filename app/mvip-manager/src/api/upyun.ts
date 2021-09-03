import { getApi } from '@/api/base';
import { UpyunImgConfig, UpyunVideoConfig, UpyunGenTaskParams, UploadParams } from '@/interfaces/haojing';

// 获取又拍云数据
export const getUpyunImgConfigUpyun = (): Promise<UpyunImgConfig> => {
  return getApi('/upyun/upyunImgConfig', {})
}
export const getUpyunVideoConfigUpyun = (): Promise<UpyunVideoConfig> => {
  return getApi('/upyun/upyunVideoConfig', {})
}
export const getUpyunTaskConfig = (params: UpyunGenTaskParams): Promise<UploadParams> => {
  return getApi('/upyun/getUpyunTaskConfig', params)
}
