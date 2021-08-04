import { ListRes } from "@/interfaces/base";

export interface ConfigItem {
  name: string,
  label: string,
  btnText: string,
  tip: string,
  required: boolean,
  maxLength: number,
  ajaxApi: (...arg: any) => Promise<ListRes<any>>,
  rules?: any[]
}