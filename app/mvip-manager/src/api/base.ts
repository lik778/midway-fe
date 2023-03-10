import axios, { AxiosError, AxiosResponse } from 'axios';
import { ServiceResponse } from '@/interfaces/api'
// 开始的设计没有考虑更多情况
// tips: 前端请求的需要的参数
export interface ApiReqParams {
  method: string;
  path: string;
  params?: any;
}

export const request = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000, // request timeout  设置请求超时时间
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  },
})

request.interceptors.response.use((res: AxiosResponse) => {
  return Promise.resolve(res?.data)
}, (err: AxiosError) => {
  if (err.response) {
    return Promise.resolve(err.response && err.response.data)
  } else {
    return Promise.resolve({
      success: false,
      message: '请求失败，请稍后再试！'
    })
  }
})

export const postApi = <T>(url: string, data: ApiReqParams, headers?: any): Promise<ServiceResponse<T>> => {
  const { method, path, params } = data;
  return request.post(url, { method, params, path }, { headers });
}

// tips: 这边传输数据返回格式还是太随意了，需要修改
export const getApi = (url: string, params: any): Promise<any> => {
  return request.get(url, { params });
}

export const getApiData = <T>(servicePath: string, path: string, params: any = {}, headers?: any) => {
  return postApi<T>(servicePath, {
    method: 'get', path: `/api/${path}`,
    params,
  }, headers)
}

export const postApiData = <T>(servicePath: string, path: string, params: any = {}, headers?: any) => {
  return postApi<T>(servicePath, {
    method: 'post', path: `/api/${path}`,
    params,
  }, headers)
}

export const putApiData = <T>(servicePath: string, path: string, params: any = {}, headers?: any) => {
  return postApi<T>(servicePath, {
    method: 'put', path: `/api/${path}`,
    params,
  }, headers)
}


export const deleteApiData = <T>(servicePath: string, path: string, params: any = {}, headers?: any) => {
  return postApi<T>(servicePath, {
    method: 'delete', path: `/api/${path}`,
    params,
  }, headers)
}

export const setShopHeader = (shopId: number) => {
  // 通过header来传递shopId
  const headers: any = {}
  if (shopId) {
    headers['shop-id'] = shopId
  }
  return headers;
}


export const upFile = axios.create({
  timeout: 30 * 1000, // request timeout  设置请求超时时间
  withCredentials: false,// 服务器端不限制跨域 则前端不能带cookie
  headers: {
    "Content-Type": "multipart/form-data;",
    "accept": '*/*'
  },
  method: "POST",
})
