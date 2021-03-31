import { KFStatus, VerifyStatus, VerifyType } from '@/enums';

export interface VerifyItem {
  status: VerifyStatus;
  verifyRequestType: VerifyType;
}

export interface SaveEnterpriseForShopParams {
  area: string[];
  companyAddress: string;
  companyAlias: string;
  companyDescription: string;
  companyName: string;
  promoteImg: string;
  //知道企业资料合并新加入参字段
  thirdMetas: string[];
  secondCategory: string[];
  employeeCount: number;
  companyYears: number;
}

export interface SaveEnterpriseContactInfoApiParams {
  contactMobile: string;
  contactName: string;
  qqMap: any;
  wechat: string;
}

export interface UserInfo {
  userId: string;
  userName: string;
  mobile: string;
}

export interface UserEnterpriseInfo {
  areaMap: any;
  companyAddress: string;
  companyAlias: string;
  companyDescription: string;
  companyName: string;
  contactMobile: string;
  contactName: string;
  promoteImg: string;
  qqMap: any;
  wechat: string;
  companyNameLock: boolean;
  kf53Info: KF53Info;
  kefuStatus: KFStatus;
}

export interface KF53Info {
  userId: string;
  companyName: string;
  phone: string;
  bname: string;
  style: string;
  password: string;
}

export interface QQItem {
  name: string;
  qq: string;
}

export interface ThirdMetas {
  label: string;
  value: string
}

export interface ZhidaoMaterial{
  banner1: string,
  banner2: string,
  siteUrl: any
}

export interface ZhidaoMaterialData extends ZhidaoMaterial{
  siteUrls: any
}

