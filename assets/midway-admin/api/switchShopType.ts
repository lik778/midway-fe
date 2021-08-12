// 获取审核列表页
import { postApi } from '../api/base';
import { SearchShopListItem, GetShopListParams } from '../interfaces/switchShopType';

export const getShopListApi = (params: GetShopListParams) => {
  return postApi<SearchShopListItem[]>('/api/midway/manager/shop/search', params)
}

// 传店铺id shopId
export const setShopTypeApi = (params: { id: number }) => {
  return postApi<null>('/api/midway/manager/shop/switchTemplate', params)
}


