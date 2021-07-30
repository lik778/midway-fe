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
  BannerListItem,
  TdkDetailMeta, ShopStatus, ShopInfo, CustomerSetListItem, CustomerSetChildListItem, CustomerListItem,
  AlbumItem, ImageItem, CardItem,
  CreateShopParams, RenewShopParams, ShopBasicInfo, UploadShopBasicInfoParams,
  GetImagesetImageRes, GetImagesetAlbumRes,
  GetImagesetAlbumParam, CreateImagesetAlbumParam, UpdateImagesetAlbumParam, DelImagesetAlbumParam,
  GetImagesetFailedImageParam, GetImagesetFailedImageRes,
  GetImagesetImageParam, CreateImagesetImageParam, DelImagesetImageParam, UpdateImagesetImageParam, MoveImagesetImageParam, AlbumNameListItem,
  ReAuditImagesetImageParam, ShopProductListItem, ShopArticleListItem, NewestDataVersion
} from '@/interfaces/shop';
import { ServicePath } from '@/enums/index'
import { ListRes } from '@/interfaces/base';

// 店铺初始信息
export const getCreateShopStatusApi = () => {
  return postApiData<ShopStatus>(ServicePath.SHOP, 'midway/backend/shop/init', {})
}

// 创建店铺
export const createShopApi = (params: CreateShopParams) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/shop/create', params)
}

// 店铺续费
export const renewShopApi = (params: RenewShopParams) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/shop/renew', params)
}

// 更新店铺
export const updateShopApi = (params: ShopInfo) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/shop/update', params)
}

// 更新店铺
export const updateShopVersionApi = (versionId: number, shopId: number) => {
  return postApiData<NewestDataVersion>(ServicePath.SHOP, 'midway/backend/dataVersion/submit', {
    id: versionId,
    shopId
  }, setShopHeader(shopId))
  // return getApi(`midway/backend/dataVersion/submit?id=${versionId}&shopId=${shopId}`, {})
}

// 获取店铺列表
export const getShopListApi = () => {
  // tips: // 这里的params写死，因为用户店铺不会超过1000个
  return postApiData<ShopInfo>(ServicePath.SHOP, 'midway/backend/shop/listing', { page: 1, size: 1000 })
}

// 基础配置
// 获取导航列表
export const getNavListingApi = (shopId: number) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/navigation/listing', {}, setShopHeader(shopId))
}

// 更新导航列表
export const updateNavApi = (shopId: number, params: ModifyNavItem[]) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/navigation/update', params, setShopHeader(shopId))
}

// 改变 banner 顺序
export const changeBannerOrderApi = (shopId: number, ids: number[]) => {
  return postApiData(ServicePath.SHOP, `midway/backend/banner/sort`, ids, setShopHeader(shopId))
}

// 创建banner
export const createBannerApi = (shopId: number, params: ImgItemParam) => {
  return postApiData<number>(ServicePath.SHOP, 'midway/backend/banner/create', params, setShopHeader(shopId))
}

// 删除banner
export const deleteBannerApi = (shopId: number, params: ImgDeleteParam) => {
  return postApiData(ServicePath.SHOP, `midway/backend/banner/delete/${params.id}`, {}, setShopHeader(shopId))
}

// 获取店铺信息
export const getShopInfoApi = (shopId: number) => {
  return postApiData(ServicePath.SHOP, `midway/backend/shop/info/${shopId}`, {}, setShopHeader(shopId))
}

// banner 列表
export const getBannerListApi = (shopId: number, params: ImgListParam) => {
  return postApiData<ListRes<BannerListItem[]>>(ServicePath.SHOP, `midway/backend/banner/listing`, params, setShopHeader(shopId))
}

// 获取tdk List
export const getMetaDetailApi = (shopId: number, params: TdkDetailMeta) => {
  return postApiData(ServicePath.SHOP, `midway/backend/meta/detail`, params, setShopHeader(shopId))
}

// 保存tdk信息
export const getMetaSaveApi = (shopId: number, params: TdkSaveMeta) => {
  return postApiData(ServicePath.SHOP, `midway/backend/meta/save`, params, setShopHeader(shopId))
}

export const getProductListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData<{
    productList: ListRes<ShopProductListItem[]>,
    cateList: any
  }>(ServicePath.SHOP, 'midway/backend/product/list', params, setShopHeader(shopId))
}

export const createProductApi = (shopId: number, params: CreateProductApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/product/create', params, setShopHeader(shopId))
}

export const updateProductApi = (shopId: number, params: CreateProductApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/product/update', params, setShopHeader(shopId))
}

export const deleteProductApi = (shopId: number, params: HandleApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/product/delete', params, setShopHeader(shopId))
}

// api: 获取店铺文章列表
export const getArticleListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData<{
    articleList: ListRes<ShopArticleListItem[]>,
    cateList: any
  }>(ServicePath.SHOP, 'midway/backend/article/list', params, setShopHeader(shopId))
}

export const createArticleApi = (shopId: number, params: CreateArticleApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/article/create', params, setShopHeader(shopId))
}

export const updateArticleApi = (shopId: number, params: CreateArticleApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/article/update', params, setShopHeader(shopId))
}
// api: 删除文章
export const deleteArticleApi = (shopId: number, params: HandleApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/article/delete', params, setShopHeader(shopId))
}

// api: 新增分类
export const createContentCateApi = (shopId: number, params: CreateContentCateApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/contentCate/create', params, setShopHeader(shopId))
}

// api: 更新分类
export const updateContentCateApi = (shopId: number, params: CreateContentCateApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/contentCate/update', params, setShopHeader(shopId))
}

// api: 删除分类
export const deleteContentCateApi = (shopId: number, params: HandleApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/contentCate/delete', params, setShopHeader(shopId))
}

// api: quota信息
export const getShopQuotaApi = (params: HandleApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/shop/quotaInfo', params)
}

// api: 获取cateNum
export const getCateNumApi = (shopId: number, params: HandleApiParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/contentCate/getCateNum', params, setShopHeader(shopId))
}

// api: 是否店铺新用户
export const isNewUserApi = () => {
  return postApiData(ServicePath.SHOP, 'midway/backend/shop/isNewUser', {})
}

/** 获取所有自定义模块列表 */
export const getCustomerModuleListApi = (shopId: number) => {
  return postApiData<{ mainModuleBos: CustomerListItem[] }>(ServicePath.SHOP, 'midway/backend/moduleAutoConfig/mainModuleList', {}, setShopHeader(shopId))
}

/** 获取某个自定义设置 */
export const getCustomerSetApi = (shopId: number, id: number) => {
  return postApiData<CustomerSetListItem>(ServicePath.SHOP, 'midway/backend/moduleAutoConfig/mainModuleContent', { id }, setShopHeader(shopId))
}

/** 保存某个自定义设置 */
export const setCustomerSetApi = (shopId: number, requestData: {
  mainModuleId?: number,
  mainModuleTitle: string,
  subModuleVos: CustomerSetChildListItem[],
  subModulesToDelete: number[]
}) => {
  return postApiData<never>(ServicePath.SHOP, 'midway/backend/moduleAutoConfig/modifyMainModule', requestData, setShopHeader(shopId))
}

/** 获取店铺基础信息设置 */
export const getShopBasicInfoApi = (shopId: number) => {
  return postApiData<ShopBasicInfo>(ServicePath.SHOP, 'midway/backend/shop/getShopEnterprise', {}, setShopHeader(shopId))
}

/** 设置店铺基础信息设置 */
export const setShopBasicInfoApi = (shopId: number, params: UploadShopBasicInfoParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/shop/setShopEnterprise', params, setShopHeader(shopId))
}

// 获取相册列表
export const getImagesetAlbum =
  (shopId: number, params: GetImagesetAlbumParam) => postApiData<GetImagesetAlbumRes>(ServicePath.SHOP, 'midway/backend/mediaCate/listing', params, setShopHeader(shopId))

// 创建店铺相册
export const createImagesetAlbum = (shopId: number, params: CreateImagesetAlbumParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaCate/create', params, setShopHeader(shopId))
}

// 修改店铺相册
export const updateImagesetAlbum = (shopId: number, params: UpdateImagesetAlbumParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaCate/update', params, setShopHeader(shopId))
}

// 删除店铺相册
export const delImagesetAlbum = (shopId: number, params: DelImagesetAlbumParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaCate/delete', params, setShopHeader(shopId))
}

// 获取相册图片列表
export const getImagesetImage =
  (shopId: number, params: GetImagesetImageParam) => postApiData<GetImagesetImageRes>(ServicePath.SHOP, 'midway/backend/mediaImg/listing', params, setShopHeader(shopId))

// 获取申诉列表（审核失败和审核中的图片）
export const getImagesetFailedImage = (shopId: number, params: GetImagesetFailedImageParam) => postApiData<GetImagesetFailedImageRes>(ServicePath.SHOP, '/midway/backend/mediaImg/failedImageListing', params, setShopHeader(shopId))

// 相册图片申诉
export const reAuditImagesetImage = (shopId: number, params: ReAuditImagesetImageParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaImg/reapply', params, setShopHeader(shopId))
}

// 新增相册图片
export const createImagesetImage = (shopId: number, params: CreateImagesetImageParam) => {
  return postApiData<ImageItem>(ServicePath.SHOP, 'midway/backend/mediaImg/create', params, setShopHeader(shopId))
}

// 删除相册图片
export const delImagesetImage = (shopId: number, params: DelImagesetImageParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaImg/delete', params, setShopHeader(shopId))
}

// 删除相册图片（专用来删除审核失败的图片）
export const delImagesetFailedImage = (shopId: number, params: Pick<DelImagesetImageParam, 'ids'>) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaImg/deleteFailed', params, setShopHeader(shopId))
}

// 更新相册图片
export const setImagesetAlbumCover = (shopId: number, params: UpdateImagesetImageParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaImg/setCover', params, setShopHeader(shopId))
}

// 移动相册图片到其它相册
export const moveImagesetImage = (shopId: number, params: MoveImagesetImageParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaImg/move', params, setShopHeader(shopId))
}

// 获取百姓网相册名称列表 URl
export const getBaixingAlbum = (shopId: number, params: GetImagesetAlbumParam) => {
  return postApiData<GetImagesetAlbumRes>(ServicePath.SHOP, 'midway/backend/mediaCate/baiXingNameListing', params, setShopHeader(shopId))
}

// 获取我的相册名称列表 URl
export const getAlbumNameList = (shopId: number) => {
  return postApiData<AlbumNameListItem[]>(ServicePath.SHOP, 'midway/backend/mediaCate/nameListing', {}, setShopHeader(shopId))
}

// 获取百姓网相册名称列表 URl
export const getBaixingAlbumNameList = (shopId: number) => {
  return postApiData<AlbumNameListItem[]>(ServicePath.SHOP, 'midway/backend/mediaCate/baiXingNameListing', {}, setShopHeader(shopId))
}

// 获取相册图片列表
export const getBaixingImagesetImage = (shopId: number, params: GetImagesetImageParam) => postApiData<GetImagesetImageRes>(ServicePath.SHOP, 'midway/backend/mediaImg/baiXingListing', params, setShopHeader(shopId))

