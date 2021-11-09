// 获取审核列表页
import { postApi, getApi, postFileUploadApi, postApiData } from '../api/base'
import { Template, TemplateType } from '../interfaces/template'
import { message } from 'antd'

export const getTemplateFile = (params: any) => {
  return getApi("", params, { baseURL: '/management/api/download-template', responseType: 'text' })
}

export const downloadReport = (path: string, params: any) => {
  return getApi('/api/midway/manager/material/download', params, {
    baseURL: '/management/api/download-file', responseType: 'blob'
  });
}

export const uploadTemplate = (params: {
  type: string
  file: File
}) => {
  return postFileUploadApi('/api/midway/manager/material/upload', params)
}

export const getTemplateHistory = (params) => {
  return postApi<{
    result: Template[]
    pageSize: number
    totalRecord: number
  }>('/api/midway/manager/material/listing', params)
}

export const downloadTemplate = async (type, filename) => {
  const res = await getTemplateFile(type)
  const blob = new Blob(['\ufeff' + res], { type: 'text/csv,charset=GB2312' })
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename + '.csv';
  a.click();
}

export const downloadFile = async (params: {
  ids: string
}) => {
  const data = await downloadReport('/api/midway/manager/material/download', params)
  try {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([data as any], { type: "application/octet-stream" }));
    a.href = url;
    a.download = '导出结果.csv';
    a.click();
  } catch {
    message.error('下载失败');
  }
}
