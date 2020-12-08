import { postApiData } from './base';
import { VerifyItem, UserInfo } from '@/interfaces/user';
import { ServiceResponse } from '@/interfaces/api';

// 获取用户基础信息
export const getUserBaseInfoApi = (): Promise<ServiceResponse<UserInfo>> => {
  return postApiData('/user/getUserBaseInfo', {})
}

// 获取用户认证信息
export const getUserVerifyListApi = (): Promise<ServiceResponse<VerifyItem[]>> => {
  return postApiData('/user/getVerifyList', {})
}
