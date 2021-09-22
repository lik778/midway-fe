import { QuestionTaskListItem, AiContentItem } from '@/interfaces/ai-module'
import { ShopStatus } from '@/interfaces/shop'

export type ModuleKey = 'postTool' | 'shop' | 'zhidao'

export interface AiModuleContextProps {
  shopStatus: ShopStatus | null,
  loadingShop: boolean,
  activeModuleKey: ModuleKey
  // 拷贝数据
  copyData: QuestionTaskListItem | AiContentItem | null,
  // 拷贝数据类型
  copyDataType: ModuleKey | null
  // 记录分页
  pageInfo: {
    [key in ModuleKey]: {
      page: number,
      dataTotal: number
    }
  },
  handleChangeContextData: (data: Partial<AiModuleContextProps>) => void
}