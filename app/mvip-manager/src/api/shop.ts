import { getApiData, postApiData, setShopHeader } from './base'
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
  TdkDetailMeta,
  ShopStatus,
  ShopInfo,
  CustomerSetListItem,
  CustomerSetChildListItem,
  CustomerListItem,
  MediaCateItem,
  MediaAssetsItem,
  CreateShopParams,
  RenewShopParams,
  ShopBasicInfo,
  UploadShopBasicInfoParams,
  GetMediaAssetsRes,
  GetMediaCatesRes,
  GetMediaCatesParam,
  getMediaCatesNameListParam,
  CreateMediaCatesParam,
  UpdateMediaCatesParam,
  DelMediaCatesParam,
  GetMediaFailedAssetsParam,
  GetMediaFailedAssetsRes,
  GetMediaAssetsParam,
  CreateMediaAssetsParam,
  DelMediaAssetsParam,
  UpdateMediaAssetsInCateParam,
  UpdateMediaAssetsParam,
  MoveMediaAssetsParam,
  MediaCatesNameListItem,
  ReAuditMediaAssetsParam,
  ProductListItem,
  ArticleListItem,
  NewestDataVersion,
  ModulePageType,
  ModuleComponentId,
  ModuleInitPage,
  ModuleProductSwiper,
  ModuleProductInfo,
  ModuleHomeABoutInfo,
  ModuleArticleInfo,
  ModuleABoutABoutInfo,
  ModuleRequestParam,
  ModuleProductSwiperParam,
  ModuleProductInfoParam,
  ModuleArticleInfoParam,
  ModuleHomeABoutInfoParam,
  ModuleABoutABoutInfoParam,
  ModuleProductSwiperNoParam,
  AdviceRecord
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
  return postApiData<any>(ServicePath.SHOP, `midway/backend/meta/detail`, params, setShopHeader(shopId))
}

// 保存tdk信息
export const getMetaSaveApi = (shopId: number, params: TdkSaveMeta) => {
  return postApiData(ServicePath.SHOP, `midway/backend/meta/save`, params, setShopHeader(shopId))
}

export const getProductListApi = (shopId: number, params: GetContentApiParams) => {
  return postApiData<{
    productList: ListRes<ProductListItem[]>,
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
    articleList: ListRes<ArticleListItem[]>,
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
export const getCustomerSetApi = (shopId: number, id: string) => {
  return postApiData<CustomerSetListItem>(ServicePath.SHOP, 'midway/backend/moduleAutoConfig/mainModuleContent', { id: Number(id) }, setShopHeader(shopId))
}

/** 保存某个自定义设置 */
export const setCustomerSetApi = (shopId: number, requestData: {
  mainModuleId?: number,
  mainModuleTitle: string,
  show: boolean,
  subModuleVos: CustomerSetChildListItem[],
  subModulesToDelete: number[]
}) => {
  return postApiData<CustomerSetListItem>(ServicePath.SHOP, 'midway/backend/moduleAutoConfig/modifyMainModule', requestData, setShopHeader(shopId))
}

/** 获取店铺基础信息设置 */
export const getShopBasicInfoApi = (shopId: number) => {
  return postApiData<ShopBasicInfo>(ServicePath.SHOP, 'midway/backend/shop/getShopEnterprise', {}, setShopHeader(shopId))
}

/** 设置店铺基础信息设置 */
export const setShopBasicInfoApi = (shopId: number, params: UploadShopBasicInfoParams) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/shop/setShopEnterprise', params, setShopHeader(shopId))
}

/**
 * 图片上传模态框相关接口
 */

// 获取百姓网相册名称列表 URl
export const getBaixingAlbum = (shopId: number, params: GetMediaCatesParam) => {
  return postApiData<GetMediaCatesRes>(ServicePath.SHOP, 'midway/backend/mediaCate/baiXingNameListing', params, setShopHeader(shopId))
}

// 获取相册图片列表
export const getBaixingMediaAssets = (params: GetMediaAssetsParam) => {
  return postApiData<GetMediaAssetsRes>(ServicePath.SHOP, 'midway/backend/material/baiXingListing', params)
}

// 获取百姓网相册名称列表 URl
export const getBaixingAlbumNameList = (shopId: number) => {
  return postApiData<MediaCatesNameListItem[]>(ServicePath.SHOP, 'midway/backend/mediaCate/baiXingNameListing', {}, setShopHeader(shopId))
}

/**
 * 素材管理页面相关接口
 */

// 获取素材列表
export const getMediaCatesList = (params: GetMediaCatesParam) => {
  return postApiData<GetMediaCatesRes>(ServicePath.SHOP, 'midway/backend/mediaCate/listing', params)
}

// 获取素材名称列表（比素材列表节约资源）
export const getMediaCatesNameList = (params: getMediaCatesNameListParam) => {
  return getApiData<MediaCatesNameListItem[]>(ServicePath.SHOP, 'midway/backend/mediaCate/nameListing', params)
}

// 创建素材分类
export const createMediaCategory = (params: CreateMediaCatesParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaCate/create', params)
}

// 更新素材分类
export const updateMediaCategory = (params: UpdateMediaCatesParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/mediaCate/update', params)
}

// 删除素材分类
export const delMediaCategory = (params: DelMediaCatesParam) => {
  return getApiData(ServicePath.SHOP, 'midway/backend/mediaCate/delete', params)
}

// 获取分类内素材列表
export const getMediaAssets = (params: GetMediaAssetsParam) => {
  return postApiData<GetMediaAssetsRes>(ServicePath.SHOP, 'midway/backend/material/listing', params)
}

// 获取分类内可选用的素材列表
// TODO
export const getSelectableMediaAssets = (params: GetMediaAssetsParam) => {
  return postApiData<GetMediaAssetsRes>(
    ServicePath.SHOP,
    'midway/backend/material/listing',
    Object.assign(params, { onlyApprove: true })
  )
}

// 素材申诉
export const reAuditMediaAssets = (params: ReAuditMediaAssetsParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/material/reapply', params)
}

// 添加素材到分类
export const createMediaAssets = (params: CreateMediaAssetsParam) => {
  return postApiData<MediaAssetsItem>(ServicePath.SHOP, 'midway/backend/material/create', params)
}

// 删除素材
export const delMediaAssets = (params: DelMediaAssetsParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/material/delete', params)
}

// 设定素材为分类封面
export const setMediaCatesCover = (params: UpdateMediaAssetsInCateParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/material/setCover', params)
}

// 更改素材属性（如改名）
export const updateMediaAssets = (params: UpdateMediaAssetsParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/material/modifyTitle', params)
}

// 移动素材到其它分类
export const moveMediaAssets = (params: MoveMediaAssetsParam) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/material/move', params)
}

/**
 * 素材管理审核页面相关接口
 */

// 获取申诉列表（审核失败和审核中的素材）
export const getMediaFailedAssets = (params: GetMediaFailedAssetsParam) => {
  return postApiData<GetMediaFailedAssetsRes>(ServicePath.SHOP, '/midway/backend/material/failedImageListing', params)
}

// 删除申诉素材（专用来删除审核失败的素材）
export const delMediaFailedAssets = (params: Pick<DelMediaAssetsParam, 'ids' | 'source'>) => {
  return postApiData(ServicePath.SHOP, 'midway/backend/material/deleteFailed', params)
}

/** 模块管理 开始 */
// 获取模块信息
export const getModuleInitInfoApi = (shopId: number) => getApiData<ModuleInitPage[]>(ServicePath.SHOP, 'midway/backend/module/init', {}, setShopHeader(shopId))

// 获取模块信息 T = ModuleProductSwiper | ModuleProductInfo | ModuleArticleInfo | ModuleHomeABoutInfo | ModuleABoutABoutInfo
export const getModuleInfoApi = <T>(shopId: number, params: ModuleRequestParam) => getApiData<T>(ServicePath.SHOP, 'midway/backend/module/info', params, setShopHeader(shopId))

// 修改模块数据
// 修改banner 产品模块配置
export const setModuleBannerInfoApi = (shopId: number, params: ModuleProductSwiperParam | ModuleProductSwiperNoParam) => postApiData<ModuleProductSwiper>(ServicePath.SHOP, 'midway/backend/module/update/banner', params, setShopHeader(shopId))

// 修改推荐产品
export const setModuleProductInfoApi = (shopId: number, params: ModuleProductInfoParam) => postApiData<ModuleProductInfo>(ServicePath.SHOP, 'midway/backend/module/update/productRecomend', params, setShopHeader(shopId))

// 修改首页文章
export const setModuleHomeArticleListApi = (shopId: number, params: ModuleArticleInfoParam) => postApiData<ModuleArticleInfo>(ServicePath.SHOP, 'midway/backend/module/update/articleList', params, setShopHeader(shopId))

// 修改推荐文章
export const setModuleArticleInfoApi = (shopId: number, params: ModuleArticleInfoParam) => postApiData<ModuleArticleInfo>(ServicePath.SHOP, 'midway/backend/module/update/articleRecomend', params, setShopHeader(shopId))

// 修改关于我们模块 首页
export const setModuleHomeABoutInfoApi = (shopId: number, params: ModuleHomeABoutInfoParam) => postApiData<ModuleHomeABoutInfo>(ServicePath.SHOP, 'midway/backend/module/update/homeAbout', params, setShopHeader(shopId))

// 修改关于我们模块 关于我们页面
export const setModuleABoutInfoApi = (shopId: number, params: ModuleABoutABoutInfoParam) => postApiData<ModuleABoutABoutInfo>(ServicePath.SHOP, 'midway/backend/module/update/about', params, setShopHeader(shopId))

// 店铺反馈入口
export const setAdviceRecordApi = (shopId: number, params: AdviceRecord) => {
  return postApiData<any>(ServicePath.SHOP,'midway/backend/feedback/create',params, setShopHeader(shopId))
}

/** 模块管理 结束 */
