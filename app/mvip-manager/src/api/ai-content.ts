import { postApiData } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { ListRes, PageParams } from '@/interfaces/base';
import { AiContentItem, AiShopList, AiTaskApiParams , ChooseWord } from '@/interfaces/ai-content';

// 获取ai列表页
export const getAiListApi = (params: PageParams): Promise<ServiceResponse<ListRes<AiContentItem[]>>> => {
  return postApiData('ai/list', params)
}

// 创建ai任务
export const createAiJobApi = (params: AiTaskApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('ai/create', params)
}

// 获取店铺对应的文章分组
export const getAiShopListApi = (): Promise<ServiceResponse<AiShopList[]>> => {
  return postApiData('shop/aiShopList', {})
}

// 开始AI任务
export const startAiTaskApi = (id: number): Promise<ServiceResponse<any>> => {
  return postApiData('ai/work', { id })
}

// 暂停AI任务
export const pauseAiTaskApi = (id: number): Promise<ServiceResponse<any>> => {
  return postApiData('ai/pause', { id })
}

// 更新AI任务
export const updateAiTaskApi = (params: AiTaskApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('ai/update', params)
}

// 创建ai问答
export const createAizhidaoApi = (params: AiTaskApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('ai/create', params)
}

/** 获得文章对应选词列表 **/
export const getAiChooseWordListApi = ( taskId: number ): Promise<ServiceResponse<ChooseWord>> =>{
  return postApiData('seoword/hotword', { taskId })
}