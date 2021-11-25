import { postApi, getApi } from '../api/base'
import { PageParams } from '../interfaces/api';
import { Advicerespone } from '../interfaces/adviceRecord';
import { message } from 'antd'

export const getAdviceList = (params: PageParams) => {
  return postApi<Advicerespone[]>('/api/midway/manager/feedback/listing', params)
}

export const downloadFeedbacks = () => {
  return getApi('/api/midway/manager/feedback/download', {}, {
    baseURL: '/management/api/download-file', responseType: 'blob'
  });
}

export const downloadFC = async () => {
  const data = await downloadFeedbacks()
  try {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([data as any], { type: "application/octet-stream" }));
    a.href = url;
    a.download = '意见收集.csv';
    a.click();
  } catch {
    message.error('下载失败');
  }
}
