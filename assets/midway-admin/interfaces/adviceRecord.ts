export interface resultList {
  cellStyleMap: {},
  time: string,
  usrId: number,
  shopId: number,
  domain: string,
  identity: string,
  contact: string,
  content: string
}

export interface Advicerespone {
  result: resultList[],
  pageSize: number,
  totalPage: number,
  totalRecord: number
}