import { NavItem } from '@/interfaces/shop'
export interface NavListItem extends NavItem {
  // 下面用于代码需要 不是页面返回
  key: string
}