import axios, { AxiosError, AxiosResponse } from 'axios';
import { HAO_JING_HOST } from '../constants'
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

export interface ApiReqParams {
  method: string;
  path: string;
  params?: any;
}

const NotAuthCode = [1002, 1029]

const verifyAuthCode = (res: AxiosResponse) => {
  if (NotAuthCode.includes(res.data.code)) {
    alert("该账号暂无权限，请登录管理员账号");
    // const haojingHost = config().env;
    location.href = `${HAO_JING_HOST}/oz/login`
  }
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
    if (res.data) {
      verifyAuthCode(res)
      return res.data
    } else {
      return res
    }
  }, (err: AxiosError) => {
    return Promise.resolve(err.response && err.response.data)
  })

  return request
}

const BASE_URL = '/management/api'

const request = createRequest()

export const postFileUploadApi = <T>(path: string, params: any, config: any = {}): Promise<ServiceResponse<T>> => {
  return request.post(config.baseURL ? '' : '/management/api/file', (function () {
    const formData = new FormData()
    for (const key in params) {
      formData.append(key, params[key])
    }
    // 该函数也需要打第三方，需兼容。
    if (path) {
      formData.append('path', path)
      formData.append('method', 'post')
    }
    return formData
  })(), {
    headers: {
      'content-type': 'multipart/form-data'
    },
    ...config
  });
}

// tips: 这边传输数据返回格式还是太随意了，需要修改
export const getApiData = (url: string, params: any, config: any = {}): Promise<any> => {
  return request.get(url, { params, ...config });
}

export const postApiData = <T>(url: string, data: ApiReqParams, config: any = {}): Promise<ServiceResponse<T>> => {
  return request.post(url, data, config);
}

export const getApi = <T>(path: string, params: any, config: any = {}) => {
  return postApiData<T>(config.baseURL ? "" : BASE_URL, {
    method: 'get', path: path,
    params,
  }, config)
}

export const postApi = <T>(path: string, params: any, config: any = {}) => {
  return postApiData<T>(config.baseURL ? "" : BASE_URL, {
    method: 'post', path: path,
    params,
  }, config)
}