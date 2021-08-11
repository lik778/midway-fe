import { ModulePageType, ModuleComponentId } from '@/interfaces/shop'

export interface PageItemOption {
  key: ModulePageType,
  label: string
}
export interface MenuItemOption {
  id: ModuleComponentId,
  name: string,
  thumbnail: string,
  max?: number,
}

