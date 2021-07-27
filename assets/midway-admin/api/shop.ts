import { createRequest } from '../api/base'

const request = createRequest('/management/api/internal')

export const postApi = (path: string, params: any): Promise<any> => {
  return request.post('', { method: 'post', path: path, params: JSON.stringify(params) });
}

export const getAuditImageList = params => {
  return postApi('/api/midway/internal/mediaImg/imgReapply', params)
}

export const auditImage = params => {
  return postApi('/api/midway/internal/mediaImg/humainCheck', params)
}
