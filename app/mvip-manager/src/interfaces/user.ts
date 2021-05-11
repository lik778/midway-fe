import { KFStatus, VerifyStatus, VerifyType } from '@/enums';

export interface VerifyItem {
  status: VerifyStatus;
  verifyRequestType: VerifyType;
}

export interface SaveEnterpriseForShopParams {
  area: any;
  companyAddress: string;
  companyAlias: string;
  companyDescription: string;
  companyName: string;
  companyYears: number;
  employeeCount: number;
  firstCategory?: string;
  serviceArea: string;
  promoteImg: string;
  secondCategory: string;
  thirdMetas: string[];
}

export interface SaveEnterpriseContactInfoApiParams {
  contactMobile: string;
  contactMobile2?:string;
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
  companyName: string;
  companyAlias: string;
  area: { [key: string]: string };
  companyAddress: string;
  companyDescription: string;
  promoteImg: string;
  employeeCount: number;
  companyYears: number;
  firstCategory: { [key: string]: string };
  selectedSecondCategory: { [key: string]: string };
  secondCategories: { [key: string]: string };
  selectedThirdMetas: { [key: string]: string };
  thirdMetas: { [key: string]: string };
  contactName: string;
  contactMobile: string;
  contactMobile2?: string;
  wechat: string;
  qqMap: { [key: string]: string };
  companyNameLock: boolean;
  kefuStatus: KFStatus;
  kf53Info: KF53Info|null;
  serviceArea: string;
}


export interface KF53Info {
  userId: string;
  companyName: string;
  phone: string;
  bname: string;
  style: string;
  password: string;
  styleUrl: any;
}

export interface QQItem {
  name: string;
  qq: string;
}

export interface ThirdMetas {
  label: string;
  value: string
}

export interface ZhidaoMaterial {
  banner1: string,
  banner2: string,
  siteUrl: any
}

export interface ZhidaoMaterialData extends ZhidaoMaterial {
  siteUrls: any
}
