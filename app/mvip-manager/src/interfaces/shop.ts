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
  contentCateId: number;
}

export interface CreateProductApiParams extends CreateArticleApiParams {
  headImg?: string;
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
  position: number;
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
  position: number;
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
  /** 0 :黑色   1 ：白色 */
  fontColor: 0 | 1,
  /** 自用字段 因为是数字 一定要保证唯一 */
  key: string
}

// 自定义设置
export interface CustomerSetListItem {
  mainModuleId?: number,
  mainModuleTitle: string,
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
  area:  {
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
  position: number
  status: number
  weight: number
}

export interface GetMediaAlbumParam {
  page: number;
  size: number;
}

export interface CreateMediaAlbumParam {
  name: string;
}

export interface UpdateMediaAlbumParam {
  id: number;
  name?: string;
  cover?: number;
}

export interface GetMediaImageParam {
  mediaCateId?: number;// 获取图库内所有图片则不传，某个图册则传
  page: number;
  size: number;
}

export interface CreateMediaImageParam {
  imgUrl: string;
  mediaCateId?: number; // 不传则上传到默认图库
}

export interface ReAuditMediaImageParam {
  id: number
}

export type DelMediaAlbumParam = number[]

export interface DelMediaImageParam {
  ids: number[];
  mediaCateId: number;
}

export interface UpdateMediaImageParam {
  id: number;
  mediaCateId: number;
}

export interface MoveMediaImageParam {
  id: number;
  mediaCateId: number;
}

export interface GetMediaAlbumRes {
  mediaCateBos: {
    totalRecord: number;
    result: AlbumItem[]
  }
}

export interface GetMediaImageRes {
  mediaImgBos: ListRes<ImageItem[]>
}

export interface GetMediaFailedImageParam {
  page: number;
  size: number;
}

export interface GetMediaFailedImageRes {
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

// 相册类型（默认相册不能编辑、删除）
export type AlbumType = 'DEFAULT' | 'NORMAL'

// 相册
export type AlbumItem = {
  id: number,
  name: string,
  coverUrl: string,
  totalImg: number,
  type: AlbumType
}

/**
 * DEFAULT(0, "初始化")
 * APPROVE(1, "审核通过")
 * REJECT_BYMACHINE(2, "机审驳回")
 * REAPPLY(3, "申诉中")
 * REJECT_BYHUMAN(4, "人审驳回")
 */
export type CheckStatusType = 'DEFAULT' | 'APPROVE' | 'REJECT_BYMACHINE' | 'REAPPLY' | 'REJECT_BYHUMAN'
export type ImageType = 'NOT_COVER' | 'COVER'

// 相册图片类型
export type ImageItem = {
  id: number,
  name?: string,
  imgUrl: string,
  type: ImageType,
  checkStatus: CheckStatusType,
  reason: string,
}

export type VideoType = 'NOT_COVER' | 'COVER'

// 相册图片类型
export type VideoItem = {
  id: number,
  name?: string,
  imgUrl: string,
  type: VideoType,
  checkStatus: CheckStatusType,
  reason: string,
}

export type CardItem = AlbumItem | ImageItem | VideoItem

// 相册管理目录层级类型
type TabScopeItemBase = {
  item: CardItem | null
}
export type TabScopeItem = (
  TabScopeItemBase & {
    type: 'album',
    label: '相册' | '视频分组',
    countLabel: '个'
  }
) | (
  TabScopeItemBase & {
    type: 'image',
    label: '图片',
    countLabel: '张'
  }
) | (
  TabScopeItemBase & {
    type: 'audit',
    label: '资源',
    countLabel: '项'
  }
)
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
