import { postApiData, setShopHeader } from './base'
import { ServiceResponse } from '@/interfaces/api';

export const getPVData = ():Promise<ServiceResponse<any>>  => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          date: String(20210101 + i).replace(/^(\d{4})(\d{2})/, '$1-$2-'),
          pv: ~~(Math.random() * 1000)
        }))
      }
    })
  })
}
