import { postApiData, setShopHeader } from './base'
import {
  GetContentApiParams,
  CreateProductApiParams,
  HandleApiParams,
  CreateContentCateApiParams,
  CreateArticleApiParams,
  ModifyNavItem,
  ImgItemParam,
  ImgDeleteParam,
  ImgListParam,
  TdkSaveMeta,
  TdkDetailMeta, ShopStatus,
} from '@/interfaces/shop';
import { ServiceResponse } from '@/interfaces/api';

// 店铺
export const getCreateShopStatusApi = ():Promise<ServiceResponse<ShopStatus>>  => {
  return postApiData('shop/init', {})
}

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
export const createBannerApi = (shopId: number, params:ImgItemParam) => {
  return postApiData('banner/create', params, setShopHeader(shopId))
}

// 删除banner
export const deleteBannerApi = (shopId: number, params: ImgDeleteParam) => {
  return postApiData(`banner/delete/${params.id}`, {}, setShopHeader(shopId))
}

// 获取店铺信息
export const getShopInfoApi = (shopId: number) => {
  return postApiData(`shop/info/${shopId}`, {}, setShopHeader(shopId))
}

// banner 列表
export const getBannerListApi = (shopId: number, params: ImgListParam) => {
  return postApiData(`banner/listing`, params, setShopHeader(shopId))
}

// 获取tdk List
export const getMetaDetailApi = (shopId: number, params: TdkDetailMeta) => {
  return postApiData(`meta/detail`, params, setShopHeader(shopId))
}

// 保存tdk信息
export const getMetaSaveApi = (shopId: number, params: TdkSaveMeta) => {
  return postApiData(`meta/save`, params, setShopHeader(shopId))
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

export const deleteProductApi = (shopId: number, params: HandleApiParams) => {
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
export const deleteArticleApi = (shopId: number, params: HandleApiParams) => {
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
export const deleteContentCateApi = (shopId: number, params: HandleApiParams) => {
  return postApiData('contentCate/delete', params, setShopHeader(shopId))
}

// api: quota信息
export const getShopQuotaApi = (params: HandleApiParams) => {
  return postApiData('shop/quotaInfo', params)
}

// api: 获取cateNum
export const getCateNumApi = (shopId: number, params: HandleApiParams) => {
  return postApiData('contentCate/getCateNum', params, setShopHeader(shopId))
}

