import { postApi } from '../api/base'

export const getAuditMaterialList = params => {
  return postApi('/api/midway/manager/material/materialReapply', params)
}

export const auditMaterial = params => {
  return postApi('/api/midway/manager/material/humainCheck', params)
}
