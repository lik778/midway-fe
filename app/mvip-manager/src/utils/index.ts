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

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = (timeStamp: number | string) => {
  const timeStr = String(timeStamp)
  return timeStr.length > 10
}

export const formatTime = (time: string | number): string => {

  return dayjs(Number(time) * (isMillisecond(time) ? 1 : 1000)).format('YYYY-MM-DD')
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
// 给第一个 moment 减去一天而不是给第二个 moment 加一天是因为，
// 这个值要放回 range-picker 组件进行展示
export const getLastMonth = (anchor?: any, classic?: boolean) => {
  anchor = anchor || moment()
  return classic ? [
    moment(anchor.clone().format('YYYY-MM-DD')).subtract(1, 'months'),
    moment(anchor.clone().format('YYYY-MM-DD')).add(1, 'day').subtract(1, 'second')
  ] : [
    moment(moment().format('YYYY-MM-DD')).subtract(1, 'months'),
    moment(moment().format('YYYY-MM-DD'))
  ]
}

// 获取上一周的时间区间
export const getLastWeek = (anchor?: any, classic?: boolean) => {
  anchor = anchor || moment()
  return classic ? [
    moment(anchor.clone().format('YYYY-MM-DD')).subtract(1, 'weeks'),
    moment(anchor.clone().format('YYYY-MM-DD')).add(1, 'day').subtract(1, 'second')
  ] : [
    moment(anchor.clone().format('YYYY-MM-DD')).subtract(1, 'weeks'),
    moment(anchor.clone().format('YYYY-MM-DD'))
  ]
}

// 获取过去24小时时间区间
export const getLast24Hours = (anchor?: any, classic?: boolean) => {
  anchor = anchor || moment()
  return classic ? [
    moment(anchor.clone().format('YYYY-MM-DD')),
    moment(anchor.clone().format('YYYY-MM-DD')).add(1, 'day').subtract(1, 'second')
  ] : [
    moment(anchor.clone().format('YYYY-MM-DD')).subtract(1, 'day'),
    moment(anchor.clone().format('YYYY-MM-DD'))
  ]
}

// TODO refactor no effects
// 格式化 ant date-range 时间值，
// 约定：选中 01-23 ~ 01-24，即选中了 01-23 和 01-24 两天
export const formatDateRange = (dates: any, query: any, startKey = 'startTime', endKey = 'endTime') => {
  if (!dates || !dates.length) return []
  const [start, end] = dates
  query[startKey] = String(start.unix())
  query[endKey] = String(end.add(1, 'day').subtract(1, 'second').unix())
}

export const formatRange = (dates: any[]) => {
  if (!dates || !dates.length) return []
  const [start, end] = dates
  return [
    String(start.unix()),
    String(end.unix())
  ]
}

export const insertStyle = (cssText: string) => {
  const style = document.createElement('style');
  const textNode = document.createTextNode(cssText);
  const head = document.head || document.getElementsByTagName('head')[0];
  style.appendChild(textNode);
  head.appendChild(style);
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
把类目的对象格式{"..":"..",..}，转换为[{key:..,value:..},..]格式。且判断初始为null直接返回。
*/
export const objToTargetObj = <T, K extends keyof T>(obj: T, key = 'key'): any[] => {
  if (!obj) return []
  return Object.keys(obj).map((k) => ({ [key]: obj[k as K], key: obj[k as K], value: k }))
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

/**
 * @description 获取文件base64url
 * @param file
 * @returns
 */
export const getFileBase64 = function (file: Blob): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = error => reject(error);
  });
}

const $decodeHTMLCodeContainer = document.createElement('a')
export const decodeHTMLCodeSafe = (message: string) => {
  try {
    $decodeHTMLCodeContainer.innerHTML = message
    return $decodeHTMLCodeContainer.innerText
  } catch (err) {
    return message
  }
}

// 简单判断字符串是不是合法的 URL
export const isValidURL = (url: string) => {
  return /(^https?)|(^\/\/)/.test(url)
}
