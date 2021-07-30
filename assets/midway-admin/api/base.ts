import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';

export function createRequest (apiBase: string) {
  const request = axios.create({
    baseURL: apiBase,
    timeout: 10000,
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

  return request
}

const BASE_URL = '/management/api'

const request = createRequest(BASE_URL)

export const postApi = (path: string, params: any): Promise<any> => {
  return request.post('', { method: 'post', path: path, params: JSON.stringify(params) });
}
