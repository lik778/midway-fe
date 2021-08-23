export type CheckStatusType = 'DEFAULT' | 'APPROVE' | 'REJECT_BYMACHINE' | 'REAPPLY' | 'REJECT_BYHUMAN'
export type ImageType = 'NOT_COVER' | 'COVER'

/**
 * @description 相册图片类型
 */
export type MediaAssetsItem = {
  id: number,
  name?: string,
  imgUrl: string,
  type: ImageType,
  checkStatus: CheckStatusType,
  reason:string,
}