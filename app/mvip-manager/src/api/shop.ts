import { postApiData, setShopHeader } from './base'

// api: 获取店铺产品列表
interface getContentApiParams {
  page: number;
  size: number;
  contentCateId: number;
}

// api: 删除产品
interface deleteProductApiParams {
  id: number;
}

export const getProductListApi = (shopId: number, params: getContentApiParams) => {
  return postApiData('/product/list', params, setShopHeader(shopId))
}

export const deleteProductApi = (shopId: number, params: deleteProductApiParams) => {
  return postApiData('/product/delete', params, setShopHeader(shopId))
}

// api: 获取店铺产品列表
export const getArticleListApi = (shopId: number, params: getContentApiParams) => {
  return postApiData('/article/list', params, setShopHeader(shopId))
}

// api: 删除文章
export const deleteArticleApi = (shopId: number, params: deleteProductApiParams) => {
  return postApiData('/article/delete', params, setShopHeader(shopId))
}

// api: 获取店铺产品列表
export const deleteContentApi = (shopId: number, params: deleteProductApiParams) => {
  return postApiData('/contentCate/delete', params, setShopHeader(shopId))
}
