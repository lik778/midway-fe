import { AiTaskStatus } from '../enums/verify';

export const AiTaskStatusText: any = {
  [AiTaskStatus.DEFAULT]: '待审核',
  [AiTaskStatus.ON_TASK]: '发文中',
  [AiTaskStatus.ON_PAUSE]: '已暂停',
  [AiTaskStatus.DONE]: '已发完',
  [AiTaskStatus.DEFAULT]: '已审核'
}
