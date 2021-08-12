import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';

export interface ServiceResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message: string;
  requestId: string;
  timestamp: string;
  exception: string;
  exceptionClass: string;
}


export function createRequest() {
  const request = axios.create({
    timeout: 10000,
    responseType: "json",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  })

  request.interceptors.response.use((res: AxiosResponse) => {
    return Promise.resolve(res?.data)
  }, (err: AxiosError) => {
    // console.error('[REQ ERROR]', err)
    return Promise.resolve(err.response && err.response.data)
  })

  return request
}

const BASE_URL = '/management/api'

const request = createRequest()

export const postApi = <T>(path: string, params: any, config: any = {}): Promise<ServiceResponse<T>> => {
  return request.post(config.baseURL || BASE_URL, { method: 'post', path: path, params: JSON.stringify(params) });
}

export const getApi = <T>(path: string, params: any, config: any = {}): Promise<ServiceResponse<T>> => {
  return request.post(config.baseURL || BASE_URL, { method: 'get', path, params });
}