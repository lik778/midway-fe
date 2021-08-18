import { ContentCateType, DomainStatus, ShopIndustryType } from '@/enums';
import { AppSourceEnum, ShopVersionStatusEnum } from '@/enums/shop';
import { ListRes } from '@/interfaces/base';
import { ShopMetas } from '@/interfaces/user'

export interface RouteParams {
  id: string;
}

export interface GetContentApiParams {
  page: number;
  size: number;
  onlyApprove?: boolean;
  contentCateId: number;
}

export interface CreateProductApiParams extends CreateArticleApiParams {
  headImg?: string;
}

export interface ProductListItem {
  cateName: string
  content: string
  contentCateId: number
  contentImg: string[]
  headImg: string
  id: number
  memo: string
  name: string
  price: string
  status: number
  tags: string[]
  urlSuffix: string
}

export interface CreateArticleApiParams {
  id?: number;
  contentCateId: number;
  content: string;
  contentImg?: string;
  name: string;
  price: number | string;
  shopId?: number;
  tags: string[];
}

export interface ArticleListItem {
  cateName: string
  content: string
  contentCateId: number
  contentImg: string
  id: number
  memo: string
  name: string
  source: number
  status: number
  tags: string[]
  urlSuffix: string
}

export interface HandleApiParams {
  id: number | null | undefined;
}

export interface CateItem {
  id?: number;
  name: string;
  seoD?: string;
  seoK?: string;
  seoT?: string;
  num: number;
}


export interface NavItem {
  content: string;
  desc: string;
  display: number | undefined;
  id: number;
  isDisabled?: boolean
  key: string;
  name: string;
  position: string;
  maxLength?: number;
  minLength?: number;
  isError?: boolean;
}

export interface ModifyNavItem {
  name: string;
  display: number | undefined;
  id: number;
}


export interface ImgItemParam {
  type: number;
  url: string;
  position: ModulePageType;
  weight: number;
}

export interface ImgDeleteParam {
  id: number;
}

export interface ImgListParam {
  page: number;
  size: number;
  status: number;
  type: number;
  position: ModulePageType;
}

export interface CreateContentCateApiParams {
  id?: number;
  name: string;
  seoD: string;
  seoK: string;
  seoT: string;
  type: ContentCateType;
}


export interface TdkSaveMeta {
  description: string;
  keywords: string[];
  position: string;
  title: string;
}

export interface TdkDetailMeta {
  position: string;
}

export interface ShopStatus {
  isUserPerfect: boolean;
  isTicketAvailable: boolean;
  userValidTickets: Ticket[];
  hasMultiShopRights: boolean
}

export interface QuotaInfo {
  freeNum: number;
  postRemain: number;
  buyUrl: string;
}


export interface CreateShopParams {
  id?: number,
  name: string,
  /** 行业属性 */
  shopType: ShopIndustryType,
  /** 域名类型 */
  domainType: DomainStatus,
  /** 店铺域名 */
  domain: string,
  ticketId?: number;
}


export interface RenewShopParams {
  ticketId: number;
  shopId: number;
}

export interface NewestDataVersion {
  id: number,
  status: ShopVersionStatusEnum,
  memo: string
}

export interface ShopInfo {
  about: string;
  copyRight: string;
  createdTime: number;
  domain: string;
  domainType: DomainStatus;
  shopType: ShopIndustryType,
  expiredTime: number;
  id: number;
  modifiedTime: number;
  name: string;
  portId: number;
  serviceCode: string;
  shopDomain: string;
  status: number;
  templateId: string;
  thumb: string;
  type: string;
  usrId: number;
  newestDataVersion: NewestDataVersion | null
}

export interface CustomerListItem {
  mainModuleId: number,
  title: string
}

export interface CustomerSetChildListItem {
  id?: number,
  title: string,
  content: string,
  urlImg: string,
  /** 自用字段 因为是数字 一定要保证唯一 */
  key: string
}

// 自定义设置
export interface CustomerSetListItem {
  mainModuleId?: number,
  mainModuleTitle: string,
  show: boolean,
  subModuleBos: CustomerSetChildListItem[]
}

export interface Quota {
  id: number;
  postQuota: number; // 发文quota
  productQuota: number; // 产品quota
  maxAiArticles: number; // 最大Ai发文量
  des: string;
}

export interface Ticket {
  id: number;
  source: AppSourceEnum;
  createDays: number;
  renewDays: number;
  quota: Quota;
}

// 店铺自己的基础信息模块 设置参数
interface ShopBasicInfoParams {
  companyName: string,
  companyAlias: string,// 店铺名称 默认值取得店铺名称
  companyAddress: string,
  companyDescription: string,
  promoteImg: string,
  contactName: string,
  contactMobile: string,
  contactMobile2: string,
  wechat: string,
}

export interface InitShopBasicInfoParams extends ShopBasicInfoParams {
  firstCategory: { [key: string]: string };
  metas: ShopMetas
  area: {
    [key: string]: string
  }
}

export interface UploadShopBasicInfoParams extends ShopBasicInfoParams {
  area: {
    [key: string]: string
  },
  metas: ShopMetas
}

// 请求填充参数
export interface ShopBasicInfo {
  company?: {
    name: string,
    alias: string,
    address: string,
    about: string,
    logo: string
  },
  person?: { name: string, uid: number },
  copyRight?: string,
  city?: { id: string, name: string },
  area?: {
    [key: string]: string
  }
  contact?: {
    contactName: { type: number, name: string, content: string },
    weChat: { type: number, name: string, content: string },
    phone: { type: number, name: string, content: string },
    phone2: { type: number, name: string, content: string },
    qq: [{ type: number, name: string, content: string }],
    kf53: any,
    kf53StyleUrl: any,
    union400: string[]
  },
}

export interface BannerListItem {
  displayImgUrl: string
  hrefUrl: string
  id: number
  imgUrl: string
  position: ModulePageType
  status: number
  weight: number
}

export interface GetImagesetAlbumParam {
  page: number;
  size: number;
}

export interface CreateImagesetAlbumParam {
  name: string;
}

export interface UpdateImagesetAlbumParam {
  id: number;
  name?: string;
  cover?: number;
}

export interface GetImagesetImageParam {
  mediaCateId?: number;// 获取图库内所有图片则不传，某个图册则传
  page: number;
  size: number;
}

export interface CreateImagesetImageParam {
  imgUrl: string;
  mediaCateId?: number; // 不传则上传到默认图库
}

export interface ReAuditImagesetImageParam {
  id: number
}

export type DelImagesetAlbumParam = number[]

export interface DelImagesetImageParam {
  ids: number[];
  mediaCateId: number;
}

export interface UpdateImagesetImageParam {
  id: number;
  mediaCateId: number;
}

export interface MoveImagesetImageParam {
  id: number;
  mediaCateId: number;
}

export interface GetImagesetAlbumRes {
  mediaCateBos: {
    totalRecord: number;
    result: AlbumItem[]
  }
}

export interface GetImagesetImageRes {
  mediaImgBos: ListRes<ImageItem[]>
}

export interface GetImagesetFailedImageParam {
  page: number;
  size: number;
}

export interface GetImagesetFailedImageRes {
  mediaImgBos: ListRes<ImageItem[]>
}

export interface AlbumNameListItem {
  id: number,
  name: string,
  type: AlbumType
}

export interface AlbumImageListItem {
  id: number,
  url: string
  status: 0 | 1 | 2// 0 未过审 ，1 已过审 ，2 待审核
}

// 默认相册/普通相册：默认相册不能编辑、删除
export type AlbumType = 'DEFAULT' | 'NORMAL'

// 相册
export type AlbumItem = {
  id: number,
  name: string,
  coverUrl: string,
  totalImg: number,
  type: AlbumType
}


export type CheckStatusType = 'DEFAULT' | 'APPROVE' | 'REJECT_BYMACHINE' | 'REAPPLY' | 'REJECT_BYHUMAN'
export type ImageType = 'NOT_COVER' | 'COVER'
/**
 * @description 相册图片类型
 * @param checkStatus :DEFAULT(0, "初始化"),APPROVE(1, "审核通过"),REJECT_BYMACHINE(2, "机审驳回"),REAPPLY(3, "申诉中"),REJECT_BYHUMAN(4, "人审驳回");
 */
export type ImageItem = {
  id: number,
  name?: string,
  imgUrl: string,
  type: ImageType,
  checkStatus: CheckStatusType,// 状态
  reason: string,// 驳回理由
}

export type CardItem = AlbumItem | ImageItem

// 相册管理目录层级类型
export type TabScopeItem = {
  item: CardItem | null
  type: 'album' | 'image' | 'audit'
}
export type TabScope = TabScopeItem[]


/* 店铺图集相关定义 End */


export interface ShopProductListItem {
  cateName: string
  content: string
  contentCateId: number
  contentImg: string[]
  id: number
  memo: string
  name: string
  price: string
  status: number
  tags: string[]
  urlSuffix: string
}

export interface ShopArticleListItem {
  cateName: string
  content: string
  contentCateId: number
  contentImg: string
  id: number
  memo: string
  name: string
  source: number
  status: number
  tags: string[]
  urlSuffix: string
}

/** 店铺模块管理相关 开始 */
export type ModulePageType = 'homePage' | 'productListPage' | 'articleListPage' | 'articleInfoPage' | 'aboutPage'

export type ModuleComponentId = 'banner' | 'productRecommend' | 'autoConfig' | 'about' | 'articleRecommend'

export interface ModuleInitPage {
  position: ModulePageType,
  name: string,
  infoList: ModuleInitComponent[]
}

export interface ModuleInitComponent {
  pageModule: string,
  name: string,
  max: number
}

export interface ModuleSelectProductListItem {
  id: number,
  name: string,
  price: string,
  headImg: string,
  urlSuffix: string
  createdTime: number,
  [key: string]: any
}

export interface ModuleSelectArticleListItem {
  id: number,
  name: string,
  urlSuffix: string
  createdTime: number,
  modifiedTime: number
  [key: string]: any
}

export interface ModuleRequestParam {
  position: ModulePageType,
  pageModule: ModuleComponentId,
}

export interface ModuleProductSwiper {
  backGroundImg: string,
  productList: ModuleSelectProductListItem[],
  /** 判断是选择了店铺还是 */
  bannerProduct: boolean
}

export interface ModuleProductSwiperParam extends ModuleRequestParam, ModuleProductSwiper {
  productIdList: number[]
}

export interface ModuleProductSwiperNoParam extends ModuleRequestParam {
  bannerProduct: boolean
}


export interface ModuleProductInfo {
  name: string,
  productList: ModuleSelectProductListItem[]
}

export interface ModuleProductInfoParam extends ModuleRequestParam {
  name: string,
  productIdList: number[]
}

export interface ModuleArticleInfo {
  name: string,
  articleList: ModuleSelectArticleListItem[]
}

export interface ModuleArticleInfoParam extends ModuleRequestParam {
  name: string,
  articleIdList: number[]
}


export interface ModuleHomeABoutInfo {
  name: string,
  tags: string[],
  media: string
}

export interface ModuleHomeABoutInfoParam extends ModuleRequestParam, ModuleHomeABoutInfo { }

export interface ModuleABoutABoutInfo {
  backImg: string,
}

export interface ModuleABoutABoutInfoParam extends ModuleRequestParam, ModuleABoutABoutInfo { }

/** 店铺模块管理相关 结束 */
