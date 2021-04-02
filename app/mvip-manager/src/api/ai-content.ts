import { postApiData, postZhidaoApiData } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { ListRes, PageParams } from '@/interfaces/base';
import { AiContentItem, AiShopList, AiTaskApiParams, ChooseWord, QuestionTaskListItem, QuestionListItem, EditQuestion, BasicMaterialApiParams, InterrogativeListItem, CreateQuestionTaskPageStatus, CreateQuestionTaskBasicData, QuestionTaskApiParams, BasicMaterialDataItem } from '@/interfaces/ai-content';

// 获取ai列表页
export const getAiListApi = (params: PageParams): Promise<ServiceResponse<ListRes<AiContentItem[]>>> => {
  return postApiData('midway/backend/ai/list', params)
}

// 创建ai任务
export const createAiJobApi = (params: AiTaskApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/ai/create', params)
}

// 获取店铺对应的文章分组
export const getAiShopListApi = (): Promise<ServiceResponse<AiShopList[]>> => {
  return postApiData('midway/backend/shop/aiShopList', {})
}

// 开始AI任务
export const startAiTaskApi = (id: number): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/ai/work', { id })
}

// 暂停AI任务
export const pauseAiTaskApi = (id: number): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/ai/pause', { id })
}

// 更新AI任务
export const updateAiTaskApi = (params: AiTaskApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/ai/update', params)
}

// 创建ai问答
export const createAizhidaoApi = (params: AiTaskApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/ai/create', params)
}

/** 判断显示页面 */
export const getCreateQuestionTaskPageStatus = (): Promise<ServiceResponse<CreateQuestionTaskPageStatus>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/checkCreateAiTask', {})
}

/** 获取问答任务列表 */
export const getQuestionTaskListApi = (params: PageParams): Promise<ServiceResponse<ListRes<QuestionTaskListItem[]>>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/getAiTaskList', params)
}

/** 生成问答进度 */
export const getQuestionBuildStatus = (): Promise<ServiceResponse<'success' | 'start build'>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/getQaBuildStatus', {})
}

/** 获取基础素材库 */
export const getBasicMaterial = (): Promise<ServiceResponse<{ [key: string]: BasicMaterialDataItem[] }>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/getUserRepository', {})
}

/** 基础素材库提交 */
export const submitBasicMaterial = (requestData: BasicMaterialApiParams): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/saveUserRepository', requestData)
}

/** 获取问答任务详情（问答包列表） */
export const getQuestionTaskDetailApi = (id: number): Promise<ServiceResponse<QuestionListItem[]>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/showAiTask', id)
}

/** 获取新建任务基础数据 */
export const getCreateQuestionTaskBasicData = (): Promise<ServiceResponse<CreateQuestionTaskBasicData>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/showCreateAiTask', {})
}

/** 更新生成的问题内容 该接口的返回数据时未提交到发布的*/
export const getQuestionList = (): Promise<ServiceResponse<QuestionListItem[]>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/showQaList', {})
}

/** 提交关键字 */
export const submitCoreWords = (requestData: QuestionTaskApiParams): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/submitSeoWords', requestData)
}

/** 提交发布 */
export const submitTask = (): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/submitTask', {})
}


/** 更新生成的问题内容 */
export const editQuestion = (requestData: EditQuestion): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/updateQuestionAnswer', requestData)
}

export const clearCatch = () => {
  postZhidaoApiData('zhidao/v1/backend/ai/evictAiTaskCache', '226337262')
}