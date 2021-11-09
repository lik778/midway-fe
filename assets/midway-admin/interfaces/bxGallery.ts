
export interface MediaCateListItem {
  id: number,
  name: string,
  // type: string, 这两个字段暂时不需要
  // source: string 这两个字段暂时不需要
}

export interface MediaInfoListItem {
  id: number,
  imgUrl: string,
  usrId: number,
  createdTime: number
}
