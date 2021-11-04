import axios, { AxiosError, AxiosResponse } from 'axios';

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

export const postFileUploadApi = <T>(path: string, params: any, config: any = {}): Promise<ServiceResponse<T>> => {
  return request.post('/management/api/file', (function () {
    const formData = new FormData()
    for (const key in params) {
      formData.append(key, params[key])
    }
    formData.append('path', path)
    formData.append('method', 'post')
    return formData
  })(), {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
}

export const getTemplateFile = <T>(params: any): Promise<AxiosResponse> => {
  return axios.post('/management/api/download-template', { method: 'get', path: '', params });
}

export const downloadReport = <T>(path: string, params: any): Promise<AxiosResponse> => {
  return axios.post('/management/api/download-file', { method: 'get', path, params }, {
    responseType: 'blob'
  });
}

export const getApi = <T>(path: string, params: any, config: any = {}): Promise<ServiceResponse<T>> => {
  return request.post(config.baseURL || BASE_URL, { method: 'get', path, params });
}