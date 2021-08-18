import React, { useState, useMemo, useCallback, useContext } from 'react'
import { Button, Modal, Result } from "antd"

import { successMessage, errorMessage } from "@/components/message"
import { getImagesetAlbum, getImagesetImage, delImagesetAlbum, delImagesetImage } from '@/api/shop'
import NavBar from './page-nav/index'
import AlbumCardWrapper from './album-card/index'
import ImageCardWrapper from './image-card/index'
import CardsPage from '../cards-page/index'

import AlbumNamesContext, { AlbumNamesContextProvider } from '../context/album-names'

import { TabScope, CardItem, AlbumItem } from "@/interfaces/shop"
import { PageNavProps, DeleteBatchProps, EmptyTipProps } from '../cards-page/index'
import { CustomCardItemProps } from '../cards-page/cards-container/index'

const AssetsMangeImageListPageContexted = () => {
  return (
    <AlbumNamesContextProvider>
      <AssetsMangeImageListPage />
    </AlbumNamesContextProvider>
  )
}

// 资源管理 - 相册列表
const AssetsMangeImageListPage = () => {

  /***************************************************** States */
  const { lists: allAlbumLists } = useContext(AlbumNamesContext)
  const defaultAlbumIDs = useMemo(() => allAlbumLists.filter(x => x.type === 'DEFAULT').map(x => x.id), [allAlbumLists])
  const selectionExcludeFilter = useMemo(() => (x: number) => defaultAlbumIDs.includes(x), [defaultAlbumIDs])

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

  // 批量删除
  const deleteBatch = useCallback((props: DeleteBatchProps) => {
    const {
      curScope, selection,
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
            deleteFn(query as any)
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

  // 全选时不需要选择默认相册
  const selectAllFrom = useCallback((lists: CardItem[]) => (
    lists.filter(x => (x as AlbumItem).type !== 'DEFAULT')
  ), [isScopeAlbum])

  // 获取列表
  const fetchListFn = useMemo(() => {
    if (isScopeAlbum) {
      return fetchAlbumLists
    }
    if (isScopeImage) {
      return fetchImageLists
    }
    return null
  }, [isScopeAlbum, isScopeImage])

  /***************************************************** Renders */

  // 自定义卡片
  const customCardItem = useMemo(() => {
    if (isScopeAlbum) {
      return AlbumCardWrapper
    }
    if (isScopeImage) {
      return ImageCardWrapper
    }
    return PaddingHooks
  }, [isScopeAlbum, isScopeImage])

  // 页头
  const pageNav = useCallback((props: PageNavProps) => {
    const {
      tabScope, curScope,
      goTabScope, createAlbum, openUpload
    } = props
    return (
      <NavBar
        tabScope={tabScope}
        curScope={curScope}
        goTabScope={goTabScope}
        createAlbum={createAlbum}
        openUpload={openUpload}
      />
    )
  }, [])

  // 空列表提示
  const emptyTip = useCallback((props: EmptyTipProps) => {
    const { curScope, createAlbum, openUpload } = props
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
        pageNav={pageNav}
        fetchListFn={fetchListFn}
        deleteBatch={deleteBatch}
        selectAllFrom={selectAllFrom}
        selectionExcludeFilter={selectionExcludeFilter}
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

async function fetchAlbumLists(querys: any) {
  try {
    const res = await getImagesetAlbum(querys)
    const { result = [], totalRecord = 0 } = res.data.mediaCateBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

async function fetchImageLists(querys: any) {
  try {
    const res = await getImagesetImage(querys)
    const { result = [], totalRecord = 0 } = res.data.mediaImgBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

// AssetsMangeImageListPageContexted.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeImageListPageContexted
