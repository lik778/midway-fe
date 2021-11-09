import { postApi, getApi, postFileUploadApi } from '../api/base'
import { ListRes, PageParams, } from '../interfaces/api';
import { MediaInfoListItem, MediaCateListItem } from '../interfaces/bxGallery'

export const uploadMedia = (params: {
  file: File,
  policy: string,// 又拍云参数
  signature: string // 又拍云参数
}): any => {
  return postFileUploadApi('', params, {
    baseURL: window.__upyunImgConfig?.uploadUrl,
    withCredentials: false
  })
}

// 获取相册列表
export const getMediaCate = () => {
  return postApi<MediaCateListItem[]>('/api/midway/manager/material/baiXingCateListing', {})
}

export const createMediaCate = (params: { name: string }) => {
  return postApi<{
    id: number,
    name: string
  }>('/api/midway/manager/material/createMediaCate', params)
}

export const createMedia = (params: {
  imgUrl: string,
  mediaCateId: number
}) => {
  return postApi('/api/midway/manager/material/createMedia', params)
}

export const delMedias = (params: {
  ids: number[],   //删除图片的id集合
}) => {
  return postApi('/api/midway/manager/material/delete', params)
}

export const getMediaList = (params: {
  page: number,  //当前页
  size: number,  //数量
  mediaCateId?: number  //相册分类id，为空则是查询所有百姓图库
}) => {
  return postApi<{
    managerMediaImgBos: ListRes<MediaInfoListItem[]>
  }>('/api/midway/manager/material/baiXingImgListing', params)
}



