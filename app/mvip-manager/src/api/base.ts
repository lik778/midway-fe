import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';

// tips: 前端请求的需要的参数
export interface ManagementReqParams {
  method: string;
  path: string;
  params?: any;
}

const request = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // request timeout  设置请求超时时间
  responseType: "json",
  withCredentials: true,
  headers: {
  "Content-Type": "application/json;charset=utf-8"
  }
})

const apiPrefix = '/management/api'
const bePrefix = '/midway/backend/'

request.interceptors.response.use((res: AxiosResponse) => {
  return Promise.resolve(res.data)
  }, (err: AxiosError) => {
  message.error(err.response && err.response.data && err.response.data.message || '出错了');
})

export const postApi = (url: string, params?: object): Promise<AxiosResponse<any>> => {
  return request.post(url, { ...params});
}

export const postApiData = (path: string, params?:object): Promise<any> => {
  const url = `${apiPrefix}${bePrefix}${path}`
  return postApi(url, params)
}

