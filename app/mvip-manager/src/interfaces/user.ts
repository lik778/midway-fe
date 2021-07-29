import { KFStatus, VerifyStatus, VerifyType } from '@/enums';

export interface VerifyItem {
  status: VerifyStatus;
  verifyRequestType: VerifyType;
}

export type ShopMetas = [MetasItem | undefined, MetasItem | undefined, string[]]

export interface InitEnterpriseForShopParams {
  area: any | null;
  companyAddress: string| null;
  companyAlias: string| null;
  companyDescription: string| null;
  companyName: string| null;
  companyYears: number| null;
  employeeCount: number| null;
  firstCategory?: string| null;
  serviceArea: string| null;
  promoteImg: string| null;
  metas: ShopMetas
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
  contactMobile2?: string;
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
  companyName: string | null;
  companyAlias: string | null;
  area: { [key: string]: string } | null;
  companyAddress: string | null;
  companyDescription: string | null;
  promoteImg: string | null;
  employeeCount: number | null;
  companyYears: number | null;
  firstCategory: { [key: string]: string };
  selectedFirstCategory: { [key: string]: string } | null;
  secondCategories: { [key: string]: string };
  selectedSecondCategory: { [key: string]: string } | null;
  thirdMetas: { [key: string]: string } | null;
  selectedThirdMetas: { [key: string]: string } | null;
  contactName: string | null;
  contactMobile: string | null;
  contactMobile2?: string | null;
  wechat: string | null;
  qqMap: { name: string, content: string }[] | null;
  companyNameLock: boolean;
  kefuStatus: KFStatus | null;
  kf53Info: KF53Info | null;
  serviceArea: string | null;
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
  content: string;
}

export interface MetasItem {
  key: string;
  label: string;
  value: string;
  [key: string]: any
}

export interface ZhidaoMaterial {
  banner1: string,
  banner2: string,
  siteUrl: any
}

export interface ZhidaoMaterialData extends ZhidaoMaterial {
  siteUrls: any
}

// 400 号码 请求
export interface Phone400Detail {
  account: string,
  /** 手机号拼接而成 */
  destNums: string | null,
}
