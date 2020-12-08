import { VerifyStatus, VerifyType } from '@/enums';

export interface VerifyItem {
  status: VerifyStatus;
  verifyRequestType: VerifyType;
}

export interface UserInfo {
  userId: string;
  userName: string;
  mobile: string;
}
