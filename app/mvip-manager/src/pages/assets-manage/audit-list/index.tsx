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
  const sourceLabel = useMemo(() => {
    if (sourceType === 'IMAGE') {
      return '图片'
    }
    if (sourceType === 'VIDEO') {
      return '视频'
    }
  }, [sourceType])

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
        : `本次预计删除 ${count} 张${sourceLabel}，删除后无法恢复，确认删除？`
      Modal.confirm({
        title: '确认删除',
        content: info,
        width: 532,
        onCancel() { },
        onOk() {
          return new Promise((resolve, reject) => {
            const query = {
              ids: [...selection], mediaCateId: curScope?.item?.id,
              source: sourceType
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
  }, [sourceType, sourceLabel])

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
      title={`当前没有申诉中的${sourceLabel}哦~`}
      style={{ margin: 'auto' }}
    />
  ), [sourceLabel])

  // 视频预览
  const customCardItemPreview = useMemo(() => {
    if (sourceType === 'VIDEO') {
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
  }, [sourceType])

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
      customCardItemPreview={customCardItemPreview}
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
