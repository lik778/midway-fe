import React, { useState, useCallback, useMemo } from 'react'
import { Modal, Result } from "antd"

import EmptyListIcon from '@/icons/empty-list'
import { successMessage, errorMessage } from "@/components/message"
import { getMediaFailedAssets, delMediaFailedAssets } from '@/api/shop'
import NavBar from './page-nav/index'
import ErrorCardWrapper from './error-card/index'
import CardsPage from '../cards-page/index'

import { MediaCateSource, CardItem, MediaAssetsItem } from "@/interfaces/shop"
import { DeleteBatchProps } from '../cards-page/index'

// 资源管理 - 申诉列表
const AssetsMangeAuditListPage = () => {

  const [sourceType, setSourceType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')

  // 批量删除
  const deleteBatch = useCallback((props: DeleteBatchProps) => {
    const { curScope, selection, refresh, setSelection } = props

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
        : `本次预计删除 ${count} 张图片，删除后无法恢复，确认删除？`
      Modal.confirm({
        title: '确认删除',
        content: info,
        width: 532,
        onCancel() { },
        onOk() {
          return new Promise((resolve, reject) => {
            const query = {
              ids: [...selection], mediaCateId: curScope?.item?.id,
              source: 'IMAGE'
            }
            delMediaFailedAssets(query as any)
              .then((res: any) => {
                if (res.success) {
                  successMessage('删除成功');
                  setSelection([])
                  refresh(resetFreshPage)
                  // TODO FIXME ??
                  // refreshAllAlbumLists()
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
  }, [])

  // 全选时排除正在审核中的项目
  const selectAllFrom = useCallback((lists: CardItem[]) => (
    lists.filter(x => (x as MediaAssetsItem).checkStatus !== 'REAPPLY')
  ), [])

  // 页头
  const pageNav = useCallback((props: any & {
    setSelection: (selection: number[]) => void
    refresh: (resetPagi: boolean) => void
  }) => {
    const { setSelection, refresh } = props
    return (
      <NavBar
        refresh={refresh}
        sourceType={sourceType}
        setSelection={setSelection}
        setSourceType={setSourceType}
      />
    )
  }, [sourceType])

  // 空列表提示
  const emptyTip = useCallback(() => (
    <Result
      icon={<EmptyListIcon />}
      title="当前没有申诉中的图片哦~"
      style={{ margin: 'auto' }}
    />
  ), [])

  const fetchListFn = useMemo(() => {
    return fetchErrorImageLists(sourceType)
  }, [sourceType])

  return (
    <CardsPage
      defaultScope={{ item: null, type: 'audit', label: '资源', countLabel: '项' }}
      pageNav={pageNav}
      fetchListFn={fetchListFn}
      deleteBatch={deleteBatch}
      cardItem={ErrorCardWrapper}
      selectAllFrom={selectAllFrom}
      emptyTip={emptyTip}
    />
  )
}

function fetchErrorImageLists(sourceType: MediaCateSource) {
  return async (querys: any) => {
    try {
      querys.source = sourceType
      const res = await getMediaFailedAssets(querys)
      const { result = [], totalRecord = 0 } = res.data.mediaImgBos
      return [result, totalRecord] as const
    } catch (err) {
      throw new Error(err)
    }
  }
}

// AssetsMangeAuditListPage.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeAuditListPage
