import React, { useEffect, useState, useMemo } from 'react';

import { getAlbumNameList } from '@/api/shop'

import { AlbumNameListItem } from "@/interfaces/shop";

// 获取相册钩子
function useAlbumLists(query: any = {}) {
  const [lists, setLists] = useState<AlbumNameListItem[]>([])
  const [total, setTotal] = useState(0)
  const [requestTime, setRequestTime] = useState(+new Date())

  const notNull = (x: any) => !!x

  const refresh = () => setRequestTime(+new Date())

  useEffect(() => {
    fetchAlbumNameLists()
      .then(([result, total]) => {
        // console.log(result, total, pagination, requestTime)
        setLists(result.filter(notNull))
        setTotal(total)
      })
      .catch(error => {
        console.error(error)
      })
  }, [query, requestTime])

  return [lists, total, refresh, setLists, setTotal] as const
}

export default function useAllAlbumNames() {
  const query = useMemo(() => ({}), [])
  const [lists, total, refresh, setLists, setTotal] = useAlbumLists(query)
  return [lists, total, refresh, setLists, setTotal] as const
}

async function fetchAlbumNameLists() {
  try {
    const res = await getAlbumNameList()
    return [res.data, res.data.length] as const
  } catch(err) {
    throw new Error(err)
  }
}
