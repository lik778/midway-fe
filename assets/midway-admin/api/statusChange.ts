import { postApi } from './base'
import { StatusChange } from '../interfaces/statusChange'
export const statusChange = (params: StatusChange) => {
  return  postApi<any>('/api/midway/manager/shop/changeStatus', params)
}