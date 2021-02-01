// 获取审核列表页
import { ListRes, PageParams } from '../interfaces/api';
import { postApi } from '../api/base';
import { VerifyWordParams } from '../interfaces/verify';

export const getVerifyListApi = (params: PageParams): Promise<ListRes<any[]>> => {
  return postApi('ai/list', params)
}

export const verifyWordApi = (params: VerifyWordParams): Promise<ListRes<any[]>> => {
  return postApi('ai/verify', params)
}
