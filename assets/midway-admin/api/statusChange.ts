import { postApi,getApi } from '../api/base'

export const statusChange = (params: any) => {
  return  postApi<any>('/api/midway/internal/feedback/download',params,{ baseURL: '/management/api/internal' })
}