import { getApi } from '@/api/base';
import { UpyunImgConfig } from '@/interfaces/haojing';

// 获取又拍云数据
export const getUpyunImgConfig = (): Promise<UpyunImgConfig> => {
  return getApi('/haojing/upyunImgConfig', {})
}
