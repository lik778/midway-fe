import { postApiData, request, upFile } from './base';

import { MidMenuItem } from '@/interfaces/base';
import { ServicePath } from '@/enums/index'

// 获取左侧菜单
export const getMenuApi = () => {
  return postApiData<{ menuList: MidMenuItem[] }>(ServicePath.SHOP, 'midway/menu/getMenuList')
}

export const upImageToYoupai = (params: any) => {
  return upFile(window.__upyunImgConfig?.uploadUrl, {
    data: params
  })
}

export const upVideoToYoupai = (params: any) => {
  return upFile(window.__upyunVideoConfig?.uploadUrl, {
    data: params
  })
}

// 打点接口
export const track = (params: any) => {
  return request.post(ServicePath.TRACKER, params, {})
}
