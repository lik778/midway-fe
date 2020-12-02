import { postApiData } from './base'

// api: 获取店铺产品列表
export const getProductListApi = (params: any) => {
  return postApiData('/product/list', params)
}

// api: 删除产品
interface deleteProductParams {
  id: number;
  shopId: number;
}

export const deleteProduct = (params: deleteProductParams) => {
  return postApiData('/product/delete', params)
}
