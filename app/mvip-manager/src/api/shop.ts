import { postApiData, setShopHeader } from './base'
import { GetContentApiParams, CreateProductApiParams, DeleteApiParams, CreateContentCateApiParams } from '@/interfaces/shop';

export const getProductListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData('product/list', params, setShopHeader(shopId))
}

export const createProductApi = (shopId: number, params: CreateProductApiParams) => {
  return postApiData('product/create', params, setShopHeader(shopId))
}

export const deleteProductApi = (shopId: number, params: DeleteApiParams) => {
  return postApiData('product/delete', params, setShopHeader(shopId))
}

// api: 获取店铺产品列表
export const getArticleListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData('article/list', params, setShopHeader(shopId))
}

// api: 删除文章
export const deleteArticleApi = (shopId: number, params: DeleteApiParams) => {
  return postApiData('article/delete', params, setShopHeader(shopId))
}

// api: 新增分类
export const createContentCateApi = (shopId: number, params: CreateContentCateApiParams) => {
  return postApiData('contentCate/create', params, setShopHeader(shopId))
}

// api: 更新分类
export const updateContentCateApi = (shopId: number, params: CreateContentCateApiParams) => {
  return postApiData('contentCate/update', params, setShopHeader(shopId))
}

// api: 删除分类
export const deleteContentCateApi = (shopId: number, params: DeleteApiParams) => {
  return postApiData('contentCate/delete', params, setShopHeader(shopId))
}
