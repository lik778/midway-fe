import { postApiData } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { ListRes } from '@/interfaces/base';

// 获取左侧菜单
export const getMenuApi = (): Promise<ServiceResponse<ListRes<any>>> => {
  return postApiData('midway/menu/getMenuList')
}

