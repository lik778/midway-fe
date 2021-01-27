// 获取审核列表页
import { ListRes, PageParams, ServiceResponse } from '../interfaces/api';
import { AiContentItem } from '../interfaces/verify';
import { postApi } from '../api/base';

export const getAiListApi = (params: PageParams): Promise<ServiceResponse<ListRes<AiContentItem[]>>> => {
  return postApi('ai/list', params)
}
