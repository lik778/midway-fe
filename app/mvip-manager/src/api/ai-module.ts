import { postApiData, getApiData } from './base';
import { ServiceResponse } from '@/interfaces/api';
import { ListRes, PageParams } from '@/interfaces/base';
import { AiContentItem, AiShopList, AiTaskApiParams, ChooseWordList, QuestionTaskListItem, QuestionListItem, EditQuestion, BasicMaterialApiParams, InterrogativeListItem, CreateQuestionTaskPageStatus, CreateQuestionTaskBasicData, QuestionTaskApiParams, BasicMaterialDataItem, GetQuotaNumRes, CollectionListItem } from '@/interfaces/ai-module';
import { ServicePath } from '@/enums/index'

// 获取ai列表页
export const getAiListApi = (params: PageParams) => {
  return postApiData<ListRes<AiContentItem[]>>(ServicePath.SHOP, 'midway/backend/ai/list', params)
}

// 创建ai任务
export const createAiJobApi = (params: AiTaskApiParams) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/ai/create', params)
}

// 获取店铺对应的文章分组 : Promise<ServiceResponse<>>
export const getAiShopListApi = () => {
  return postApiData<AiShopList[] | null>(ServicePath.SHOP, 'midway/backend/shop/aiShopList', {})
}

// 开始AI任务
export const startAiTaskApi = (id: number) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/ai/work', { id })
}

// 暂停AI任务
export const pauseAiTaskApi = (id: number) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/ai/pause', { id })
}

// 更新AI任务
export const updateAiTaskApi = (params: AiTaskApiParams) => {
  return postApiData<any>(ServicePath.SHOP, 'midway/backend/ai/update', params)
}

/** 提交选词列表 **/
export const submitAiChooseWordListApi = (params: { taskId: number | null, notSelectWordIds: number[] }) => {
  return postApiData<null>(ServicePath.SHOP, 'midway/backend/ai/select', params)
}

/** 获得文章对应选词列表 **/
export const getAiChooseWordListApi = (params: { taskId: number | null }) => {
  return postApiData<ChooseWordList>(ServicePath.SHOP, 'midway/backend/ai/hotword', params)
}

/** 判断显示页面 */
export const getCreateQuestionTaskPageStatusApi = () => {
  return postApiData<CreateQuestionTaskPageStatus>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/checkCreateAiTask', {})
}

/** 获取问答任务列表 */
export const getQuestionTaskListApi = (params: PageParams) => {
  return postApiData<ListRes<QuestionTaskListItem[]>>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/getAiTaskList', params)
}

/** 点击查看详情 检查当前任务是否完全入库 */
export const getQuestionTaskStatusApi = (id: number) => {
  return postApiData<'true' | 'false'>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/checkShowQaList', id)
}

/** 生成问答进度 */
export const getQuestionBuildStatusApi = () => {
  return postApiData<'success' | 'start build'>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/getQaBuildStatus', {})
}

/** 获取基础素材库 */
export const getBasicMaterialApi = () => {
  return postApiData<{ [key: string]: BasicMaterialDataItem[] }>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/getUserRepository', {})
}

/** 基础素材库提交 */
export const submitBasicMaterialApi = (requestData: BasicMaterialApiParams) => {
  return postApiData<never>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/saveUserRepository', requestData)
}

/** 获取问答任务详情（问答包列表） */
export const getQuestionTaskDetailApi = (id: number) => {
  return postApiData<QuestionListItem[]>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/showAiTask', id)
}

/** 获取新建任务基础数据 */
export const getCreateQuestionTaskBasicDataApi = () => {
  return postApiData<CreateQuestionTaskBasicData>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/showCreateAiTask', {})
}

/** 更新生成的问答内容 该接口的返回数据时未提交到发布的*/
export const getQuestionListApi = () => {
  return postApiData<QuestionListItem[]>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/showQaList', {})
}

/** 提交关键字 */
export const submitCoreWordsApi = (requestData: QuestionTaskApiParams) => {
  return postApiData<never>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/submitSeoWords', requestData)
}

/** 提交发布 */
export const submitTaskApi = () => {
  return postApiData<'true' | 'false'>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/submitTask', {})
}

/** 取消发布 */
export const cancalTaskApi = () => {
  return postApiData<never>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/evictAiTaskCache', {})
}


/** 更新生成的问答内容 */
export const editQuestionApi = (requestData: EditQuestion) => {
  return postApiData<never>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/updateQuestionAnswer', requestData)
}

/** 获取当前免费数量 剩余信息发布点 */
export const getQuotaNumApi = () => {
  return postApiData<{
    queryResultVo: GetQuotaNumRes,
    consumeCount: number,
    buyUrl?: string
  }>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/getQaAiPostQuota', {})
}

/** 暂停启动任务 */
export const setTaskStatusApi = (id: number) => {
  return postApiData<never>(ServicePath.ZHIDAO, 'zhidao/v1/backend/ai/stateEvent', id)
}


/** 发帖通开始 */
/** 获取素材包列表 */
/**
 * @param page 从第0页开始 
 */
export const getCollectionList = (parmas: { page: number, size: number }) => {
  return getApiData<CollectionListItem[]>(ServicePath.POST_TOOL, 'post-tool/v1/collections', parmas)
}

export const updateCollection = (parmas: Partial<CollectionListItem> & { id: number }) => {
  return getApiData<CollectionListItem[]>(ServicePath.POST_TOOL, `post-tool/v1/collections/${parmas.id}`, parmas)
}