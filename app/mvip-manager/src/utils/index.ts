import dayjs from 'dayjs';
import moment from 'moment';
import { DomainStatus } from '@/enums';
import { productText } from '@/constants';


export const addKeyForListData = (list: any, page?: number, size?: number) => {
  const pageSize = size ? size : 10;
  if (!list || list.length === 0) return [];
  return list.map((x: any, i: number) => {
    return { ...x, key: page ? (page - 1) * pageSize + i + 1 : i + 1 }
  })
}

export const formatTime = (time: string): string => {
  return dayjs(Number(time) * 1000).format('YYYY-MM-DD')
}

export const checkHasShow = function <T>(list: T[] | null): string {
  if (list === null) return 'loading'
  if (list.length === 0) return 'hide';
  return 'show';
}

export const formUnvalid = function (formInstance: any) {
  return formInstance.getFieldsError().some((x: any) => x.errors.length > 0)
}

export const isEmptyObject = (obj: any): boolean => {
  return JSON.stringify(obj) === '{}';
}

export const notEmptyObject = (obj: any): boolean => {
  return JSON.stringify(obj) !== '{}';
}

export const randomStr = () => {
  return Math.random().toString(15).substr(2)
}

// 产品名字翻译机
export const translateProductText = (name: string, type: DomainStatus): string => {
  const aliasItem = productText()[type];
  return aliasItem ? aliasItem[name] : '';
}

export const randomList = (list: string[], limitNum: number): string[] => {
  if (!list || list.length === 0) return [];
  const res: string[] = [];
  while (res.length < limitNum && res.length < list.length) {
    const randomIndex: number = Math.floor(Math.random() * list.length);
    const randomItem = list[randomIndex];
    if (!res.includes(randomItem)) {
      res.push(list[randomIndex]);
    }
  }
  return res
}

export const removeOverflowY = () => {
  document.body.removeAttribute('style')
}

export const removeOverflow = (cb: any) => {
  setTimeout(cb(), 500);
  setTimeout(() => removeOverflowY(), 1000);
}

// 从枚举类型创建 Options 值
// @example: {value:'name'} 转化为 {label:'name', value:'value'}
export const createOptions = (labelMap: any) =>
  Object.entries(labelMap).map(([k, v]) => ({ label: v, value: k }))

export const notInIframe = (): boolean => {
  return (window.self === window.top)
}

export const inIframe = (): boolean => {
  return !notInIframe()
}

export const stringify = (params: any): string => JSON.stringify(params)

// 许多图表组件需要一个默认的选中时间，
// 默认为上一个月
export const getLastMonth = () => [
  moment(moment().format('YYYY-MM-DD')).subtract(1, 'months'),
  moment(moment().format('YYYY-MM-DD'))
]

// TODO refactor
// 格式化 ant date-range 时间值，
// 约定：选中 01-23 ~ 01-24，即选中了 01-23 和 01-24 两天
export const formatDateRange = (dates: any = [], query: any) => {
  if (dates.length === 0) return []
  const [start, end] = dates
  query.startTime = String(start.unix())
  query.endTime = String(end.add(1, 'day').subtract(1, 'second').unix())
}

export const insertStyle = (cssText: string) => {
  const style = document.createElement('style');
  const textNode = document.createTextNode(cssText);
  const head = document.head || document.getElementsByTagName('head')[0];
  style.appendChild(textNode);
  head.appendChild(style);
}

// 灰度测试用, 让测试人员使用
export const hasReportAuth = (): boolean => {
  return !!(localStorage.getItem('shAgent'))
}

export const getCookie = (name: string): string => {
  let result: any = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
  return result ? result.pop() : ''
}

export const isLogin = (): boolean => {
  return getCookie('__u') !== ''
}

export const isUrl = (text: string): boolean => {
  return /^(http:\/\/|https:\/\/)/.test(text)
}

export const isLocalEnv = (): boolean => {
  return location.host.includes('localhost')
}

export const isNotLocalEnv = (): boolean => {
  return !isLocalEnv()
}
/**
*【用于】select组件value要求的string | string[]|number | number[]类型等。
把类目的对象格式{"..":"..",..}，转换为[{key:..,value:..},..]格式。且判断初始为null情况。
*/
export const objToTargetObj = <T,K extends keyof T>(obj:T) =>{
  if(!obj)return
  return Object.keys(obj).map((k) => ({ key: obj[k as K], value: k }))
  }


/**
 * 用于mock数据使用
 */
import { ServiceResponse } from '@/interfaces/api';
/**
 * @param {Number|null} ms 需要延时的毫秒数
 * @returns {String} 延时函数
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * @param {Number|null} ms 需要延时的毫秒数
 * @returns {String} 延时函数
 */
export function mockData<T>(type: 'data', item: T): Promise<ServiceResponse<T>>;
export function mockData<T>(type: 'list', item: T, title: string, pageIndex: number, pageSize: number): Promise<ServiceResponse<{
  result: T[];
  totalRecord: number;
}>>;
export function mockData<T>(type: 'data' | 'list', item: T, title?: string, pageIndex?: number, pageSize?: number): any {
  if (type === 'data') {
    return new Promise(async (resolve) => {
      await delay(1000)
      resolve({
        data: item,
        code: 200,
        success: true
      } as ServiceResponse<T>)
    })
  } else {
    const dataList: T[] = []
    for (let i = 0; i < pageSize!; i++) {
      dataList.push({
        ...item,
        id: i + 1 + (pageIndex! - 1) * pageSize!,
        [title!]: `${i + 1 + (pageIndex! - 1) * pageSize!}条数据`
      })
    }
    return new Promise(async (resolve) => {
      await delay(1000)
      resolve({
        data: {
          result: dataList,
          totalRecord: 20
        },
        code: 200,
        success: true
      } as ServiceResponse<{
        result: T[];
        totalRecord: number;
      }>)
    })
  }
}