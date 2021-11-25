import { postApi, getApi } from '../api/base'
import { PageParams } from '../interfaces/api';
import { Advicerespone } from '../interfaces/adviceRecord';

export const getAdviceList = (params: PageParams) => {
  return postApi<Advicerespone[]>('/api/midway/manager/feedback/listing', params)
}

export const getDownload = () => {
  return getApi('/api/midway/manager/feedback/download', {}, {
    baseURL: '/management/api/download-file', responseType: 'blob'
  });
}