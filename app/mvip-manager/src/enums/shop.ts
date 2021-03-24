export enum ShopStatus {
  INIT = 0, // 初始化
  ONLINE = 1, // 上线
  OFFLINE_SENSITIVE = 2, // 审核驳回下线
  DELETE = 3, // 删除
  OFFLINE_SHOP_OPERATION = 4, // 商户主动操作下线
  REFUND = 5, // 退款下线
  EXPIRED = 6 // 过期-仅展示使用，数据库状态不会变动
}
