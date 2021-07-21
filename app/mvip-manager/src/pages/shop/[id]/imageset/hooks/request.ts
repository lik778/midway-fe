import React, { useEffect, useState } from 'react';

/**
 * ! WIP Warning，do not use at this time
 * */

// 请求及结果钩子
// TODO request pool
export default function useRequest(requestFn: any, query: any[]) {
  const [res, setRes] = useState<any>()
  const [time, setTime] = useState(+new Date())

  const refresh = () => setTime(+new Date())

  console.log('useRequest')

  useEffect(() => {
    requestFn(...query)
      .then((res: any) => setRes(res))
      .catch((error: any) => console.error(error))
  }, [query, time])

  return [res, refresh]
}

// * Readme
// @examples
// export function useAlbumLists(shopId: number, pagi: any = {}) {
//   const [lists, setLists] = useState<AlbumItem[]>([])
//   const [total, setTotal] = useState(0)

//   const query = useMemo(() => [shopId, {page: pagi.current, size: pagi.pageSize}], [pagi.current, pagi.pageSize])
//   const [res, refresh] = useRequest(fetchAlbumLists, query)

//   useEffect(() => {
//     if (!res) {
//       return
//     }
//     const [result, total] = res
//     setLists(result)
//     setTotal(total)
//   }, [res])

//   return [lists, total, refresh, setLists] as const
// }
