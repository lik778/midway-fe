import { QuestionTaskListItem, AiContentItem } from '@/interfaces/ai-content'

export type ModuleKey = 'postTool' | 'shop' | 'zhidao'

export interface AiModuleContextProps {
  activeModuleKey: ModuleKey
  // 拷贝数据
  copyData: QuestionTaskListItem | AiContentItem | null,
  // 拷贝数据类型
  copyDataType: ModuleKey | null
  // 记录分页
  pageInfo: {
    [key in ModuleKey]: {
      page: number,
      pageTotal: number
    }
  },
  handleChangeContextData: (data: Partial<AiModuleContextProps>) => void
}