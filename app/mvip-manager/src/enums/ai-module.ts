export enum ZhidaoAiTaskQuestionStatus {
  WIATING = 0, // 待发送
  DONE = 1, // 发送成功
  REJECT = 2, // 发送失败
}

export enum AiTaskStatus {
  ON_TASK = 0, // 发文中
  ON_PAUSE = 1, // 已暂停
  DONE = 2, // 已发完
  REJECT = 3, // 审核驳回
  DEFAULT = 4, // 待审核
  ON_SELECT = 5 //待用户选词
}

export enum DomainStatus {
  PREFIX = "PREFIX", // 前缀
  SUFFIX = "SUFFIX", // 后缀
  CUSTOM = "CUSTOM" // 自定义
}

export enum AiTaskAction {
  START = 'start',
  PAUSE = 'pause'
}

/** 问答AI任务状态 */
export enum ZhidaoAiTaskStatus {
  /**
     * 任务启动中
     */
  ACTIVE = 'ACTIVE',
  /**
   * 任务暂停中
   */
  PAUSED = 'PAUSED',
  /**
   * 任务异常终止
   */
  ABORTED = 'ABORTED',
  /**
   * 任务已完成
   */
  DONE = 'DONE'
}

export enum COLLECTION_STATUS {
  COLLECTION_FINISHED_STATUS = 'finished',
  COLLECTION_PUBLISH_STATUS = 'publish',
  COLLECTION_PENDING_STATUS = 'pending',
  COLLECTION_REJECT_STATUS = 'reject',
  COLLECTION_DRAFT_STATUS = 'draft',
  COLLECTION_ADVANCE_STATUS = 'advance',
  COLLECTION_DELETED_STATUS = 'deleted',
  COLLECTION_PAUSED_STATUS = 'paused',
}