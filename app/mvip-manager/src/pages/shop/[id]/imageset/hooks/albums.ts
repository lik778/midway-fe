import React, { useEffect, useState, useMemo } from 'react';

import { getImagesetAlbum } from '@/api/shop'

import { AlbumItem } from "@/interfaces/shop";

// 获取相册钩子
export function useAlbumLists(shopId: number, query: any = {}) {
  const [lists, setLists] = useState<AlbumItem[]>([])
  const [total, setTotal] = useState(0)
  const [requestTime, setRequestTime] = useState(+new Date())

  const refresh = () => setRequestTime(+new Date())

  useEffect(() => {
    if (!shopId) {
      return
    }
    fetchAlbumLists(shopId, query)
      .then(([result, total]) => {
        // console.log(result, total, pagination, requestTime)
        setLists(result)
        setTotal(total)
      })
      .catch(error => {
        console.error(error)
      })
  }, [shopId, query, requestTime])

  return [lists, total, refresh, setLists, setTotal] as const
}

// 获取所有相册钩子
// * for test you can use `return [[], 0, () => {}, () => {}] as const`
export function useAllAlbumLists(shopId: number) {
  const query = useMemo(() => ({ page: 1, size: 999 }), [])
  const [lists, total, refresh, setLists, setTotal] = useAlbumLists(shopId, query)
  return [lists, total, refresh, setLists, setTotal] as const
}

async function fetchAlbumLists(shopId: number, querys: any) {
  try {
    const res = await getImagesetAlbum(shopId, querys)
    const { result, totalRecord } = res.data.mediaCateBos
    return [result, totalRecord] as const
  } catch(err) {
    throw new Error(err)
  }
}
