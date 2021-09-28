import { postApi,getApi } from '../api/base'
import { PageParams } from '../interfaces/api';
import {Advicerespone} from '../interfaces/adviceRecord';

export const getAdviceList = (params: PageParams) => {
  return postApi<Advicerespone[]>('/api/midway/internal/feedback/listing', params,{ baseURL: '/management/api/internal' })
}
export const getDownload = () => {
  return  getApi<any>('/api/midway/internal/feedback/download',{},{ baseURL: '/management/api/internal' })
}