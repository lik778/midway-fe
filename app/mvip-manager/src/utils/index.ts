import { uploadImgToUpyunReq } from '@/api/haojing';

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
  if (list.length === 0) return [];
  return list.map((x: any, i: number) => {
    return { ...x, key: i }
  })
}
