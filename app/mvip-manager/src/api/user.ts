import { postApiData } from './base';
import {
  VerifyItem,
  UserInfo,
  UserEnterpriseInfo,
  SaveEnterpriseContactInfoApiParams,
  SaveEnterpriseForShopParams,
} from '@/interfaces/user';
import { ServiceResponse } from '@/interfaces/api';

// 获取用户基础信息
export const getUserBaseInfoApi = (): Promise<ServiceResponse<UserInfo>> => {
  return postApiData('midway/backend/user/getUserBaseInfo', {})
}

// 获取用户企业资料信息
export const getEnterpriseForShopApi = (): Promise<ServiceResponse<UserEnterpriseInfo>> => {
  return postApiData('midway/backend/user/getEnterpriseForShop', {})
}

// 保存用户企业资料信息
export const saveEnterpriseForShopApi = (params: SaveEnterpriseForShopParams): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/user/saveEnterpriseBaseInfo', params)
}

// 保存用户联系资料信息
export const saveEnterpriseContactInfoApi = (params: SaveEnterpriseContactInfoApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/user/saveEnterpriseContactInfo', params)
}

// 获取省市区
export const getAreasApi = (areaId: string): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/user/getChildrenAreaList', { areaId })
}

// 获取用户认证信息
export const getUserVerifyListApi = (): Promise<ServiceResponse<VerifyItem[]>> => {
  return postApiData('midway/backend/user/getVerifyList', {})
}

//获取三级meta信息
//export const getThirdCategoryMetas =():Promise
