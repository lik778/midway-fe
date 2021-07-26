import { postApiData, upFile } from './base';

import { ServiceResponse } from '@/interfaces/api';
import { MidMenuItem } from '@/interfaces/base';
import { ServicePath } from '@/enums/index'

// 获取左侧菜单
export const getMenuApi = (): Promise<ServiceResponse<{ menuList: MidMenuItem[] }>> => {
  return postApiData(ServicePath.SHOP, 'midway/menu/getMenuList')
}

export const upImageToYoupai = (params: any) => {
  return upFile(window.__upyunImgConfig?.uploadUrl, {
    data: params
  })
}

// 打点接口
export const track = (params: any): Promise<void> => {
  // console.log(params)
  return postApiData(ServicePath.TRACKER, '', params)
}
