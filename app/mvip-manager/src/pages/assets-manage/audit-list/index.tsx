import React, { useState, useMemo, useCallback } from 'react'
import { Modal, Result } from "antd"

import { successMessage, errorMessage } from "@/components/message"
import { getMediaFailedImage, delMediaFailedImage } from '@/api/shop'
import NavBar from './page-nav/index'
import ErrorCardWrapper from './error-card/index'
import CardsPage from '../cards-page/index'

import { CardItem, ImageItem } from "@/interfaces/shop"
import { PageNavProps, DeleteBatchProps } from '../cards-page/index'

// 资源管理 - 申诉列表
const AssetsMangeAuditListPage = () => {

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
        : `本次预计删除 ${count} 张图片，删除后无法恢复，确认删除？`
      Modal.confirm({
        title: '确认删除',
        content: info,
        width: 532,
        onCancel() { },
        onOk() {
          return new Promise((resolve, reject) => {
            const query = { ids: [...selection], mediaCateId: curScope?.item?.id }
            delMediaFailedImage(query as any)
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
  }, [])

  // 全选时排除正在审核中的项目
  const selectAllFrom = useCallback((lists: CardItem[]) => (
    lists.filter(x => (x as ImageItem).checkStatus !== 'REAPPLY')
  ), [])

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
  const emptyTip = useCallback(() => (
    <Result
      title="当前没有申诉中的图片哦~"
      style={{ margin: 'auto' }}
    />
  ), [])

  return (
    <CardsPage
      defaultScope={{ item: null, type: 'audit', label: '资源', countLabel: '项' }}
      pageNav={pageNav}
      fetchListFn={fetchErrorImageLists}
      deleteBatch={deleteBatch}
      cardItem={ErrorCardWrapper}
      selectAllFrom={selectAllFrom}
      emptyTip={emptyTip}
    />
  )
}

async function fetchErrorImageLists(querys: any) {
  try {
    const res = await getMediaFailedImage(querys)
    const { result = [], totalRecord = 0 } = res.data.mediaImgBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

// AssetsMangeAuditListPage.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeAuditListPage
