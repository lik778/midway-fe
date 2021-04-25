import { postApiData } from './base';
import {
  VerifyItem,
  UserInfo,
  UserEnterpriseInfo,
  SaveEnterpriseContactInfoApiParams,
  SaveEnterpriseForShopParams,
  ZhidaoMaterialData,
  ZhidaoMaterial
} from '@/interfaces/user';
import { ServiceResponse } from '@/interfaces/api';
import { ServicePath } from '@/enums/index'
import { CompanyAdvantageListItem } from '@/interfaces/user';

// 获取用户基础信息
export const getUserBaseInfoApi = (): Promise<ServiceResponse<UserInfo>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/getUserBaseInfo', {})
}

// 获取用户企业资料信息
export const getEnterpriseForShopApi = (): Promise<ServiceResponse<UserEnterpriseInfo>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/getEnterpriseForShop', {})
}

// 保存用户企业资料信息
export const saveEnterpriseForShopApi = (params: SaveEnterpriseForShopParams): Promise<ServiceResponse<any>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/saveEnterpriseBaseInfo', params)
}

// 保存用户联系资料信息
export const saveEnterpriseContactInfoApi = (params: SaveEnterpriseContactInfoApiParams): Promise<ServiceResponse<any>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/saveEnterpriseContactInfo', params)
}

// 获取省市区
export const getAreasApi = (areaId: string): Promise<ServiceResponse<any>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/getChildrenAreaList', { areaId })
}

// 获取用户认证信息
export const getUserVerifyListApi = (): Promise<ServiceResponse<VerifyItem[]>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/getVerifyList', {})
}

//获取三级meta信息
//postApiData至少要有2个参数，只有一个时要加个{}
export const getThirdCategoryMetas = (params: any): Promise<ServiceResponse<any>> => {
  return postApiData(ServicePath.SHOP, `midway/backend/user/getThirdCategoryMetas?categoryId=${params}`, {})
}


/** 获取问答素材库 */
export const getZhidaoMaterial = (): Promise<ServiceResponse<ZhidaoMaterialData>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/getZhidaoMaterial', {})
}


/** 保存问答素材库 */
export const setZhidaoMaterial = (params: ZhidaoMaterial): Promise<ServiceResponse<null>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/saveZhidaoMaterial', params)
}

/** 获取企业优势 */
export const getCompanyAdvantageApi = (): Promise<ServiceResponse<CompanyAdvantageListItem[]>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/getEnterpriseAdvantageList')
}

/** 获取企业优势 */
export const setCompanyAdvantageApi = (requestData: CompanyAdvantageListItem[]): Promise<ServiceResponse<never>> => {
  return postApiData(ServicePath.SHOP, 'midway/backend/user/saveEnterpriseAdvantageList', requestData)
}