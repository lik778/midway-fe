import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from "umi";
import { Pagination } from "antd";

import ContentHeader from "../components/content-header";
import ArticleNav from './components/nav'
import Cards from './components/cards'
import SelectionBlock from './components/selection'
import { useCreateAlbumModal } from './components/create-album-modal'
import { useUploadModal } from './components/upload-modal'

import { useSelection } from './hooks/selection'
import { usePagination } from './hooks/pagination'

import { ShopModuleType } from "@/enums";
import { RouteParams } from "@/interfaces/shop";
import { TabScope, TabScopeItem, CardItem } from './types'

import styles from './index.less';

const ShopArticlePage = (props: any) => {

  /***************************************************** States */

  const params: RouteParams = useParams();
  const shopId = Number(params.id);

  const [tabScope, setTabScope] = useState<TabScope>([{ type: 'album', item: null }]);
  const [isScopeAlbum, setIsScopeAlbum] = useState(false);
  const [isScopeImage, setIsScopeImage] = useState(false);
  const [curScope, setCurScope] = useState<TabScopeItem>();

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

  const [lists, setLists] = useState<CardItem[]>([]);
  const [pagi, setPagi, pagiConf, setPagiConf, resetPagi] = usePagination({
    pageSizeOptions: ['8', '16', '32']
  })

  // 层级变换时重置翻页
  useEffect(() => curScope && resetPagi(), [curScope])

  const [selection, setSelection, select, unselect] = useSelection()

  // 层级变换时重置选取
  useEffect(() => curScope && setSelection([]), [curScope])

  /***************************************************** Interaction Fns */

  // 根据分页以及文件层级获取列表
  const refresh = useCallback(() => {
    if (!curScope) {
      return
    }
    const { current } = pagi
    let res = Array(pagiConf.pageSize).fill('').map((x, i) => {
      const idx = ((current - 1) * pagiConf.pageSize) + i
      return {
        type: 'album',
        id: idx + 1,
        name: '默认相册' + idx,
        count: ~~(Math.random() * 29),
        url: `http://img4.baixing.net/63becd57373449038fcbc3b599aecc8c.jpg_sv1?x=${idx}`
      }
    })
    setLists(res)
    setPagiConf({ ...pagiConf, total: 80 })
  }, [pagi])

  // 切换翻页自动刷新列表
  const handlePagiChange = (page: number, pageSize?: number | undefined) => {
    pageSize = pageSize || pagiConf.pageSize
    const pageSizeChanged = pageSize !== pagiConf.pageSize
    setPagi({ ...pagi, current: pageSizeChanged ? 1 : page })
    setPagiConf({ ...pagiConf, pageSize })
  }
  useEffect(() => refresh(), [pagi])

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
  const [$UploadModal, openUpload] = useUploadModal({ shopId, refresh })
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
          createAlbum={createAlbum}
          openUpload={openUpload}
        />
        {/* 选框区 */}
        <SelectionBlock
          shopId={shopId}
          total={pagiConf.total}
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
          isScopeAlbum={isScopeAlbum}
          isScopeImage={isScopeImage}
          goTabScope={goTabScope}
          selection={selection}
          select={select}
          unselect={unselect}
          refresh={refresh}
          editAlbum={createAlbum}
        />
        {/* 分页 */}
        <Pagination
          className={styles["pagination"]}
          defaultCurrent={1}
          current={pagi.current}
          total={pagiConf.total}
          pageSize={pagiConf.pageSize}
          pageSizeOptions={pagiConf.pageSizeOptions}
          onChange={handlePagiChange}
        />
      </div>
      {/* 创建/编辑相册模态框 */}
      {$CreateAlbumModal}
      {/* 图片上传模态框 */}
      {$UploadModal}
    </>
  );
}

ShopArticlePage.wrappers = ['@/wrappers/path-auth']

export default ShopArticlePage
