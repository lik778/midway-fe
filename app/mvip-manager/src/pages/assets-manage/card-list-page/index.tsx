import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from "umi"
import { Pagination, Button, Result } from "antd"

import PageNav from './components/nav'
import Cards from './components/cards'
import SelectionBlock from './components/selection'
import { useCreateAlbumModal } from './components/create-album-modal'
import { useUploadModal } from './components/upload-modal'

import usePrevious from './hooks/previous'
import { useSelection } from './hooks/selection'
import { usePagination } from './hooks/pagination'
import useAllAlbumNames from './hooks/album-names'

import { RouteParams, TabScope, TabScopeItem, CardItem, AlbumItem } from "@/interfaces/shop"
import { DeleteMethod as SelectionBlockDeleteMethod } from './components/selection'
import { CustomCardItemProps } from './components/cards'

import styles from './index.less'

type CardsListPageProps = {
  // TODO type customScope required
  customScope?: TabScopeItem
  handleScopeChange?: any
  fetchListFn?: any
  isScopeAlbum?: boolean
  isScopeImage?: boolean
  selectionDeleteFn: null | ((shopId: number, curScope: TabScopeItem | undefined) => SelectionBlockDeleteMethod)
  cardItem?: (props: any) => (props: CustomCardItemProps) => JSX.Element
  emptyTip: (props: {
    curScope?: TabScopeItem,
    createAlbum?: any,
    openUpload?: any
  }) => JSX.Element
}
const CardListPage = (props: CardsListPageProps) => {

  /***************************************************** States */

  const {
    customScope, handleScopeChange, fetchListFn, isScopeAlbum, isScopeImage,
    selectionDeleteFn, cardItem, emptyTip
  } = props
  const params: RouteParams = useParams()
  // const shopId = Number(params.id)
  // FIXME 暂时写死，用来调试
  const shopId = 3863

  // tabScope 维护当前页面内文件夹的层级关系
  const [tabScope, setTabScope] = useState<TabScope>([customScope || { type: 'album', item: null }])
  const [curScope, setCurScope] = useState<TabScopeItem>()
  const prevCurScope = usePrevious(curScope)
  useEffect(() => {
    const lastScope = tabScope[tabScope.length - 1]
    lastScope && setCurScope(lastScope)
    handleScopeChange && handleScopeChange(tabScope)
  }, [tabScope])

  const [pagi, setPagi, pagiConf, setPagiConf, resetPagi] = usePagination({
    pageSizeOptions: ['8', '16', '32']
  })
  const pagiQuery = useMemo(() => {
    let page = pagi.current
    let size = pagiConf.pageSize
    // @ts-ignore
    const isChangeScope = curScope && prevCurScope && (curScope.type !== prevCurScope.type)
    if (isChangeScope) {
      page = 1
      resetPagi()
    }
    return { page, size }
  }, [pagi.current, pagiConf.pageSize, curScope])
  const [allAlbumLists, allAlbumListsTotal, refreshAllAlbumLists] = useAllAlbumNames(shopId)
  const defaultAlbumIDs = useMemo(() => allAlbumLists.filter(x => x.type === 'DEFAULT').map(x => x.id), [allAlbumLists])
  const [lists, total, loading, refreshLists] = useLists(shopId, pagiQuery, curScope, fetchListFn)

  // 刷新列表可以就地刷新或重置分页（重置分页后会自动刷新）
  const refresh = useCallback((resetPage?: boolean, showLoading?: boolean) => {
    if (resetPage) {
      if (pagi.current !== 1) {
        resetPagi()
      } else {
        refreshLists(showLoading)
      }
    } else {
      refreshLists(showLoading)
    }
  }, [pagi.current, refreshLists, resetPagi])

  // 列表接口可能不会返回默认相册，但是 nameList 接口一定会返回默认相册，
  // 所以这里判断列表接口为空时，等待 allAlbumLists 有结果之后再重新请求
  // 请求时间指数避退
  useEffect(() => {
    // @ts-ignore
    const canRefresh = (curScope && curScope.type === 'album') &&
      lists.length === 0 &&
      allAlbumLists.length > 0
    if (canRefresh) {
      // @ts-ignore
      window._mvip_imageset_ticktime = window._mvip_imageset_ticktime || 500
      // @ts-ignore
      if (window._mvip_imageset_ticktime < 5 * 1000) {
        // @ts-ignore
        if (window._mvip_imageset_tick) {
          // @ts-ignore
          window.clearTimeout(window._mvip_imageset_tick)
        }
        // @ts-ignore
        window._mvip_imageset_tick = setTimeout(() => {
          // @ts-ignore
          window._mvip_imageset_ticktime = window._mvip_imageset_ticktime * 2
          refresh()
        // @ts-ignore
      }, window._mvip_imageset_ticktime)
      }
    }
    // @ts-ignore
    return () => window.clearTimeout(window._mvip_imageset_tick)
  }, [lists, allAlbumLists, curScope])

  const [selection, setSelection, select, unselect] = useSelection({
    excludeFn: x => defaultAlbumIDs.includes(x)
  })

  // 层级变换时重置选取
  useEffect(() => {
    if (curScope) {
      setSelection([])
    }
  }, [curScope])

  /***************************************************** Interaction Fns */

  // 切换翻页自动刷新列表
  const handlePagiChange = (page: number, pageSize?: number | undefined) => {
    pageSize = pageSize || pagiConf.pageSize
    const pageSizeChanged = pageSize !== pagiConf.pageSize
    setPagi({ ...pagi, current: pageSizeChanged ? 1 : page })
    setPagiConf({ ...pagiConf, pageSize })
  }

  // 切换文件层级
  const goTabScope = (scope: TabScopeItem) => {
    let newScopes = [...tabScope]
    const target = newScopes.find(x => x?.item?.id === scope?.item?.id)
    if (target) {
      const idx = newScopes.findIndex(x => x === target)
      if (idx !== -1) {
        newScopes = newScopes.slice(0, idx + 1)
      }
    } else {
      newScopes.push(scope)
    }
    setTabScope(newScopes)
  }

  /***************************************************** Renders */

  const [$CreateAlbumModal, createOrEditAlbum] = useCreateAlbumModal({ shopId, refresh })

  // 创建或编辑相册后重新拉取所有相册列表
  const createAlbum = useCallback(async (album?: AlbumItem) => {
    const isDone = await createOrEditAlbum(album)
    if (isDone) {
      refreshAllAlbumLists()
    }
  }, [createOrEditAlbum])

  const [$UploadModal, openUpload] = useUploadModal({ shopId, createAlbum, refresh, allAlbumLists, curScope })

  // 选择区域的删除函数
  const selectionDeleteMethod = useMemo(
    () => selectionDeleteFn && selectionDeleteFn(shopId, curScope),
    [shopId, curScope, selectionDeleteFn]
  )

  // 空列表提示
  const renderCardListEmptyTip = useMemo(
    () => emptyTip && emptyTip({ curScope, createAlbum, openUpload }),
    [emptyTip, curScope, createAlbum, openUpload]
  )

  return (
    <>
      {/* 内容 */}
      <div className={`container ${styles["container"]}`}>
        {/* 页面内导航栏 */}
        <PageNav
          shopId={shopId}
          tabScope={tabScope}
          curScope={curScope}
          goTabScope={goTabScope}
          createAlbum={createAlbum}
          openUpload={openUpload}
        />
        {/* 选框区 */}
        <SelectionBlock
          shopId={shopId}
          total={total}
          isScopeAlbum={isScopeAlbum}
          curScope={curScope}
          selection={selection}
          lists={lists}
          refreshAllAlbumLists={refreshAllAlbumLists}
          select={select}
          unselect={unselect}
          setSelection={setSelection}
          refresh={refresh}
          deleteFn={selectionDeleteMethod}
        />
        {/* 图片/相册展示区 */}
        <Cards
          shopId={shopId}
          lists={lists}
          tabScope={tabScope}
          curScope={curScope}
          isScopeAlbum={isScopeAlbum}
          isScopeImage={isScopeImage}
          selection={selection}
          allAlbumLists={allAlbumLists}
          loading={loading}
          pagiConf={pagiConf}
          setPagiConf={setPagiConf}
          refreshAllAlbumLists={refreshAllAlbumLists}
          setSelection={setSelection}
          refresh={refresh}
          goTabScope={goTabScope}
          select={select}
          unselect={unselect}
          cardItem={cardItem && cardItem({ refresh, goTabScope, createAlbum, refreshAllAlbumLists })}
          emptyTip={renderCardListEmptyTip}
        />
        {/* 分页 */}
        {lists.length > 0 && (
          <Pagination
            className={styles["pagination"]}
            defaultCurrent={1}
            current={pagi.current}
            total={total}
            pageSize={pagiConf.pageSize}
            pageSizeOptions={pagiConf.pageSizeOptions}
            onChange={handlePagiChange}
          />
        )}
      </div>
      {/* 图片上传模态框 */}
      {$UploadModal}
      {/* 创建/编辑相册模态框 */}
      {$CreateAlbumModal}
    </>
  )
}

function useLists(shopId: number, query: any, scope: TabScopeItem | undefined, fetchListFn: any) {
  const [lists, setLists] = useState<CardItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [requestTime, setRequestTime] = useState(+new Date())

  const notNull = (x: any) => !!x

  const refresh = (showLoading?: boolean) => {
    setLoading(showLoading || true)
    setLists([])
    setTotal(0)
    setRequestTime(+new Date())
  }

  useEffect(() => {
    /* Gaurds */
    if (!shopId || !scope) {
      return
    }
    let fetchMethod = fetchListFn
    if (!fetchMethod) {
      console.warn('[WARN] no fetch method provided')
      return
    }
    if (scope.type === 'image') {
      if (!(scope.item && scope.item.id)) {
        return
      } else {
        query.mediaCateId = scope.item!.id
      }
    }
    /* Query & Fetch */
    setLoading(true)
    fetchMethod(shopId, query)
      .then(res => {
        if (res) {
          const [result, total] = res
          // @ts-ignore
          const lists = (result || []).filter(notNull)
          setLists(lists)
          setTotal(total || 0)
        }
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [shopId, fetchListFn, query, requestTime])

  return [lists, total, loading, refresh, setLists, setTotal] as const
}

// CardListPage.wrappers = ['@/wrappers/path-auth']

export default CardListPage
