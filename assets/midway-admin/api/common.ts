import { getApiData } from '../api/base'
import { UpyunImgConfig } from '../interfaces/common';

// 获取又拍云数据
export const getUpyunImgConfigUpyun = () => {
  return getApiData('/upyun/upyunImgConfig', {})
}