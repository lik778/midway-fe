import { postApiData, setShopHeader } from './base'
import { getContentApiParams, deleteProductApiParams, createContentCateApiParams } from '@/interfaces/shop';

export const getProductListApi = (shopId: number, params: getContentApiParams) => {
  return postApiData('product/list', params, setShopHeader(shopId))
}

export const deleteProductApi = (shopId: number, params: deleteProductApiParams) => {
  return postApiData('product/delete', params, setShopHeader(shopId))
}

// api: 获取店铺产品列表
export const getArticleListApi = (shopId: number, params: getContentApiParams) => {
  return postApiData('article/list', params, setShopHeader(shopId))
}

// api: 删除文章
export const deleteArticleApi = (shopId: number, params: deleteProductApiParams) => {
  return postApiData('article/delete', params, setShopHeader(shopId))
}

// api: 新增分类
export const createContentCateApi = (shopId: number, params: createContentCateApiParams) => {
  return postApiData('contentCate/create', params, setShopHeader(shopId))
}

// api: 更新分类
export const updateContentCateApi = (shopId: number, params: createContentCateApiParams) => {
  return postApiData('contentCate/update', params, setShopHeader(shopId))
}

// api: 删除分类
export const deleteContentCateApi = (shopId: number, params: deleteProductApiParams) => {
  return postApiData('contentCate/delete', params, setShopHeader(shopId))
}
