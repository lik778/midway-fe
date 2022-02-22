// 获取审核列表页
import { ListRes, PageParams } from '../interfaces/api';
import { postApi, getApi } from '../api/base';
import { checkListItem, SeoCheckParams, VerifyWordParams } from '../interfaces/verify';

export const getVerifyListApi = (params: PageParams) => {
  return postApi<ListRes<any[]>>('/api/midway/manager/ai/list', params)
}

export const verifyWordApi = (params: VerifyWordParams) => {
  return postApi<ListRes<any[]>>('/api/midway/manager/ai/verify', params)
}

export const getSeoListApi = (params) => {
    return postApi<ListRes<checkListItem[]>>('/api/midway/manager/seoCheck/list', params)
}

export const seoCheckAudit = (params: SeoCheckParams) => {
    return getApi<any>('/api/midway/manager/seoCheck/verify', params)
}
