import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react'
import { Pagination, Button } from "antd"
import { history } from 'umi'

import { errorMessage } from '@/components/message'
import CardList from './cards-container'
import SelectionBar from './page-selection-bar'
import useUploadModal from './upload-modal'
import useCreateAlbumModal from './create-album-modal/index'
import useEditVideoNameModal from './edit-video-name-modal/index'

import usePrevious from '@/hooks/previous'
import useSelection from '@/hooks/selection'
import usePagination from '@/hooks/pagination'
import CardsPageContext from '../context/cards-page'
import AlbumNamesContext from '../context/album-names'

import { TabScope, TabScopeItem, CardItem, MediaCateItem } from "@/interfaces/shop"
import { CustomCardItemProps } from './cards-container'

import styles from './index.less'

declare global {
  interface Window {
    _mvip_media_ticktime: number
    _mvip_media_tick: NodeJS.Timeout | undefined
  }
}

export type PageNavProps = {
  tabScope: TabScope
  curScope: TabScopeItem
  goTabScope: (scope: TabScopeItem) => void
  createAlbum: (newAlbum?: any) => void
  openUpload: (defaultVal: number) => void
  setSelection: (selection: number[]) => void
  refresh: (resetPagi: boolean) => void
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
  openUploadID?: number
  tabScopeChange?: (tabScope: TabScope) => void
  fetchListFn: ((query: any) => any) | null
  deleteBatch: (props: DeleteBatchProps) => (e: any) => void
  // 选框栏全选时仅计算当前项目
  selectAllFrom: (items: CardItem[]) => CardItem[]
  // useSelection hook 的排除选中
  selectionExcludeFilter?: (select: number) => boolean
  cardItem: (props: any) => (props: CustomCardItemProps) => (JSX.Element | null)
  customCardItemPreview?: null | ((card: CardItem) => (JSX.Element | null))
  pageNav: (props: PageNavProps) => JSX.Element
  emptyTip: (props: EmptyTipProps) => JSX.Element
  children?: any
}

const CardsPage = (props: CardsPageProps) => {

  /***************************************************** States */

  const {
    defaultScope, openUploadID,
    tabScopeChange, fetchListFn, deleteBatch, selectAllFrom, selectionExcludeFilter,
    pageNav, cardItem, customCardItemPreview, emptyTip,
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
    // console.log('pagiQuery', page, size)
    // @ts-ignore
    const isChangeScope = curScope && prevCurScope && (curScope.type !== prevCurScope.type)
    if (isChangeScope) {
      page = 1
      resetPagi()
    }
    return { page, size }
  }, [pagi.current, pagiConf.pageSize, curScope])

  const { dispatch } = useContext(CardsPageContext)
  const { lists: allAlbumLists, refresh: refreshAllAlbumLists } = useContext(AlbumNamesContext)
  const [lists, total, loading, refreshLists] = useLists(pagiQuery, curScope, fetchListFn)

  useEffect(() => {
    console.log('asdf', pagiConf)
  }, [pagiConf])

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
      window._mvip_media_ticktime = window._mvip_media_ticktime || 500
      if (window._mvip_media_ticktime < 5 * 1000) {
        if (window._mvip_media_tick) {
          window.clearTimeout(window._mvip_media_tick)
        }
        window._mvip_media_tick = setTimeout(() => {
          window._mvip_media_ticktime = window._mvip_media_ticktime * 2
          refresh()
        }, window._mvip_media_ticktime)
      }
    }
    return () => window._mvip_media_tick && window.clearTimeout(window._mvip_media_tick)
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
    setPagi({
      ...pagi,
      current: pageSizeChanged ? 1 : page
    })
    setPagiConf({
      ...pagiConf,
      pageSize,
      pageSizeOptions: [
        String(pageSize),
        String(pageSize * 2),
        String(pageSize * 4),
      ]
    })
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

  // 拦截路由
  useEffect(() => {
    const unBlock = history.block((location, action) => {
      const path = location.pathname
      if (
        path.includes('image-list') ||
        path.includes('video-list')
      ) {
        if (action === 'PUSH') {
          const jumpSelf = window.location.href.match(path)
          if (jumpSelf) {
            goTabScope(tabScope[0])
            return false
          }
        }
        if (action === "POP") {
          if (tabScope.length >= 2) {
            goTabScope(tabScope[0])
            return false
          }
        }
      }
    })
    return () => unBlock()
  }, [history, goTabScope, tabScope])

  /***************************************************** Renders */

  const [$createAlbumModal, createOrEditAlbum] = useCreateAlbumModal({ refresh })
  const [$editVideoNameModal, editVideo] = useEditVideoNameModal({ refresh })

  // 创建或编辑相册后重新拉取所有相册列表
  const createAlbum = useCallback(async (album?: MediaCateItem) => {
    const isDone = await createOrEditAlbum(album)
    if (isDone) {
      refreshAllAlbumLists()
    }
  }, [createOrEditAlbum])

  const [$UploadModal, openUpload] = useUploadModal({ createAlbum, refresh })
  useEffect(() => {
    if (openUploadID) {
      openUpload(openUploadID)
    }
  }, [openUploadID])

  // TODO delete - open upload automatelly - for test only
  // useEffect(() => {
  //   if (allAlbumLists && allAlbumLists.length > 0) {
  //     openUpload(allAlbumLists[0].id)
  //   }
  // }, [allAlbumLists])

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
    pageNav({ tabScope, curScope, goTabScope, createAlbum, openUpload, refresh, setSelection })
  ), [tabScope, curScope, goTabScope, createAlbum, openUpload, refresh, setSelection])

  // 自定义卡片
  const renderCardItem = cardItem && cardItem({
    curScope,
    lists,
    selection,
    refresh,
    goTabScope,
    setSelection,
    createAlbum,
    editVideo
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
          handlePagiChange={handlePagiChange}
          setSelection={setSelection}
          refresh={refresh}
          select={select}
          unselect={unselect}
          cardItem={renderCardItem}
          customPreview={customCardItemPreview}
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
      {$createAlbumModal}
      {/* 编辑视频名称模态框 */}
      {$editVideoNameModal}
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
        errorMessage('网络错误，请稍后重试')
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
