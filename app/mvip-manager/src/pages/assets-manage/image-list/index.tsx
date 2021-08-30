import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react'
import { Button, Modal, Result } from "antd"

import EmptyListIcon from '@/icons/empty-list'
import { successMessage, errorMessage } from "@/components/message"
import { getMediaCatesList, getMediaAssets, delMediaCategory, delMediaAssets } from '@/api/shop'
import NavBar from './page-nav/index'
import AlbumCardWrapper from './album-card/index'
import ImageCardWrapper from './image-card/index'
import CardsPage from '../cards-page/index'
import useSelectAlbumListsModal from '../cards-page/select-album-modal/index'

import CardsPageContext, { CardsPageContextProvider } from '../context/cards-page'
import AlbumNamesContext, { AlbumNamesContextProvider } from '../context/album-names'

import { MediaCateSource, TabScope, TabScopeItem, CardItem, MediaCateItem, MediaAssetsItem } from "@/interfaces/shop"
import { PageNavProps, DeleteBatchProps, EmptyTipProps } from '../cards-page/index'

// TODO 页面权限

const AssetsMangeImageListPageContexted = (props: any) => {
  let { directoryType } = props
  directoryType = directoryType || 'IMAGE'
  return (
    <CardsPageContextProvider>
      <AlbumNamesContextProvider sourceType={directoryType}>
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

  /* 是否打开默认的上传框 */
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const openUploadID = useMemo<number>(() => {
    const openID = params.get('open-upload')
    if (openID) {
      return Number(openID)
    } else {
      return 0
    }
  }, [params])

  const { defaultScope, navBar } = props
  const { directoryType, directoryLabel, subDirectoryLabel, dispatch } = useContext(CardsPageContext)

  useEffect(() => {
    dispatch({
      type: 'update-directory-type',
      payload: props.directoryType || 'IMAGE'
    })
  }, [props.directoryType])

  const { lists: allAlbumLists, refresh: refreshAllAlbumLists } = useContext(AlbumNamesContext)
  // "默认分组"类型的相册
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
              ? delMediaCategory
              : delMediaAssets
            const query = isScopeAlbum
              ? {
                ids: [...selection],
                source: directoryType
              }
              : {
                ids: [...selection],
                mediaCateId: curScope?.item?.id,
                source: directoryType
              }
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
  }, [isScopeAlbum, directoryType, directoryLabel, refreshAllAlbumLists])

  // 全选时不需要选择默认相册
  const selectAllFrom = useCallback((lists: CardItem[]) => (
    lists.filter(x => (x as MediaCateItem).type !== 'DEFAULT')
  ), [isScopeAlbum])

  // 获取列表
  const fetchListFn = useMemo(() => {
    if (isScopeAlbum) {
      return fetchAssetsCatesList(directoryType)
    }
    if (isScopeImage) {
      return fetchAssetsList(directoryType)
    }
    return null
  }, [directoryType, isScopeAlbum, isScopeImage])

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
    if (isScopeAlbum) {
      return AlbumCardWrapper
    }
    if (isScopeImage) {
      return ImageCardWrapper
    }
    return PaddingHooksCard
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
        icon={<EmptyListIcon />}
        title={info}
        extra={$extra}
        style={{ margin: 'auto' }}
      />
    )
  }, [isScopeAlbum, isScopeImage, directoryLabel, subDirectoryLabel])

  // 视频预览
  const customCardItemPreview = useMemo(() => {
    if (directoryType === 'VIDEO') {
      return (previewItem: CardItem) => {
        const { videoUrl, imgUrl } = previewItem as MediaAssetsItem
        return (
          <video src={videoUrl} poster={imgUrl} preload="preload" controls autoPlay key={videoUrl + '-' + imgUrl}>
            your browser does not support the video tag
          </video>
        )
      }
    } else {
      return null
    }
  }, [directoryType])

  return (
    <CardsPage
      defaultScope={defaultScope || ({ item: null, type: 'album', label: '相册', countLabel: '个' })}
      openUploadID={openUploadID}
      pageNav={pageNav}
      fetchListFn={fetchListFn}
      deleteBatch={deleteBatch}
      selectAllFrom={selectAllFrom}
      selectionExcludeFilter={selectionExcludeFilter}
      tabScopeChange={tabScopeChange}
      cardItem={customCardItem}
      emptyTip={emptyTip}
      customCardItemPreview={customCardItemPreview}
    >
      {/* 选择相册模态框 */}
      {$selectAlbumModal}
    </CardsPage>
  )
}

// 由于组件切换时状态有顺序和数量相等限制，
// 暂时用一个组件用来填充
function PaddingHooksCard(props: any) {
  const { } = useContext(CardsPageContext)
  const { } = useContext(AlbumNamesContext)
  const [_, __] = useState('for padding')
  return (props: any) => {
    return null
  }
}

/**
 * API 请求
 */

function fetchAssetsCatesList(sourceType: MediaCateSource) {
  return async (querys: any) => {
    try {
      querys.source = sourceType
      const res = await getMediaCatesList(querys)
      const { result = [], totalRecord = 0 } = res.data.mediaCateBos
      return [result, totalRecord] as const
    } catch (err) {
      throw new Error(err)
    }
  }
}

function fetchAssetsList(sourceType: MediaCateSource) {
  return async (querys: any) => {
    try {
      querys.source = sourceType
      const res = await getMediaAssets(querys)
      const { result = [], totalRecord = 0 } = res.data.mediaImgBos
      return [result, totalRecord] as const
    } catch (err) {
      throw new Error(err)
    }
  }
}

// AssetsMangeImageListPageContexted.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeImageListPageContexted
