import { uploadImgToUpyunReq } from '@/api/haojing';
import dayjs from 'dayjs'

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

export const addKeyForListData = (list: any) => {
  if (!list || list.length === 0) return [];
  return list.map((x: any, i: number) => {
    return { ...x, key: (i + 1) }
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
