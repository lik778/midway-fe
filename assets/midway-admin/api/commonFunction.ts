import { getApi } from './base';
import { Getshopmodifystore } from '../interfaces/commonFunction';

// 传店铺id shopId 和店铺的名称
export const setStoreNameApi = (params: Getshopmodifystore) => {
  return getApi<any>('/api/midway/manager/shop/hotFixShop', params)
}
// 添加店铺白名单 传入店铺id
export const setStoreWhitelistApi = (params: { id: number }) => {
  return getApi<any>('/api/midway/manager/user/setUserMultiShopRight', params)
}
// 清楚53缓存
export const setStoreCleanCatchApi = (params: { id: number }) => {
  return getApi<any>('/api/midway/manager/user/freshKf53Cache', params)
}
// 添加tdk白名单 传入店铺id
export const setTdkOptimizationAuthApi = (params: { id: number }) => {
  return getApi<any>('/api/midway/manager/user/setTkdOptimizeRight', params)
}