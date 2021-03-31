import { postApiData } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { MidMenuItem } from '@/interfaces/base';

// 获取左侧菜单
export const getMenuApi = (): Promise<ServiceResponse<{ menuList: MidMenuItem[] }>> => {
  return postApiData('midway/menu/getMenuList')
}

