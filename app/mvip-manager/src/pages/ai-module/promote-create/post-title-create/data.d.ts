import { CollectionTitleApiParams } from '@/interfaces/ai-module'


interface Rule {
  required: boolean,
  // message: string,
  validator?: (rule: any, value: any, callback: (error?: string) => void) => Promise<void | any> | void,
}

interface FormItemListItem {
  key: keyof CollectionTitleApiParams,
  label: string,
  min: number,
  max: number,
  auto?: number
  tip: string,
  rules: Rule[],
  readOnly?: boolean
  placeholder: string,
}

export interface SelectListItem {
  label: string,
  value: string,
  children?: SelectListItem[]
}

export interface SelectConfig {
  key: keyof CollectionTitleApiParams,
  label: string,
  tip: string,
  rules: Rule[]
}



interface FormParmas {
  city?: SelectListItem[],
  area: SelectListItem[],
  prefix: string,
  main: string,
  suffix: string,
  notCityWord: boolean
}
