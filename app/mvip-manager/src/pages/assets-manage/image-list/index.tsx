import React, { useState, useMemo, useCallback } from 'react'
import { Button, Result } from "antd"

import CardListPage from '../card-list-page/index'
import { getImagesetAlbum, getImagesetImage, delImagesetAlbum, delImagesetImage } from '@/api/shop'

import { TabScope, TabScopeItem, CardItem, ImageItem } from "@/interfaces/shop"

// 资源管理 - 图集页面
const AssetsMangeImageListPage = () => {

  /***************************************************** States */

  const [isScopeAlbum, setIsScopeAlbum] = useState(false)
  const [isScopeImage, setIsScopeImage] = useState(false)
  const handleScopeChange = (tabScope: TabScope) => {
    const lastScope = tabScope[tabScope.length - 1]
    switch (lastScope.type) {
      case 'album':
        setIsScopeAlbum(true)
        setIsScopeImage(false)
        break
      case 'image':
        setIsScopeAlbum(false)
        setIsScopeImage(true)
        break
    }
  }

  // 选择区域的删除函数
  const selectionDeleteFn = useCallback((shopId: number, curScope?: TabScopeItem) => {
    if (!curScope) return null
    const fn = isScopeAlbum ? delImagesetAlbum : delImagesetImage
    const ret = async (query: any) => fn(shopId, query)
    ret.getQuery = (selection: number[]) => isScopeAlbum
      ? [...selection]
      : ({ ids: [...selection], mediaCateId: curScope?.item?.id })
    return ret
  }, [isScopeAlbum, isScopeImage])

  /***************************************************** Renders */

  // 空列表提示
  const emptyTip = useCallback(({ curScope, createAlbum, openUpload }) => {
    let info, $extra
    if (isScopeAlbum) {
      info = "没有找到相册，快新建一个吧~"
      $extra = <Button type="primary" onClick={() => createAlbum()}>新建相册</Button>
    }
    if (isScopeImage) {
      info = "当前相册还没有图片，快上传一些吧~"
      $extra = <Button type="primary" onClick={() => openUpload(curScope?.item?.id)}>上传图片</Button>
    }
    return (
      <Result
        title={info}
        extra={$extra}
        style={{ margin: 'auto' }}
      />
    )
  }, [isScopeAlbum, isScopeImage])

  return (
    <CardListPage
      customScope={{ type: 'album', item: null }}
      fetchListFn={isScopeAlbum ? fetchAlbumLists : fetchImageLists}
      selectionDeleteFn={selectionDeleteFn}
      handleScopeChange={handleScopeChange}
      emptyTip={emptyTip}
      isScopeAlbum={isScopeAlbum}
      isScopeImage={isScopeImage}
    />
  )
}

async function fetchAlbumLists(shopId: number, querys: any) {
  try {
    const res = await getImagesetAlbum(shopId, querys)
    const { result = [], totalRecord = 0 } = res.data.mediaCateBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

async function fetchImageLists(shopId: number, querys: any) {
  try {
    const res = await getImagesetImage(shopId, querys)
    const { result = [], totalRecord = 0 } = res.data.mediaImgBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

// AssetsMangeImageListPage.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeImageListPage
