// 获取审核列表页
import { downloadReport, postApi, postFileUploadApi, getTemplateFile } from '../api/base'
import { Template, TemplateType } from '../interfaces/template'
import { message } from 'antd'

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
  const { data } = await getTemplateFile(type)
  const blob = new Blob(['\ufeff' + data], { type: 'text/csv,charset=GB2312' })
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename + '.csv';
  a.click();
}

export const downloadFile = async (params: {
  ids: string
}) => {
  const response = await downloadReport('/api/midway/manager/material/download', params)
  const { data, headers } = response;
  try {
    // const filename = headers['content-disposition'].match(/filename="(.+)"/)[1];
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([data], { type: "application/octet-stream" }));
    a.href = url;
    a.download = '导出结果.csv';
    a.click();
  } catch {
    message.error('下载失败');
  }
}
