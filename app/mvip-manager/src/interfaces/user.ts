import { VerifyStatus, VerifyType } from '@/enums';

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
  qqMap: any
  wechat: string
}

export interface QQItem {
  name: string;
  qq: string;
}
