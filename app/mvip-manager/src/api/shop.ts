import { postApiData, setShopHeader } from './base'

// api: 获取店铺产品列表
interface getProductListApiParams {
  page: number;
  size: number;
  contentCateId: number;
}
export const getProductListApi = (shopId: number, params: getProductListApiParams) => {
  return postApiData('/product/list', params, setShopHeader(shopId))
}

// api: 删除产品
interface deleteProductApiParams {
  id: number;
}

export const deleteProductApi = (shopId: number, params: deleteProductApiParams) => {
  return postApiData('/product/delete', params, setShopHeader(shopId))
}
