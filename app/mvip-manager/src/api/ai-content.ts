import { postApiData, postZhidaoApiData } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { ListRes, PageParams } from '@/interfaces/base';
import { AiContentItem, AiShopList, AiTaskApiParams, ChooseWord, QuestionTaskListItem, QuestionListItem, EditQuestion, BasicMaterialApiParams, InterrogativeListItem, CreateQuestionTaskPageStatus, CreateQuestionTaskBasicData, QuestionTaskApiParams, BasicMaterialDataItem, GetQuotaNumRes } from '@/interfaces/ai-content';

// 获取ai列表页
export const getAiListApi = (params: PageParams): Promise<ServiceResponse<ListRes<AiContentItem[]>>> => {
  return postApiData('midway/backend/ai/list', params)
}

// 创建ai任务
export const createAiJobApi = (params: AiTaskApiParams): Promise<ServiceResponse<any>> => {
  return postApiData('midway/backend/ai/create', params)
}

// 获取店铺对应的文章分组
export const getAiShopListApi = (): Promise<ServiceResponse<AiShopList[] | null>> => {
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

/** 获得文章对应选词列表 **/
export const getAiChooseWordListApi = ( params : { taskId : number | null} ): Promise<ServiceResponse<ChooseWordList>> =>{
  return postApiData('midway/backend/ai/hotword', params)
}

/** 判断显示页面 */
export const getCreateQuestionTaskPageStatusApi = (): Promise<ServiceResponse<CreateQuestionTaskPageStatus>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/checkCreateAiTask', {})
}

/** 获取问答任务列表 */
export const getQuestionTaskListApi = (params: PageParams): Promise<ServiceResponse<ListRes<QuestionTaskListItem[]>>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/getAiTaskList', params)
}

/** 点击查看详情 检查当前任务是否完全入库 */
export const getQuestionTaskStatusApi = (id: number): Promise<ServiceResponse<'true' | 'false'>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/checkShowQaList', id)
}

/** 生成问答进度 */
export const getQuestionBuildStatusApi = (): Promise<ServiceResponse<'success' | 'start build'>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/getQaBuildStatus', {})
}

/** 获取基础素材库 */
export const getBasicMaterialApi = (): Promise<ServiceResponse<{ [key: string]: BasicMaterialDataItem[] }>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/getUserRepository', {})
}

/** 基础素材库提交 */
export const submitBasicMaterialApi = (requestData: BasicMaterialApiParams): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/saveUserRepository', requestData)
}

/** 获取问答任务详情（问答包列表） */
export const getQuestionTaskDetailApi = (id: number): Promise<ServiceResponse<QuestionListItem[]>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/showAiTask', id)
}

/** 获取新建任务基础数据 */
export const getCreateQuestionTaskBasicDataApi = (): Promise<ServiceResponse<CreateQuestionTaskBasicData>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/showCreateAiTask', {})
}

/** 更新生成的问答内容 该接口的返回数据时未提交到发布的*/
export const getQuestionListApi = (): Promise<ServiceResponse<QuestionListItem[]>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/showQaList', {})
}

/** 提交关键字 */
export const submitCoreWordsApi = (requestData: QuestionTaskApiParams): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/submitSeoWords', requestData)
}

/** 提交发布 */
export const submitTaskApi = (): Promise<ServiceResponse<'true' | 'false'>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/submitTask', {})
}

/** 取消发布 */
export const cancalTaskApi = (): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/evictAiTaskCache', {})
}


/** 更新生成的问答内容 */
export const editQuestionApi = (requestData: EditQuestion): Promise<ServiceResponse<never>> => {
  return postZhidaoApiData('zhidao/v1/backend/ai/updateQuestionAnswer', requestData)
}

/** 获取当前免费数量 剩余信息发布点 */
export const getQuotaNumApi = (): Promise<ServiceResponse<{
  queryResultVo: GetQuotaNumRes,
  consumeCount: number,
  buyUrl?: string
}>> => {
  // TODO;
  return postZhidaoApiData('zhidao/v1/backend/ai/getQaAiPostQuota', {})
}
/** 提交选词列表 **/
export const submitAiChooseWordListApi = ( params : { taskId:number | null, notSelectWordIds:number[]} ): Promise<ServiceResponse<null>> =>{
  return postApiData('midway/backend/ai/select', params)
}

