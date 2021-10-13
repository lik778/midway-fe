import { QuestionTaskListItem, AiContentItem } from '@/interfaces/ai-module'
import { ShopStatus } from '@/interfaces/shop'
import { InitCollectionForm, UserVipResourcesListItem, AuthKey } from '@/interfaces/ai-module'

export type ModuleKey = 'postTool' | 'shop' | 'zhidao'

export interface AiModuleContextProps {
  auth: {
    [key in ModuleKey]: boolean
  } | null,
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
  postToolFormDisabled: boolean,
  postToolFormData: {
    [key: string]: InitCollectionForm
  },
  // 一级类目列表缓存
  vipResourcesList: UserVipResourcesListItem[],
  // 一级类目列表选择值缓存
  selectedVipResources: null | UserVipResourcesListItem
  handleChangeContextData: <T extends keyof AiModuleContextProps>(key: T, data: AiModuleContextProps[T]) => void
}