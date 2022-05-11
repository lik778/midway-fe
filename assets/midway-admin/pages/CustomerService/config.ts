export const DEFAULT = 0//未处理
export const APPROVE = 1//已处理
export const ALREADY = 2//已知晓，但未处理
export const STATUS_LIST = [
    {
      id:1,
      label:'未处理',
      value:DEFAULT
    },
    {
      id:2,
      label:'已处理',
      value:APPROVE
    },
    {
      id:3,
      label:'已知晓,暂未处理',
      value:ALREADY
    }
  ]
  