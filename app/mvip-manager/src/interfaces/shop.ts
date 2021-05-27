import { ContentCateType, DomainStatus, ShopIndustryType } from '@/enums';

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
}

export interface ImgDeleteParam {
  id: number;
}

export interface ImgListParam {
  page: number;
  size: number;
  status: number;
  type: number;
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
  domainType: DomainStatus;
  isTicketAvailable: boolean
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