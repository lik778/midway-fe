import { postApi, getApi } from '../api/base'
import { Servicerespone,updateStatus,contact,complaintList } from '../interfaces/customerService';
import { message } from 'antd'

export const getComplaintList = (params:complaintList) => {
  return postApi<Servicerespone>('/api/midway/backend/complaintCenter/initComplaint', params)
}
export const getUpdateStatus = (params: updateStatus) => {
    return postApi<[]>('/api/midway/backend/complaintCenter/updateStatus', params)
}
export const searchByContact = (params:contact) => {
    return postApi<[]>('/api/midway/backend/complaintCenter/searchByContact', params)
}
