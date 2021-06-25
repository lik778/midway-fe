// 获取审核列表页
import { ListRes, ServiceResponse } from '../interfaces/api';
import { postApi } from '../api/base';
import { SearchShopListItem, GetShopListParams } from '../interfaces/switchShopType';

export const getShopListApi = (params: GetShopListParams): Promise<SearchShopListItem[]> => {
  return postApi('/api/midway/backend/shop/search', params)
}

// 传店铺id shopId
export const setShopTypeApi = (params: { id: number }): Promise<null> => {
  return postApi('/api/midway/backend/shop/switchTemplate', params)
}
