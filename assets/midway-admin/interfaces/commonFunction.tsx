// export interface SearchShopListItem {
//   shopId: number,
//   domain: string,
// }
// 修改店铺名称 传入店铺id 和店铺名称
export interface Getshopmodifystore {
  domain: string,
  id: number,
}
// 添加店铺白名单  清楚 53 用户缓存  传入用户id
// 添加TKD白名单  清楚 53 用户缓存  传入用户id
export interface Getshopmodifystore {
  userId: number
}

