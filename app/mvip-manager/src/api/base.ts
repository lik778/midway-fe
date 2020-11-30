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
const bePrefix = '/api/midway/backend/'

request.interceptors.response.use((res: AxiosResponse) => {
  return Promise.resolve(res.data)
  }, (err: AxiosError) => {
  const errorInfo = err.response && err.response.data && err.response.data.message || '出错了'
  // 该报错会触发系统报错，先注释
  // message.error(errorInfo);
  // 报错输出，前端监听处理
  return Promise.resolve(err.response && err.response.data)
})

export const postApi = (url: string, data: ManagementReqParams): Promise<AxiosResponse<any>> => {
  const { method, path, params } = data;
  return request.post(url, { method, params, path });
}

export const getApi = (url: string, params?: any): Promise<AxiosResponse<any>> => {
  return request.get(url, {  params });
}

export const postApiData = (path: string, params?:any): Promise<any> => {
  const p = JSON.stringify(params)
  return postApi(apiPrefix, { method: 'post', path: `${bePrefix}${path}`,
  params: p,
  })
}

