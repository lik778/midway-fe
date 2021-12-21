import { ContentCateType, DomainStatus, ShopIndustryType } from '@/enums';
import { AppSourceEnum, ShopVersionStatusEnum } from '@/enums/shop';
import { ListRes } from '@/interfaces/base';
import { ShopMetas } from '@/interfaces/user';
import { AuditStatus } from '@/enums';
import { MediaItem } from '@/components/img-upload/data';

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

export interface ProductListItemInfoKey {
  key: string;
  value: string;
}

export interface ProductListItem {
  cateName: string;
  content: string;
  contentCateId: number;
  contentImg: string[];
  headImg: string;
  id: number;
  memo: string;
  name: string;
  price: string;
  status: AuditStatus;
  tags: string[];
  urlSuffix: string;
  createdTime: number;
  videoUrl: string | null;
  params: ProductListItemInfoKey[];
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
  cateName: string;
  content: string;
  contentCateId: number;
  contentImg: string;
  id: number;
  memo: string;
  name: string;
  source: number;
  status: AuditStatus;
  tags: string[];
  urlSuffix: string;
  createdTime: number;
}

export interface HandleApiParams {
  id: number | null | undefined;
  isNavigation?: boolean // 删除分组需要  获取分组下的文章产品不需要
}

export interface CateItem {
  id?: number;
  name: string;
  seoD?: string;
  seoK?: string;
  seoT?: string;
  weight: number;
  num: number;
  isNavigation?: boolean
}

export type NavPosition = "homePage" | "productListPage" | "productCatePage" | "articleListPage" | "articleCatePage" | "aboutPage" | "contactPage"

export interface NavItem {
  id: number
  position: NavPosition,
  name: string
  display: number
  desc: string
  realName: string | null
}

export interface NavInfo {
  slogan: string,
  qrImg: string
}

export interface ImgItemParam {
  type: number;
  hrefUrl: string;
  imgUrl: string;
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
  weight: number;
  type: ContentCateType;
}

export interface CreateContentCateParams {
  id?: number;
  name: string;
  seoD: string;
  seoK: string[];
  seoT: string;
  weight: number;
  type: ContentCateType;
}

export interface TdkNav {
  desc: string
  display: number
  id: string
  name: string
  position: string
}

export interface TdkDetail {
  description: string | null
  keywords: string[]
  title: string | null
}

export interface TdkSaveMeta {
  description: string;
  keywords: string[];
  position: string;
  title: string;
}

export interface TdkSaveAreaSuffix {
  areas: string[],
  suffixs: string[]
}
export interface TdkDetailMeta {
  position: string;
}

export interface ShopStatus {
  isUserPerfect: boolean;
  isTicketAvailable: boolean;
  userValidTickets: Ticket[];
  hasMultiShopRights: boolean;
  hasTkdOptimizeRights: boolean;
}

export interface QuotaInfo {
  freeNum: number;
  postRemain: number;
  buyUrl: string;
}

export interface CreateShopParams {
  id?: number;
  name: string;
  /** 行业属性 */
  shopType: ShopIndustryType;
  /** 域名类型 */
  domainType: DomainStatus;
  /** 店铺域名 */
  domain: string;
  ticketId?: number;
}

export interface RenewShopParams {
  ticketId: number;
  shopId: number;
}

export interface NewestDataVersion {
  id: number;
  status: ShopVersionStatusEnum;
  memo: string;
}

export interface ShopInfo {
  about: string;
  copyRight: string;
  createdTime: number;
  domain: string;
  domainType: DomainStatus;
  shopType: ShopIndustryType;
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
  newestDataVersion: NewestDataVersion | null;
  tkdCommonParams: {
    areas: string[] //用于seo
    suffixs: string[] //用于seo
  },
  canOptimizeFlag: boolean// 用于seo一键优化
  navInfo: NavInfo | null
}

export interface CustomerListItem {
  mainModuleId: number;
  title: string;
}

export interface CustomerSetChildListItem {
  id?: number;
  title: string;
  content: string;
  urlImg: string;
  /** 自用字段 因为是数字 一定要保证唯一 */
  key: string;
}

export interface InitCustomerSetChildListItem {
  id?: number;
  title: string;
  content: string;
  urlImg: MediaItem | '';
  /** 自用字段 因为是数字 一定要保证唯一 */
  key: string;
}

// 自定义设置
export interface CustomerSetListItem {
  mainModuleId?: number;
  mainModuleTitle: string;
  show: boolean;
  subModuleBos: CustomerSetChildListItem[];
}

export interface SaveCustomerSetListItem {
  mainModuleId?: number;
  mainModuleTitle: string;
  show: boolean;
  subModuleVos: CustomerSetChildListItem[];
}

export interface CustomerSetBigImageDetail {
  id: 3
  data: {
    pcImgList: string[],
    wapImgList: string[]
  } | null
  show: boolean
  type: "THIRD"
  dataId: number | null,
  mainModuleTitle: string
}

// 自定义设置大图 
export interface CustomerSetBigImage {
  dataId: number | null,
  mainModuleId: number,
  show: boolean;
  type: 'THIRD'
  pcImgList: string[];
  wapImgList: string[]
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
export interface ShopItemBasicInfo {
  companyName: string;
  companyAlias: string; // 店铺名称 默认值取得店铺名称
  companyAddress: string;
  companyDescription: string;
  contactName: string;
  contactMobile: string;
  contactMobile2: string;
  wechat: string;
}

export interface ShopItemBasicInfoParams extends ShopItemBasicInfo {
  promoteImg: string;
  firstCategory: { [key: string]: string };
  metas: ShopMetas;
  area: {
    [key: string]: string;
  };
}

export interface InitShopItemBasicInfoParams extends ShopItemBasicInfo {
  promoteImg: MediaItem | '';
  firstCategory: { [key: string]: string };
  metas: ShopMetas;
  area: {
    [key: string]: string;
  };
}

export interface UploadShopBasicInfoParams extends ShopItemBasicInfo {
  promoteImg: string;
  area: {
    [key: string]: string
  },
  metas: ShopMetas,
  firstCategory: string, // 后来添加的一级类目拼音
  secondCategory: string, // 后来添加的二级类目拼音
}

// 请求填充参数
export interface ShopBasicInfo {
  company?: {
    name: string;
    alias: string;
    address: string;
    about: string;
    logo: string;
  };
  person?: { name: string; uid: number };
  copyRight?: string;
  city?: { id: string; name: string };
  area?: {
    [key: string]: string;
  };
  contact?: {
    contactName: { type: number; name: string; content: string };
    weChat: { type: number; name: string; content: string };
    phone: { type: number; name: string; content: string };
    phone2: { type: number; name: string; content: string };
    qq: [{ type: number; name: string; content: string }];
    kf53: any;
    kf53StyleUrl: any;
    union400: string[];
  };
}

export interface BannerListItem {
  displayImgUrl: string;
  hrefUrl: string;
  id: number;
  imgUrl: string;
  position: ModulePageType;
  status: number;
  weight: number;
}

export type MediaCateSource = 'IMAGE' | 'VIDEO';

export interface GetMediaCatesParam {
  page: number;
  size: number;
}

export interface getMediaCatesNameListParam {
  source: MediaCateSource;
}

export interface CreateMediaCatesParam {
  name: string;
}

export interface UpdateMediaCatesParam {
  id: number;
  name?: string;
  cover?: number;
  source: MediaCateSource;
}

export interface GetMediaAssetsParam {
  mediaCateId?: number; // 获取用户所有图片则不传分类ID
  page: number;
  size: number;
  source: MediaCateSource;
  onlyApprove?: boolean;
}

export interface CreateMediaAssetsParam {
  mediaCateId?: number; // 不传则上传到默认图库
  title?: string;
  imgUrl: string;
  videoUrl?: string;
  source: MediaCateSource;
}

export interface ReAuditMediaAssetsParam {
  id: number;
}

export type DelMediaCatesParam = number[];

export interface DelMediaAssetsParam {
  ids: number[];
  mediaCateId: number;
  source: MediaCateSource;
}

export interface UpdateMediaAssetsInCateParam {
  id: number;
  mediaCateId: number;
}

export interface UpdateMediaAssetsParam {
  id: number;
  title: string;
}

export interface MoveMediaAssetsParam {
  id: number;
  mediaCateId: number;
}

export interface GetMediaCatesRes {
  mediaCateBos: {
    totalRecord: number;
    result: MediaCateItem[];
  };
}

export interface GetMediaAssetsRes {
  mediaImgBos: ListRes<MediaAssetsItem[]>;
}

export interface GetMediaFailedAssetsParam {
  page: number;
  size: number;
  source: MediaCateSource;
}

export interface GetMediaFailedAssetsRes {
  mediaImgBos: ListRes<MediaAssetsItem[]>;
}

export interface MediaCatesNameListItem {
  id: number;
  name: string;
  type: MediaCateNameListItemType;
}

// 资源分类类型（默认分类不能编辑、删除）
type MediaCateNameListItemType = 'DEFAULT' | 'NORMAL';

// 相册
export type MediaCateItem = {
  id: number;
  name: string;
  coverUrl: string;
  totalImg: number;
  type: MediaCateNameListItemType;
};

/**
 * DEFAULT          初始化
 * APPROVE          审核通过
 * REJECT_BYMACHINE 机审驳回
 * REAPPLY          申诉中
 * REJECT_BYHUMAN   人审驳回
 * ENCODE_FAILED    视频转码失败
 */
export type CheckStatusType =
  | 'DEFAULT'
  | 'APPROVE'
  | 'REJECT_BYMACHINE'
  | 'REAPPLY'
  | 'REJECT_BYHUMAN'
  | 'ENCODE_FAILED';
export type ImageType = 'NOT_COVER' | 'COVER';
export type MediaType = 'IMAGE' | 'VIDEO';
export type DecodeStatus = 'DEFAULT' | 'DECODING' | 'SUCCESS' | 'FAILED';
// 分类内资源类型
// TODO rename
export type MediaAssetsItem = {
  id: number;
  imgUrl: string;
  videoUrl: string;
  source: MediaType;
  type: ImageType;
  checkStatus: CheckStatusType;
  reason: string;
  title: string;
  decodeStatus: DecodeStatus;
};

export type CardItem = MediaCateItem | MediaAssetsItem;

// 相册管理目录层级类型
type TabScopeItemBase = {
  item: CardItem | null;
};

export type TabScopeItem =
  | (TabScopeItemBase & {
    type: 'album';
    label: '相册' | '分组';
    countLabel: '个';
  })
  | (TabScopeItemBase & {
    type: 'image';
    label: '图片' | '视频';
    countLabel: '张';
  })
  | (TabScopeItemBase & {
    type: 'audit';
    label: '资源';
    countLabel: '项';
  });
export type TabScope = TabScopeItem[];

/* 店铺图集相关定义 End */

/** 店铺模块管理相关 开始 */
export type ModulePageType =
  | 'homePage'
  | 'productListPage'
  | 'articleListPage'
  | 'productInfoPage'
  | 'articleInfoPage'
  | 'commonMessagePage'
  | 'aboutPage';

export type ModuleComponentId =
  | 'banner'
  | 'productRecommend'
  | 'autoConfig'
  | 'articleList'
  | 'about'
  | 'articleRecommend'
  | 'messageModule'
  | 'message';

export interface ModuleInitPage {
  position: ModulePageType;
  name: string;
  infoList: ModuleInitComponent[];
}

export interface ModuleInitComponent {
  pageModule: string;
  name: string;
  max: number;
}

export interface ModuleSelectProductListItem {
  id: number;
  name: string;
  price: string;
  headImg: string;
  urlSuffix: string;
  createdTime: number;
  memo: string;
  status: AuditStatus;
  [key: string]: any;
}

export interface ModuleSelectArticleListItem {
  id: number;
  name: string;
  urlSuffix: string;
  createdTime: number;
  modifiedTime: number;
  memo: string;
  status: AuditStatus;
  [key: string]: any;
}

export interface ModuleRequestParam {
  position: ModulePageType;
  pageModule: ModuleComponentId;
}

export interface ModuleProductSwiper {
  backGroundImg: string;
  productList: ModuleSelectProductListItem[];
  /** 判断是选择了店铺还是 */
  bannerProduct: boolean;
}

export interface ModuleProductSwiperParam
  extends ModuleRequestParam,
  ModuleProductSwiper {
  productIdList: number[];
}

export interface ModuleProductSwiperNoParam extends ModuleRequestParam {
  bannerProduct: boolean;
}

export interface ModuleProductInfo {
  name: string;
  productList: ModuleSelectProductListItem[];
}

export interface ModuleProductInfoParam extends ModuleRequestParam {
  name: string;
  productIdList: number[];
}

export interface ModuleArticleInfo {
  name: string;
  articleList: ModuleSelectArticleListItem[];
}

export interface ModuleHomeArticleListInfo {
  name: string;
  articleList: ListRes<ModuleSelectArticleListItem[]>;
}

export interface ModuleArticleInfoParam extends ModuleRequestParam {
  name: string;
  articleIdList: number[];
}

export interface ModuleHomeABoutInfo {
  name: string;
  tags: string[];
  media: string;
  videoUrl: string;
}

export interface InitModuleHomeABoutInfo {
  name: string;
  tags: string[];
  media: MediaItem | '';
}

export interface ModuleHomeABoutInfoParam
  extends ModuleRequestParam,
  ModuleHomeABoutInfo { }

export interface ModuleABoutABoutInfo {
  backImg: string;
}

export interface InitModuleABoutABoutInfo {
  backImg: MediaItem | '';
}

export interface ModuleABoutABoutInfoParam
  extends ModuleRequestParam,
  ModuleABoutABoutInfo { }


export interface AdviceRecord {
  content: string,
  contact: string,
  identity: string,
}

export interface MessageModule {
  industry: string
}

export interface DetailParam {
  value: string,
  key: string,
  status: boolean
}
export interface CommonMessageForm {
  title: string,
  detail: DetailParam[],
  button: string
}

/** 店铺模块管理相关 结束 */
