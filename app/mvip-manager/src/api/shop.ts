import { postApiData, setShopHeader } from './base'
import {
  GetContentApiParams,
  CreateProductApiParams,
  DeleteApiParams,
  CreateContentCateApiParams,
  CreateArticleApiParams,
  ModifyNavItem,
  imgItemParam,
} from '@/interfaces/shop';

// 基础配置
// 获取导航列表
export const getNavListingApi = (shopId: number) => {
  return postApiData('navigation/listing', {}, setShopHeader(shopId))
}

// 更新导航列表
export const updateNavApi = (shopId: number, params: ModifyNavItem[]) => {
  return postApiData('navigation/update', params, setShopHeader(shopId))
}

// 创建banner
export const createBannerApi = (shopId: number, params:imgItemParam) => {
  return postApiData('banner/create', params, setShopHeader(shopId))
}

// 删除banner 
export const deleteBannerApi = (shopId: number, params: any) => {
  return postApiData(`banner/delete/${params.id}`, {}, setShopHeader(shopId))
}

// banner 列表 
export const getBannerList = (shopId: number, params: any) => {
  return postApiData(`banner/listing`, params, setShopHeader(shopId))
}

export const getProductListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData('product/list', params, setShopHeader(shopId))
}

export const createProductApi = (shopId: number, params: CreateProductApiParams) => {
  return postApiData('product/create', params, setShopHeader(shopId))
}

export const updateProductApi = (shopId: number, params: CreateProductApiParams) => {
  return postApiData('product/update', params, setShopHeader(shopId))
}

export const deleteProductApi = (shopId: number, params: DeleteApiParams) => {
  return postApiData('product/delete', params, setShopHeader(shopId))
}

// api: 获取店铺产品列表
export const getArticleListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData('article/list', params, setShopHeader(shopId))
}

export const createArticleApi = (shopId: number, params: CreateArticleApiParams) => {
  return postApiData('article/create', params, setShopHeader(shopId))
}

export const updateArticleApi = (shopId: number, params: CreateArticleApiParams) => {
  return postApiData('article/update', params, setShopHeader(shopId))
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
