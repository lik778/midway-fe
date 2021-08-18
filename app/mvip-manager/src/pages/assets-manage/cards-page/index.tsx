import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react'
import { Pagination, Button } from "antd"

import CardList from './cards-container'
import SelectionBar from './page-selection-bar'
import useUploadModal from './upload-modal'
import useCreateAlbumModal from './create-album-modal/index'
import useSelectAlbumListsModal from './select-album-modal/index'

import usePrevious from '@/hooks/previous'
import useSelection from '@/hooks/selection'
import usePagination from '@/hooks/pagination'
import AlbumNamesContext from '../context/album-names'

import { TabScope, TabScopeItem, CardItem, AlbumItem } from "@/interfaces/shop"
import { CustomCardItemProps } from './cards-container'

import styles from './index.less'

declare global {
  interface Window {
    _mvip_imageset_ticktime: number
    _mvip_imageset_tick: NodeJS.Timeout | undefined
  }
}

export type PageNavProps = {
  tabScope: TabScope
  curScope: TabScopeItem
  goTabScope: (scope: TabScopeItem) => void
  createAlbum: (newAlbum?: any) => void
  openUpload: (defaultVal: number) => void
}

export type DeleteBatchProps = {
  curScope: TabScopeItem
  selection: number[]
  lists: CardItem[]
  refresh: (resetPagi?: boolean) => void
  setSelection: (selection: number[]) => void
}

export type EmptyTipProps = {
  curScope: TabScopeItem,
  createAlbum: (newAlbum?: any) => void
  openUpload: (defaultVal: number) => void
}

type CardsPageProps = {
  defaultScope: TabScopeItem
  tabScopeChange?: (tabScope: TabScope) => void
  fetchListFn: ((query: any) => any) | null
  deleteBatch: (props: DeleteBatchProps) => (e: any) => void
  // 选框栏全选时仅计算当前项目
  selectAllFrom: (items: CardItem[]) => CardItem[]
  // useSelection hook 的排除选中
  selectionExcludeFilter?: (select: number) => boolean
  cardItem?: (props: any) => (props: CustomCardItemProps) => (JSX.Element | null) | null
  pageNav: (props: PageNavProps) => JSX.Element
  emptyTip: (props: EmptyTipProps) => JSX.Element
  children?: any
}

const CardsPage = (props: CardsPageProps) => {

  /***************************************************** States */

  const {
    defaultScope,
    tabScopeChange, fetchListFn, deleteBatch, selectAllFrom, selectionExcludeFilter,
    pageNav, cardItem, emptyTip,
  } = props

  // tabScope 维护当前页面内文件夹的层级关系
  const [tabScope, setTabScope] = useState<TabScope>([defaultScope])
  const [curScope, setCurScope] = useState<TabScopeItem>(defaultScope)
  const prevCurScope = usePrevious(curScope, null)
  useEffect(() => {
    const lastScope = tabScope[tabScope.length - 1]
    lastScope && setCurScope(lastScope)
    tabScopeChange && tabScopeChange(tabScope)
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
  const { lists: allAlbumLists, refresh: refreshAllAlbumLists } = useContext(AlbumNamesContext)
  const [lists, total, loading, refreshLists] = useLists(pagiQuery, curScope, fetchListFn)

  // 刷新列表可以重置分页后刷新或就地刷新
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
    const canRefresh = (curScope && curScope.type === 'album') &&
      lists.length === 0 &&
      allAlbumLists.length > 0
    if (canRefresh) {
      window._mvip_imageset_ticktime = window._mvip_imageset_ticktime || 500
      if (window._mvip_imageset_ticktime < 5 * 1000) {
        if (window._mvip_imageset_tick) {
          window.clearTimeout(window._mvip_imageset_tick)
        }
        window._mvip_imageset_tick = setTimeout(() => {
          window._mvip_imageset_ticktime = window._mvip_imageset_ticktime * 2
          refresh()
        }, window._mvip_imageset_ticktime)
      }
    }
    return () => window._mvip_imageset_tick && window.clearTimeout(window._mvip_imageset_tick)
  }, [lists, allAlbumLists, curScope])

  const [selection, setSelection, select, unselect] = useSelection({ excludeFilter: selectionExcludeFilter })

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

  const [$selectAlbumModal, selectAlbum] = useSelectAlbumListsModal()

  const [$CreateAlbumModal, createOrEditAlbum] = useCreateAlbumModal({ refresh })

  // 创建或编辑相册后重新拉取所有相册列表
  const createAlbum = useCallback(async (album?: AlbumItem) => {
    const isDone = await createOrEditAlbum(album)
    if (isDone) {
      refreshAllAlbumLists()
    }
  }, [createOrEditAlbum])

  const [$UploadModal, openUpload] = useUploadModal({ createAlbum, refresh })

  // 选择区域的删除函数
  const selectionDeleteMethod = useMemo(() => (
    deleteBatch({
      curScope,
      selection,
      lists,
      refresh,
      setSelection,
    })
  ), [curScope, selection, lists, refresh, setSelection, deleteBatch])

  // 选框区域扩展按钮
  const $selectionBarActions = useMemo(() => {
    if (selection.length === 0) {
      return null
    }
    return [
      <Button type="text" size="small" onClick={() => setSelection([])} key="clear-btn">
        清除选中
      </Button>,
      <Button type="text" size="small" onClick={(e) => selectionDeleteMethod(e)} key="delete-btn">
        批量删除
      </Button>
    ]
  }, [selection])

  // 空列表提示
  const renderCardListEmptyTip = useMemo(
    () => emptyTip && emptyTip({ curScope, createAlbum, openUpload }),
    [emptyTip, curScope, createAlbum, openUpload]
  )

  // 页头
  const $pageNav = useMemo(() => (
    pageNav({ tabScope, curScope, goTabScope, createAlbum, openUpload })
  ), [tabScope, curScope, goTabScope, createAlbum, openUpload])

  // 自定义卡片
  const renderCardItem = cardItem && cardItem({
    curScope,
    lists,
    selection,
    refresh,
    goTabScope,
    setSelection,
    createAlbum,
    selectAlbum
  })

  return (
    <>
      {/* 内容 */}
      <div className={`container ${styles["container"]}`}>
        {/* 导航栏 */}
        {$pageNav}
        {/* 选框栏 */}
        <SelectionBar
          total={total}
          curScope={curScope}
          selection={selection}
          lists={lists}
          select={select}
          unselect={unselect}
          selectFrom={selectAllFrom}
          actions={$selectionBarActions}
        />
        {/* 卡片展示区 */}
        <CardList
          lists={lists}
          curScope={curScope}
          selection={selection}
          loading={loading}
          pagiConf={pagiConf}
          setPagiConf={setPagiConf}
          setSelection={setSelection}
          refresh={refresh}
          select={select}
          unselect={unselect}
          cardItem={renderCardItem}
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
      {/* 创建/编辑相册模态框 */}
      {$selectAlbumModal}
      {/*  */}
      {props.children}
    </>
  )
}

function useLists(
  query: any,
  scope: TabScopeItem | undefined,
  fetchListFn: ((query: any) => any) | null
) {
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
    if (!scope) {
      return
    }
    if (!fetchListFn) {
      // console.warn('[WARN] no fetch method provided')
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
    fetchListFn(query)
      .then((res: any) => {
        if (res) {
          const [result, total] = res
          const lists = (result || []).filter(notNull)
          setLists(lists)
          setTotal(total || 0)
        }
      })
      .catch((error: Error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })

  }, [query, requestTime, fetchListFn])

  return [lists, total, loading, refresh, setLists, setTotal] as const
}

// CardsPage.wrappers = ['@/wrappers/path-auth']

export default CardsPage
