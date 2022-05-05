import { postApi, getApi } from '../api/base'
import { Servicerespone,updateStatus,contact,complaintList } from '../interfaces/customerService';
import { message } from 'antd'

export const getComplaintList = (params:complaintList) => {
  return postApi<Servicerespone>('/api/midway/manager/MComplaintController/initComplaint', params)
}
export const getUpdateStatus = (params: updateStatus) => {
    return postApi<[]>('/api/midway/manager/MComplaintController/updateStatus', params)
}
export const searchByContact = (params:contact) => {
    return postApi<[]>('/api/midway/manager/MComplaintController/searchByContact', params)
}
