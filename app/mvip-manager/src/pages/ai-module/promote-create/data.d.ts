import { QuestionTaskListItem, AiContentItem } from '@/interfaces/ai-module'
import { ShopStatus } from '@/interfaces/shop'
import { InitCollectionForm } from '@/interfaces/ai-module'

export type ModuleKey = 'postTool' | 'shop' | 'zhidao'

export interface AiModuleContextProps {
  shopStatus: ShopStatus | null,
  loadingShop: boolean,
  activeModuleKey: ModuleKey
  copyId: number | null,
  // 拷贝数据类型
  copyIdType: ModuleKey | null
  // 记录分页
  pageInfo: {
    [key in ModuleKey]: {
      page: number,
      dataTotal: number
    }
  },
  postToolData: {
    formData: {
      [key: string]: InitCollectionForm
    }
  }
  handleChangeContextData: (data: Partial<AiModuleContextProps>) => void
}