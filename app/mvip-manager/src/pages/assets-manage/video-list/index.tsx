import React, { useState, useMemo, useCallback } from 'react'
import { Button, Modal, Result } from "antd"

import { successMessage, errorMessage } from "@/components/message"
import { getImagesetAlbum, getImagesetImage, delImagesetAlbum, delImagesetImage } from '@/api/shop'
import AlbumCardWrapper from './album-card/index'
import ImageCardWrapper from './image-card/index'
import CardsPage from '../cards-page/index'

import { TabScope, TabScopeItem, CardItem, AlbumItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../cards-page/cards-container/index'

// 资源管理 - 图集页面
const AssetsMangeImageListPage = () => {

  /***************************************************** States */

  const [isScopeAlbum, setIsScopeAlbum] = useState(false)
  const [isScopeImage, setIsScopeImage] = useState(false)
  const tabScopeChange = (tabScope: TabScope) => {
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
  const deleteBatch = useCallback((props: {
    shopId: number
    curScope: TabScopeItem | undefined
    selection: number[]
    lists: CardItem[]
    refresh: (resetPagi?: boolean) => void
    setSelection: (selection: number[]) => void
    refreshAllAlbumLists: () => void
  }) => {
    const {
      shopId, curScope, selection,
      refresh, setSelection, refreshAllAlbumLists
    } = props

    return (e: any) => {
      e.stopPropagation()
      if (!curScope) {
        return
      }
      // 批量删除时必定重新刷新页面分页参数，
      // 因为不知道删了啥，删了之后这也还存不存在
      const resetFreshPage = true
      const count = selection.length
      const info = count === 0
        ? `删除后无法恢复，确认删除？`
        : `本次预计删除 ${count} ${isScopeAlbum ? '个相册' : '张图片'}，删除后无法恢复，确认删除？`
      Modal.confirm({
        title: '确认删除',
        content: info,
        width: 532,
        onCancel() { },
        onOk() {
          return new Promise((resolve, reject) => {
            const deleteFn = isScopeAlbum
              ? delImagesetAlbum
              : delImagesetImage
            const query = isScopeAlbum
              ? [...selection]
              : { ids: [...selection], mediaCateId: curScope?.item?.id }
            deleteFn(shopId, query as any)
              .then((res: any) => {
                if (res.success) {
                  successMessage('删除成功');
                  setSelection([])
                  refresh(resetFreshPage)
                  refreshAllAlbumLists()
                  resolve(res.success)
                } else {
                  throw new Error(res.message || "出错啦，请稍后重试");
                }
              })
              .catch((error: any) => {
                errorMessage(error.message)
                setTimeout(reject, 1000)
              })
          })
        }
      })
    }
  }, [isScopeAlbum])

  // 排除默认相册
  const excludes = useCallback((lists: CardItem[]) => (
    lists.filter(x => (x as AlbumItem).type !== 'DEFAULT')
  ),[isScopeAlbum])

  /***************************************************** Renders */

  const customCardItem = useMemo(() => {
    if (isScopeAlbum) {
      return AlbumCardWrapper
    }
    if (isScopeImage) {
      return ImageCardWrapper
    }
    return PaddingHooks
  }, [isScopeAlbum, isScopeImage])

  const fetchListFn = useMemo(() => {
    if (isScopeAlbum) {
      return fetchAlbumLists
    }
    if (isScopeImage) {
      return fetchImageLists
    }
    return null
  }, [isScopeAlbum, isScopeImage])

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
    <CardsPage
      defaultScope={{ item: null, type: 'album', label: '相册', countLabel: '个' }}
      fetchListFn={fetchListFn}
      deleteBatch={deleteBatch}
      excludes={excludes}
      tabScopeChange={tabScopeChange}
      cardItem={customCardItem}
      emptyTip={emptyTip}
    />
  )
}

// 由于组件切换时状态有顺序和数量相等限制，
// 暂时用一个组件用来填充
function PaddingHooks(props: any) {
  const [_, __] = useState('for padding')
  return (props: CustomCardItemProps) => {
    return null
  }
}

/**
 * API 请求
 */

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
