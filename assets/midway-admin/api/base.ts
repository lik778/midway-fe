import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';


const BASE_URL = '/management/api'
const PREFIX = '/api/midway/manager/'

// tips: 前端请求的需要的参数
export interface ManagementReqParams {
  method: string;
  path: string;
  params?: any;
}

const request = axios.create({
  baseURL: BASE_URL, // api 的 base_url
  timeout: 10000, // request timeout  设置请求超时时间
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
})

request.interceptors.response.use((res: AxiosResponse) => {
  if (res?.data.success) {
    return Promise.resolve(res?.data.data)
  } else {
    message.error(res?.data.message);
  }
}, (err: AxiosError) => {
  const errorInfo = err.response && err.response.data && err.response.data.message || '出错了'
  message.error(errorInfo);
})

export const postApi = (path: string, params: any): Promise<any> => {
  return request.post('', { method: 'post', path: `${PREFIX}${path}`, params: JSON.stringify(params) });
}
