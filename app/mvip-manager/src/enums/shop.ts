export enum ShopStatus {
  INIT = 0, // 初始化
  ONLINE = 1, // 上线
  OFFLINE_SENSITIVE = 2, // 审核驳回下线
  DELETE = 3, // 删除
  OFFLINE_SHOP_OPERATION = 4, // 商户主动操作下线
  REFUND = 5, // 退款下线
  EXPIRED = 6 // 过期-仅展示使用，数据库状态不会变动
}

/**
 * INIT 初始化：显示提交按钮
 * VERIFY 审核中：
 * APPROVE：通过 前端没有特殊显示
 * MACHINE_REJECT & HUMAN_REJECT 审核失败：显示memo字段原因
 */
export enum ShopVersionStatusEnum {
  INIT = 'INIT',
  VERIFY = 'VERIFY',
  APPROVE = 'APPROVE',
  MACHINE_REJECT = 'MACHINE_REJECT',
  HUMAN_REJECT = 'HUMAN_REJECT'
}

export enum AppSourceEnum {
  VIP = 1,
  YHT = 2, // 易慧推
  FM = 3,
  BW = 4,
  YBS = 'YBS'
}

export enum TicketType {
  CREATE = 1,
  RENEW = 2
}
