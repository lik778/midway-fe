import { ShopType } from '../enums/switchShopType'
export interface SearchShopListItem {
  userId: number,
  shopId: number,
  domain: string,
  type: ShopType.B2B | ShopType.B2C,
}

export interface GetShopListParams {
  domain: string,
  shopId: number,
  userId: number
}