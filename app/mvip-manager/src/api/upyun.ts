import { getApi } from '@/api/base';
import { UpyunImgConfig } from '@/interfaces/haojing';

// 获取又拍云数据
export const getUpyunImgConfigUpyun = (): Promise<UpyunImgConfig> => {
  return getApi('/upyun/upyunImgConfig', {})
}
