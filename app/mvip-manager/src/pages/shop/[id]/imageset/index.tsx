import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from "umi";
import { Pagination } from "antd";

import ContentHeader from "../components/content-header";
import ArticleNav from './components/nav'
import Cards from './components/cards'
import SelectionBlock from './components/selection'
import { useCreateAlbumModal } from './components/create-album-modal'
import { useUploadModal } from './components/upload-modal'
import { getImagesetImage, getImagesetAlbum } from '@/api/shop'

import usePrevious from './hooks/previous';
import { useSelection } from './hooks/selection'
import { usePagination } from './hooks/pagination'
import useAllAlbumNames from './hooks/album-names'

import { ShopModuleType } from "@/enums";
import { RouteParams, TabScope, TabScopeItem, CardItem, AlbumItem } from "@/interfaces/shop";

import styles from './index.less';

const ShopArticlePage = (props: any) => {

  /***************************************************** States */

  const params: RouteParams = useParams();
  const shopId = Number(params.id);

  const [tabScope, setTabScope] = useState<TabScope>([{ type: 'album', item: null }]);
  const [isScopeAlbum, setIsScopeAlbum] = useState(false);
  const [isScopeImage, setIsScopeImage] = useState(false);
  const [curScope, setCurScope] = useState<TabScopeItem>();
  const prevCurScope = usePrevious(curScope)

  useEffect(() => {
    setCurScope(tabScope[tabScope.length - 1])
  }, [tabScope])

  useEffect(() => {
    const lastScope = tabScope[tabScope.length - 1]
    if (lastScope) {
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
  }, [tabScope])

  const [pagi, setPagi, pagiConf, setPagiConf, resetPagi] = usePagination({
    pageSizeOptions: ['8', '16', '32']
  })
  const pagiQuery = useMemo(() => {
    let page = pagi.current
    let size = pagiConf.pageSize
    const isChangeScope = curScope && prevCurScope && (curScope.type !== prevCurScope.type)
    if (isChangeScope) {
      page = 1
      resetPagi()
    }
    return { page, size }
  }, [pagi.current, pagiConf.pageSize, curScope])
  const [allAlbumLists, allAlbumListsTotal, refreshAllAlbumLists] = useAllAlbumNames(shopId)
  // TODO fix type
  const defaultAlbumIDs = useMemo(() => allAlbumLists.filter(x => x.type === 'DEFAULT').map(x => x.id), [allAlbumLists])
  const [lists, total, loading, refreshLists] = useLists(shopId, pagiQuery, curScope)

  // 刷新列表可以就地刷新或重置分页（重置分页后会自动刷新）
  const refresh = useCallback((resetPage?: boolean) => {
    if (resetPage) {
      if (pagi.current !== 1) {
        resetPagi()
      } else {
        refreshLists()
      }
    } else {
      refreshLists()
    }
  }, [pagi.current, refreshLists, resetPagi])

  // 列表接口可能不会返回默认相册，但是 nameList 接口一定会返回默认相册，
  // 所以这里判断列表接口为空时，等待 allAlbumLists 有结果之后再重新请求
  // 请求时间指数避退
  useEffect(() => {
    // @ts-ignore
    const canRefresh = lists.length === 0 && allAlbumLists.length > 0
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
  }, [lists, allAlbumLists])

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

  return (
    <>
      {/* 页头 */}
      <ContentHeader {...props} type={ShopModuleType.IMAGESET} />
      {/* 内容 */}
      <div className={`container ${styles["container"]}`}>
        {/* 页面内导航栏 */}
        <ArticleNav
          shopId={shopId}
          tabScope={tabScope}
          isScopeAlbum={isScopeAlbum}
          isScopeImage={isScopeImage}
          curScope={curScope}
          goTabScope={goTabScope}
          createAlbum={createAlbum}
          openUpload={openUpload}
        />
        {/* 选框区 */}
        <SelectionBlock
          shopId={shopId}
          total={total}
          curScope={curScope}
          isScopeAlbum={isScopeAlbum}
          selection={selection}
          lists={lists}
          refreshAllAlbumLists={refreshAllAlbumLists}
          select={select}
          unselect={unselect}
          setSelection={setSelection}
          refresh={refresh}
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
          refreshAllAlbumLists={refreshAllAlbumLists}
          setSelection={setSelection}
          refresh={refresh}
          goTabScope={goTabScope}
          select={select}
          unselect={unselect}
          editAlbum={createAlbum}
          openUpload={openUpload}
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
  );
}

function useLists(shopId: number, query: any, scope: TabScopeItem | undefined) {
  const [lists, setLists] = useState<CardItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [requestTime, setRequestTime] = useState(+new Date())

  const notNull = (x: any) => !!x

  const refresh = () => {
    setLoading(true)
    setLists([])
    setTotal(0)
    setRequestTime(+new Date())
    console.log('refreshed')
  }

  useEffect(() => {
    console.log(scope)
    /* Gaurds */
    if (!shopId || !scope) {
      return
    }
    let fetchMethod
    if (scope.type === 'album') fetchMethod = fetchAlbumLists
    if (scope.type === 'image') fetchMethod = fetchImageLists
    if (!fetchMethod) {
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
    // FIXME type
    fetchMethod(shopId, query)
      .then(res => {
        if (res) {
          const [result, total] = res
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
  }, [shopId, query, requestTime])

  return [lists, total, loading, refresh, setLists, setTotal] as const
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

ShopArticlePage.wrappers = ['@/wrappers/path-auth']

export default ShopArticlePage
