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
  TdkDetailMeta, ShopStatus, ShopInfo,
} from '@/interfaces/shop';
import { ServiceResponse } from '@/interfaces/api';

// 店铺初始信息
export const getCreateShopStatusApi = ():Promise<ServiceResponse<ShopStatus>>  => {
  return postApiData('midway/backend/shop/init', {})
}

// 创建店铺
export const createShopApi = (params: any):Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/shop/create', params)
}

// 更新店铺
export const updateShopApi = (params: ShopInfo):Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/shop/update', params)
}

// 获取店铺列表
export const getShopListApi = ():Promise<ServiceResponse<ShopInfo>>  => {
  // tips: // 这里的params写死，因为用户店铺不会超过10个
  return postApiData('midway/backend/shop/listing', { page: 1, size: 10 })
}


// 基础配置
// 获取导航列表
export const getNavListingApi = (shopId: number) => {
  return postApiData('midway/backend/navigation/listing', {}, setShopHeader(shopId))
}

// 更新导航列表
export const updateNavApi = (shopId: number, params: ModifyNavItem[]) => {
  return postApiData('midway/backend/navigation/update', params, setShopHeader(shopId))
}

// 创建banner
export const createBannerApi = (shopId: number, params:ImgItemParam) => {
  return postApiData('midway/backend/banner/create', params, setShopHeader(shopId))
}

// 删除banner
export const deleteBannerApi = (shopId: number, params: ImgDeleteParam) => {
  return postApiData(`midway/backend/banner/delete/${params.id}`, {}, setShopHeader(shopId))
}

// 获取店铺信息
export const getShopInfoApi = (shopId: number) => {
  return postApiData(`midway/backend/shop/info/${shopId}`, {}, setShopHeader(shopId))
}

// banner 列表
export const getBannerListApi = (shopId: number, params: ImgListParam) => {
  return postApiData(`midway/backend/banner/listing`, params, setShopHeader(shopId))
}

// 获取tdk List
export const getMetaDetailApi = (shopId: number, params: TdkDetailMeta) => {
  return postApiData(`midway/backend/meta/detail`, params, setShopHeader(shopId))
}

// 保存tdk信息
export const getMetaSaveApi = (shopId: number, params: TdkSaveMeta) => {
  return postApiData(`midway/backend/meta/save`, params, setShopHeader(shopId))
}

export const getProductListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData('midway/backend/product/list', params, setShopHeader(shopId))
}

export const createProductApi = (shopId: number, params: CreateProductApiParams) => {
  return postApiData('midway/backend/product/create', params, setShopHeader(shopId))
}

export const updateProductApi = (shopId: number, params: CreateProductApiParams) => {
  return postApiData('midway/backend/product/update', params, setShopHeader(shopId))
}

export const deleteProductApi = (shopId: number, params: HandleApiParams) => {
  return postApiData('midway/backend/product/delete', params, setShopHeader(shopId))
}

// api: 获取店铺产品列表
export const getArticleListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData('midway/backend/article/list', params, setShopHeader(shopId))
}

export const createArticleApi = (shopId: number, params: CreateArticleApiParams) => {
  return postApiData('midway/backend/article/create', params, setShopHeader(shopId))
}

export const updateArticleApi = (shopId: number, params: CreateArticleApiParams) => {
  return postApiData('midway/backend/article/update', params, setShopHeader(shopId))
}
// api: 删除文章
export const deleteArticleApi = (shopId: number, params: HandleApiParams) => {
  return postApiData('midway/backend/article/delete', params, setShopHeader(shopId))
}

// api: 新增分类
export const createContentCateApi = (shopId: number, params: CreateContentCateApiParams) => {
  return postApiData('midway/backend/contentCate/create', params, setShopHeader(shopId))
}

// api: 更新分类
export const updateContentCateApi = (shopId: number, params: CreateContentCateApiParams) => {
  return postApiData('midway/backend/contentCate/update', params, setShopHeader(shopId))
}

// api: 删除分类
export const deleteContentCateApi = (shopId: number, params: HandleApiParams) => {
  return postApiData('midway/backend/contentCate/delete', params, setShopHeader(shopId))
}

// api: quota信息
export const getShopQuotaApi = (params: HandleApiParams) => {
  return postApiData('midway/backend/shop/quotaInfo', params)
}

// api: 获取cateNum
export const getCateNumApi = (shopId: number, params: HandleApiParams) => {
  return postApiData('midway/backend/contentCate/getCateNum', params, setShopHeader(shopId))
}

// api: 是否店铺新用户
export const isNewUserApi = () => {
  return postApiData('midway/backend/shop/isNewUser', {})
}
