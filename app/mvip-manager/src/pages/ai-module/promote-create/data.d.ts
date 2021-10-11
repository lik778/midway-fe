import { QuestionTaskListItem, AiContentItem } from '@/interfaces/ai-module'
import { ShopStatus } from '@/interfaces/shop'
import { InitCollectionForm, UserVipResourcesListItem } from '@/interfaces/ai-module'

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
    disabled: boolean,
    // 发帖表单数据缓存
    formData: {
      [key: string]: InitCollectionForm
    },
    // 一级类目列表缓存
    vipResourcesList: UserVipResourcesListItem[],
    // 一级类目列表选择值缓存
    selectedVipResources: null | UserVipResourcesListItem
  }
  handleChangeContextData: (data: Partial<AiModuleContextProps>) => void
}