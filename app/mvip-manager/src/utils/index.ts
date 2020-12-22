import { uploadImgToUpyunReq } from '@/api/haojing';
import dayjs from 'dayjs';
import { DomainStatus } from '@/enums';
import { productText } from '@/constants';

export const uploadImgToUpyunHandle = (file: File | Blob): Promise<any> => {
  const params = new FormData()
  const { uploadParams: { policy, signature }, uploadUrl} = window.__upyunImgConfig
  params.append('file', file)
  params.append('policy', policy)
  params.append('signature', signature)
  return new Promise((resolve, reject) => {
    uploadImgToUpyunReq(uploadUrl, params).then(res => {
      const { code } = res.data
      code === 200 ? resolve(res.data) : reject(res)
    })
  })
}

export const addKeyForListData = (list: any, page?: number) => {
  const pageSize = 10
  if (!list || list.length === 0) return [];
  return list.map((x: any, i: number) => {
    return { ...x, key: page ? (page - 1) * pageSize + i + 1 : i + 1 }
  })
}

export const formatTime = (time: string): string  => {
  return dayjs(Number(time) * 1000).format('YYYY-MM-DD')
}

export const checkHasShow = function<T>(list: T[] | null): string {
  if (list === null) return 'loading'
  if (list.length === 0) return 'hide';
  return 'show';
}

export const formUnvalid = function(formInstance: any) {
  return formInstance.getFieldsError().some((x: any) => x.errors.length > 0)
}

export const isEmptyObject = (obj: any): boolean =>  {
  return JSON.stringify(obj) === '{}';
}

export const notEmptyObject = (obj: any): boolean =>  {
  return JSON.stringify(obj) !== '{}';
}

export const randomStr = () => {
  return Math.random().toString(15).substr(2)
}

// 产品名字翻译机
export const translateProductText  = (name: string, type: DomainStatus): string => {
  const aliasItem = productText()[type];
  return aliasItem ? aliasItem[name] : '';
}

export const randomList = (list: string[], limitNum: number): string[] => {
  if (!list || list.length === 0) return [];
  const res: string[] = [];
  while (res.length <= limitNum) {
    const randomIndex: number = Math.floor(Math.random() * list.length);
    const randomItem = list[randomIndex];
    if (!res.includes(randomItem)) {
      res.push(list[randomIndex]);
    }
  }
  return res
}
