import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react'
import { Button, Modal, Result } from "antd"

import { successMessage, errorMessage } from "@/components/message"
import { getMediaAlbum, getMediaImage, delMediaAlbum, delMediaImage } from '@/api/shop'
import NavBar from './page-nav/index'
import AlbumCardWrapper from './album-card/index'
import ImageCardWrapper from './image-card/index'
import CardsPage from '../cards-page/index'
import useSelectAlbumListsModal from '../cards-page/select-album-modal/index'

import CardsPageContext, { CardsPageContextProvider } from '../context/cards-page'
import AlbumNamesContext, { AlbumNamesContextProvider } from '../context/album-names'

import { TabScope, TabScopeItem, CardItem, AlbumItem, ImageItem } from "@/interfaces/shop"
import { PageNavProps, DeleteBatchProps, EmptyTipProps } from '../cards-page/index'

const AssetsMangeImageListPageContexted = (props: any) => {
  return (
    <CardsPageContextProvider>
      <AlbumNamesContextProvider>
        <AssetsMangeImageListPage {...props} />
      </AlbumNamesContextProvider>
    </CardsPageContextProvider>
  )
}

// 资源管理 - 相册列表
const AssetsMangeImageListPage = (props: {
  directoryType: string
  navBar: null | ((props: PageNavProps) => JSX.Element)
  defaultScope: TabScopeItem
}) => {

  /***************************************************** States */

  const { directoryType: propsDirectoryType, navBar, defaultScope } = props
  const { directoryType, directoryLabel, subDirectoryLabel, dispatch } = useContext(CardsPageContext)

  // useEffect(() => {
  //   console.log('refresh get:', refresh)
  // }, [refresh])

  useEffect(() => {
    dispatch({
      type: 'update-directory-type',
      payload: propsDirectoryType || 'image'
    })
  }, [propsDirectoryType])

  const { lists: allAlbumLists, refresh: refreshAllAlbumLists } = useContext(AlbumNamesContext)
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
      refresh, setSelection
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
        : `本次预计删除 ${count} ${isScopeAlbum ? `个${directoryLabel}` : '张图片'}，删除后无法恢复，确认删除？`
      Modal.confirm({
        title: '确认删除',
        content: info,
        width: 532,
        onCancel() { },
        onOk() {
          return new Promise((resolve, reject) => {
            const deleteFn = isScopeAlbum
              ? delMediaAlbum
              : delMediaImage
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
  }, [isScopeAlbum, directoryLabel, refreshAllAlbumLists])

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

  // 选择相册模态框
  const [$selectAlbumModal, selectAlbum] = useSelectAlbumListsModal()

  useEffect(() => {
    dispatch({
      type: 'update-select-album',
      payload: selectAlbum
    })
  }, [selectAlbum])

  // 自定义卡片
  const customCardItem = useMemo(() => {
    console.log('custom render card order - isScopeAlbum isScopeImage', isScopeAlbum, isScopeImage)
    if (isScopeImage) {
      return ImageCardWrapper
    } else {
      return AlbumCardWrapper
    }
  }, [isScopeAlbum, isScopeImage])

  // 页头
  const pageNav = useCallback((props: PageNavProps) => {
    return navBar
      ? navBar(props)
      : <NavBar {...props} />
  }, [])

  // 空列表提示
  const emptyTip = useCallback((props: EmptyTipProps) => {
    const { curScope, createAlbum, openUpload } = props
    let info, $extra
    if (isScopeAlbum) {
      info = `没有找到${directoryLabel}，快新建一个吧~`
      $extra = <Button type="primary" onClick={() => createAlbum()}>新建{directoryLabel}</Button>
    }
    if (isScopeImage) {
      info = `当前相册还没有${subDirectoryLabel}，快上传一些吧~`
      $extra = <Button type="primary" onClick={() => openUpload(curScope!.item!.id)}>上传{subDirectoryLabel}</Button>
    }
    return (
      <Result
        title={info}
        extra={$extra}
        style={{ margin: 'auto' }}
      />
    )
  }, [isScopeAlbum, isScopeImage, directoryLabel, subDirectoryLabel])

  // 视频预览
  const cardItemPreview = useMemo(() => {
    if (directoryType === 'video') {
      return (previewItem: CardItem) => {
        const { imgUrl } = previewItem as ImageItem
        return <video src={imgUrl} preload="preload" />
      }
    } else {
      return null
    }
  }, [directoryType])

  return (
    <CardsPage
      defaultScope={defaultScope || ({ item: null, type: 'album', label: '相册', countLabel: '个' })}
      pageNav={pageNav}
      fetchListFn={fetchListFn}
      deleteBatch={deleteBatch}
      selectAllFrom={selectAllFrom}
      selectionExcludeFilter={selectionExcludeFilter}
      tabScopeChange={tabScopeChange}
      cardItem={customCardItem}
      emptyTip={emptyTip}
      cardItemPreview={cardItemPreview}
    >
      {/* 选择相册模态框 */}
      {$selectAlbumModal}
    </CardsPage>
  )
}

/**
 * API 请求
 */

async function fetchAlbumLists(querys: any) {
  try {
    const res = await getMediaAlbum(querys)
    const { result = [], totalRecord = 0 } = res.data.mediaCateBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

async function fetchImageLists(querys: any) {
  try {
    const res = await getMediaImage(querys)
    const { result = [], totalRecord = 0 } = res.data.mediaImgBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

// AssetsMangeImageListPageContexted.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeImageListPageContexted
