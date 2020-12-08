import { postApiData } from './base';
import { VerifyItem } from '@/interfaces/user';
import { ServiceResponse } from '@/interfaces/api';

// 获取用户认证信息
export const getUserVerifyListApi = (): Promise<ServiceResponse<VerifyItem[]>> => {
  return postApiData('/user/getVerifyList', {})
}
