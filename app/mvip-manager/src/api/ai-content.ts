import { postApiData } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { ListRes, PageParams } from '@/interfaces/base';
import { AiContentItem, AiShopList, AiTaskApiParams, QuestionTaskListItem, QuestionListItem, EditQuestion, BasicMaterialApiParams } from '@/interfaces/ai-content';

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

/** 获取问答任务列表 */
export const getQuestionTaskListApi = (params: PageParams): Promise<ServiceResponse<ListRes<QuestionTaskListItem[]>>> => {
  return postApiData('ai/getAiTaskList', params)
}

/** 获取问答任务详情（问答包列表） */
export const getQuestionTaskDetailApi = (id: number): Promise<ServiceResponse<QuestionListItem[]>> => {
  return postApiData('ai/showQaList', { id })
}

/** 更新生成的问题内容 */
export const editQuestion = (question: EditQuestion): Promise<ServiceResponse<never>> => {
  return postApiData('ai/updateQuestionAnswer', question)
}

/** 基础素材库提交 */
export const submitBasicMaterial = (requestData: BasicMaterialApiParams): Promise<ServiceResponse<never>> => {
  return postApiData('ai/saveUserRepository', requestData)
}