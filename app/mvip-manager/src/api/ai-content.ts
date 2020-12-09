import { postApiData, setShopHeader } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { PageParams } from '@/interfaces/base';
import { AiShopList, CreateApiParams } from '@/interfaces/ai-content';

// 获取ai列表页
export const getAiListApi = (params: PageParams): Promise<ServiceResponse<any>> => {
  return postApiData('ai/list', params)
}

// 创建ai任务
export const createAiJobApi = (params: CreateApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('ai/create', params)
}

// 获取店铺对应的文章分组
export const getAiShopListApi = (): Promise<ServiceResponse<AiShopList[]>> => {
  return postApiData('shop/aiShopList', {})
}
