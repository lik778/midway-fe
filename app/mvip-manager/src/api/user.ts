import { postApiData, getApi } from './base';
import {
  VerifyItem,
  UserInfo,
  UserEnterpriseInfo,
  SaveEnterpriseContactInfoApiParams,
  SaveEnterpriseForShopParams,
} from '@/interfaces/user';
import { ServiceResponse } from '@/interfaces/api';
import { AxiosResponse } from 'axios';

// 获取用户基础信息
export const getUserBaseInfoApi = (): Promise<ServiceResponse<UserInfo>> => {
  return postApiData('user/getUserBaseInfo', {})
}

// 获取用户企业资料信息
export const getEnterpriseForShopApi = (): Promise<ServiceResponse<UserEnterpriseInfo>> => {
  return postApiData('user/getEnterpriseForShop', {})
}

// 保存用户企业资料信息
export const saveEnterpriseForShopApi = (params: SaveEnterpriseForShopParams): Promise<ServiceResponse<any>> => {
  return postApiData('user/saveEnterpriseBaseInfo', params)
}

// 保存用户联系资料信息
export const saveEnterpriseContactInfoApi = (params: SaveEnterpriseContactInfoApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('user/saveEnterpriseContactInfo', params)
}

// 获取省市区
export const getAreasApi = (areaId: string): Promise<ServiceResponse<any>> => {
  return postApiData('user/getChildrenAreaList', { areaId })
}

// 获取用户认证信息
export const getUserVerifyListApi = (): Promise<ServiceResponse<VerifyItem[]>> => {
  return postApiData('user/getVerifyList', {})
}

//
export const getKf53Info = (): Promise<AxiosResponse<any>> => {
  return getApi('/kf53/api/script')
}

export const editKf53Info = (params: any): Promise<AxiosResponse<any>> => {
  return getApi('/kf53/api/edit', params)
}
