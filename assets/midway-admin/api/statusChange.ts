import { getApi } from './base'
import { StatusChange } from '../interfaces/statusChange'
export const statusChange = (params: StatusChange) => {
  return  getApi<any>('/api/midway/manager/shop/changeStatus', params)
}