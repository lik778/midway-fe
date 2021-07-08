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
import { useAllAlbumLists } from './hooks/albums'

import { ShopModuleType } from "@/enums";
import { RouteParams, TabScope, TabScopeItem, CardItem } from "@/interfaces/shop";

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
  const pagiQuery = useMemo(() => ({ page: pagi.current, size: pagiConf.pageSize }), [pagi.current, pagiConf.pageSize])
  const [allAlbumLists] = useAllAlbumLists(shopId)
  const [lists, total, loading, refresh] = useLists(shopId, pagiQuery, isScopeAlbum, isScopeImage, curScope)
  const [selection, setSelection, select, unselect] = useSelection()

  // 层级变换时重置翻页和选取
  useEffect(() => {
    if (curScope) {
      setSelection([])
      resetPagi()
      // FIXME 请求两次问题
      refresh()
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

  // const goAlbumPage = () => setTabScope('album')
  // const goImagePage = () => setTabScope('image')

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

  // PERF ?
  const [$CreateAlbumModal, createAlbum] = useCreateAlbumModal({ shopId, refresh })
  const [$UploadModal, openUpload] = useUploadModal({ shopId, refresh, allAlbumLists })
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
          goTabScope={goTabScope}
          curScope={curScope}
          createAlbum={createAlbum}
          openUpload={openUpload}
        />
        {/* 选框区 */}
        <SelectionBlock
          shopId={shopId}
          total={pagiConf.total}
          isScopeAlbum={isScopeAlbum}
          selection={selection}
          select={select}
          unselect={unselect}
          setSelection={setSelection}
          lists={lists}
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
      {/* 创建/编辑相册模态框 */}
      {$CreateAlbumModal}
      {/* 图片上传模态框 */}
      {$UploadModal}
    </>
  );
}

function useLists(shopId: number, query: any, isScopeAlbum: boolean, isScopeImage: boolean, scope: TabScopeItem | undefined) {
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
  }

  useEffect(() => {
    /* Gaurds */
    if (!shopId || !scope) {
      return
    }
    let fetchMethod
    if (isScopeAlbum) fetchMethod = fetchAlbumLists
    if (isScopeImage) fetchMethod = fetchImageLists
    if (!fetchMethod) {
      return
    }
    /* Query & Fetch */
    if (isScopeImage) {
      query.mediaCateId = scope.item!.id
    }
    setLoading(true)
    fetchMethod(shopId, query)
      .then(([result, total]) => {
        setLists(result.filter(notNull))
        setTotal(total)
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [shopId, query, requestTime, isScopeAlbum, isScopeImage, scope])

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
