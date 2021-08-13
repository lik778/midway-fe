import { postApi } from '../api/base'

export const getAuditImageList = params => {
  return postApi('/api/midway/internal/mediaImg/imgReapply', params, { baseURL: '/management/api/internal' })
}

export const auditImage = params => {
  return postApi('/api/midway/internal/mediaImg/humainCheck', params, { baseURL: '/management/api/internal' })
}
 