export enum AiTaskStatus {
  ON_TASK = 0, // 发文中
  ON_PAUSE = 1, // 已暂停
  DONE = 2, // 已发完
  REJECT = 3, // 审核驳回
  DEFAULT = 4, // 待审核
}

export enum VerifyAction {
  RESOVE = 'resolve',
  REJECTED = 'rejected'
}
