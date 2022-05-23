import { getApiData, postApiData } from './base';
import {
  VerifyItem,
  UserInfo,
  UserEnterpriseInfo,
  SaveEnterpriseContactInfoApiParams,
  SaveEnterpriseForShopParams,
  ZhidaoMaterialData,
  ZhidaoMaterial,
} from '@/interfaces/user';
import { ServiceResponse } from '@/interfaces/api';
import { ServicePath } from '@/enums/index'

// 获取用户基础信息
export const getUserBaseInfoApi = () => {
  return postApiData<UserInfo>(ServicePath.SHOP, 'midway/backend/user/getUserBaseInfo', {})
}

// 获取用户企业资料信息
export const getEnterpriseForShopApi = () => {
  return postApiData<UserEnterpriseInfo>(ServicePath.SHOP, 'midway/backend/user/getEnterpriseForShop', {})
}

// 保存用户企业资料信息
export const saveEnterpriseForShopApi = (params: SaveEnterpriseForShopParams) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/user/saveEnterpriseBaseInfo', params)
}

// 保存用户联系资料信息
export const saveEnterpriseContactInfoApi = (params: SaveEnterpriseContactInfoApiParams) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/user/saveEnterpriseContactInfo', params)
}

// 获取省市区
export const getAreasApi = (areaId: string) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/user/getChildrenAreaList', { areaId })
}

// 获取用户认证信息
export const getUserVerifyListApi = () => {
  return postApiData<VerifyItem[]>(ServicePath.SHOP, 'midway/backend/user/getVerifyList', {})
}

//获取二级meta信息
export const getSecondCategoryMetas = (params: any): Promise<ServiceResponse<any>> => {
  return postApiData(ServicePath.SHOP, `midway/backend/user/getSecondCategoryMetas?categoryId=${params}`, {})
}

//获取三级meta信息
//postApiData至少要有2个参数，只有一个时要加个{}
export const getThirdCategoryMetas = (params: any) => {
  return postApiData<any>(ServicePath.SHOP, `midway/backend/user/getThirdCategoryMetas?categoryId=${params}`, {})
}


/** 获取问答素材库 */
export const getZhidaoMaterial = () => {
  return postApiData<ZhidaoMaterialData>(ServicePath.SHOP, 'midway/backend/user/getZhidaoMaterial', {})
}


/** 保存问答素材库 */
export const setZhidaoMaterial = (params: ZhidaoMaterial) => {
  return postApiData<null>(ServicePath.SHOP, 'midway/backend/user/saveZhidaoMaterial', params)
}

/** 判断当前用户是否首次点击引导 */
export const getGuideFirstClick = () => {
    return getApiData<null>(ServicePath.SHOP, 'midway/backend/user/getGuideFirstClick')
}

/** 设置用户为非第一次点击引导界面  */
export const setGuideFirstClick = () => {
    return getApiData<null>(ServicePath.SHOP, 'midway/backend/user/setGuideFirstClick')
}
