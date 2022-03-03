import { ServicePath } from '@/enums'
import { getApiData, postApiData, setShopHeader } from './base'
import {TdkFillMeta} from '@/interfaces/shop';
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

