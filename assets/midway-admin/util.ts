import * as dayjs from 'dayjs';

export const addKeyForListData = (list: any, page?: number) => {
  const pageSize = 10
  if (!list || list.length === 0) return [];
  return list.map((x: any, i: number) => {
    return { ...x, key: page ? (page - 1) * pageSize + i + 1 : i + 1 }
  })
}

export const formatTime = (time: string): string  => {
  return dayjs(Number(time) * 1000).format('YYYY-MM-DD')
}
