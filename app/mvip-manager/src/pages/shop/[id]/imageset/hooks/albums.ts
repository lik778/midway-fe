import React, { useEffect, useState, useMemo } from 'react';

import { getImagesetAlbum } from '@/api/shop'

import { AlbumItem } from '../types'

// 获取相册钩子
export function useAlbumLists(shopId: number, pagination: any = {}) {
  const [lists, setLists] = useState<AlbumItem[]>([])
  const [total, setTotal] = useState(0)
  const [requestTime, setRequestTime] = useState(+new Date())

  const refresh = () => setRequestTime(+new Date())

  useEffect(() => {
    if (!shopId) {
      return
    }
    const query = {
      page: pagination.current,
      size: pagination.pageSize
    }
    fetchAlbumLists(shopId, query)
      .then(([result, total]) => {
        console.log(result, total, pagination, requestTime)
        setLists(result)
        setTotal(total)
      })
      .catch(error => {
        console.error(error)
      })
  }, [shopId, pagination, requestTime])

  return [lists, total, refresh, setLists, setTotal] as const
}

// 获取所有相册钩子
// * for test you can use `return [[], 0, () => {}, () => {}] as const`
export function useAllAlbumLists(shopId: number) {
  const query = useMemo(() => ({ current: 1, pageSize: 999 }), [])
  const [lists, total, refresh, setLists, setTotal] = useAlbumLists(shopId, query)
  return [lists, total, refresh, setLists, setTotal] as const
}

async function fetchAlbumLists(shopId: number, querys: any) {
  try {
    const res = await getImagesetAlbum(shopId, querys)
    const { totalCate = 0, mediaCateBos = {} } = res.data
    const { result = [] } = mediaCateBos
    return [result, totalCate]
  } catch(err) {
    throw new Error(err)
  }
}
