import { ServicePath } from '@/enums'
import { getApiData, postApiData, setShopHeader } from './base'
import {TdkDetailMeta} from '@/interfaces/shop';
type numInfoType = {
    pass: Boolean,
    areaNum: Number,
    productNum: Number,
    suffixNum: Number
}
export enum checkInfoStatus {
    DEFAULT= 'DEFAULT',
    APPROVE= 'APPROVE',
    REJECT= 'REJECT'
}
type checkInfoType = {
    status: checkInfoStatus,
    msg: String
}

export type seoCheckInfoType = {
    numInfo: numInfoType,
    checkInfo: checkInfoType
}

export const getSeoCheckInfo = (shopId: number) => {
    return getApiData<seoCheckInfoType>(ServicePath.SHOP, `midway/backend/shop/getSeoCheckInfo`, {}, setShopHeader(shopId))
}

export const submitSeoCheck = (shopId: number) => {
    return getApiData<seoCheckInfoType>(ServicePath.SHOP, `midway/backend/shop/submitSeoCheck`, {}, setShopHeader(shopId)) 
}

// 一键填充获取内容
export const getseoAutoFillApi = (shopId: number,params: TdkDetailMeta) => {
    return postApiData<seoCheckInfoType>(ServicePath.SHOP, `midway/backend/meta/seoAutoFill`,params, setShopHeader(shopId))
  }

