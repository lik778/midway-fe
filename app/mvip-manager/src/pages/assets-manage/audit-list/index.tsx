import React, { useState, useMemo, useCallback } from 'react'
import { Result } from "antd"

import { getImagesetFailedImage, delImagesetFailedImage } from '@/api/shop'
import ErrorCardWrapper from './error-card/index'
import CardListPage from '../card-list-page/index'

import { TabScopeItem } from "@/interfaces/shop"

// 资源管理申诉列表页
const AssetsMangeAuditListPage = () => {

  const selectionDeleteFn = (shopId: number, curScope?: TabScopeItem) => {
    if (!curScope) return null
    const fn = delImagesetFailedImage
    const ret = async (query: any) => fn(shopId, query)
    ret.getQuery = (selection: number[]) => ({ ids: [...selection], mediaCateId: curScope?.item?.id })
    return ret
  }

  const emptyTip = useCallback(({}) => (
    <Result
      title="当前没有申诉中的图片哦~"
      style={{ margin: 'auto' }}
    />
  ), [])

  return (
    <CardListPage
      customScope={{ type: 'audit', item: null }}
      fetchListFn={fetchErrorImageLists}
      selectionDeleteFn={selectionDeleteFn}
      cardItem={ErrorCardWrapper}
      emptyTip={emptyTip}
    />
  )
}

async function fetchErrorImageLists(shopId: number, querys: any) {
  try {
    const res = await getImagesetFailedImage(shopId, querys)
    const { result = [], totalRecord = 0 } = res.data.mediaImgBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

// AssetsMangeAuditListPage.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeAuditListPage
