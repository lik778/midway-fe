import { postApi } from '../api/base'
import { PageParams } from '../interfaces/api';
import {Advicerespone} from '../interfaces/adviceRecord';

export const getAdviceList = (params: PageParams) => {
  return postApi<Advicerespone[]>('/api/midway/manager/shop/search', params)
}