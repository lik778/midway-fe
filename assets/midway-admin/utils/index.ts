
/**
 * 用于mock数据使用
 */
import { ServiceResponse } from '../interfaces/api';
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


