import { postApi } from '../api/base'

export const getAuditMaterialList = params => {
  return postApi('/api/midway/internal/material/materialReapply', params, { baseURL: '/management/api/internal' })
}

export const auditMaterial = params => {
  return postApi('/api/midway/internal/material/humainCheck', params, { baseURL: '/management/api/internal' })
}
