import { getApi } from '@/api/base';
import axios from 'axios';
import { UpyunImgConfig } from '@/interfaces/haojing';

// 获取又拍云数据
export const getUpyunImgConfig = (): Promise<UpyunImgConfig> => {
  return getApi('/haojing/upyunImgConfig')
}

// 上传至又拍云
export const uploadImgToUpyunReq = (url: string, params: FormData) => {
  return axios.post(url, params,  { headers: { 'Content-Type': 'multipart/form-data' } })
}
