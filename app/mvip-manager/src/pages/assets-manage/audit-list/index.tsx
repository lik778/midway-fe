import React, { useState, useMemo, useCallback } from 'react'
import { Checkbox, Result } from "antd"
import { DeleteOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import CardListPage from '../card-list-page'
import { getImagesetFailedImage, delImagesetFailedImage, reAuditImagesetImage } from '@/api/shop'

import { CardItem, ImageItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../card-list-page/components/cards'

import styles from '../card-list-page/components/cards/index.less'

// 资源管理申诉列表页
const AssetsMangeAuditListPage = () => {

  /***************************************************** Renders */

  const emptyTip = useMemo(() => (
    <Result
      title="当前没有申诉中的图片哦~"
      style={{ margin: 'auto' }}
    />
  ), [])

  return (
    <CardListPage
      customScope={{ type: 'audit', item: null }}
      fetchListFn={fetchErrorImageLists}
      selectionDeleteFn={delImagesetFailedImage}
      cardItem={ErrorCardItemWithAuditItemLoading}
      emptyTip={emptyTip}
    />
  )
}

async function fetchErrorImageLists(shopId: number, querys: any) {
  try {
    const res = await getImagesetFailedImage(shopId, querys)
    const { result = [], totalRecord = 0 } = res.data.mediaImgBos
    return [result, totalRecord] as const
  } catch (err) {
    throw new Error(err)
  }
}

// cardItem 高阶组件，额外扩展了调用申诉接口的 loading 状态
function ErrorCardItemWithAuditItemLoading(props: any) {
  const { refresh } = props
  const [auditLoadingItem, setAuditLoadingItem] = useState<ImageItem | null>()

  // FIXME 暂时写死，用来调试
  const shopId = 3863

  /***************************************************** API Calls */

  // 申诉图片
  const reAuditImage = async (e: any, image: ImageItem) => {
    setAuditLoadingItem(image)
    e.stopPropagation()
    reAuditImagesetImage(shopId, { id: image.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('申诉成功')
          refresh()
        } else {
          throw new Error(res.message || '出错啦，请稍后重试')
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
      .finally(() => {
        setAuditLoadingItem(null)
      })
  }

  const cardItem = useCallback((props: CustomCardItemProps) => (
    ErrorCardItem({
      ...props,
      auditLoadingItem,
      reAuditImage
    })
  ), [auditLoadingItem])

  return cardItem
}

// 自定义申诉列表的卡片
function ErrorCardItem(props: CustomCardItemProps & {
  auditLoadingItem: ImageItem | null | undefined
  reAuditImage: (e: any, image: ImageItem) => any
}) {
  const {
    card, selection, loading, auditLoadingItem,
    previewImage, handleSelectCard, moveImage, delImage, reAuditImage
  } = props

  const { id, imgUrl, checkStatus, reason } = card as ImageItem
  const shortReasonMatch = (reason || '').match(/\[(.+)\]/)
  const shortReason = shortReasonMatch ? shortReasonMatch[1] : '审核驳回'
  const isChecked = selection.find((y: number) => y === id)
  const inAudit = checkStatus === 'REAPPLY'
  const inAuditLoading = auditLoadingItem && auditLoadingItem.id === id
  const rejected = ['REJECT_BYMACHINE', 'REJECT_BYHUMAN'].includes(checkStatus)
  const showCoverInfo = inAudit || rejected
  const showReapplyBtn = rejected && checkStatus !== 'REJECT_BYHUMAN'

  const stopEvent = (e: any) => e.stopPropagation()

  return (
    <div className={styles["error-image-card"]} key={`error-image-card-${id}`} onClick={() => previewImage(card as ImageItem)}>
      {showCoverInfo && (
        <div className={styles["mask"] + ' ' + (rejected ? styles['full'] : '')}>
          {rejected && <AuditFailedIcon />}
          {inAudit ? '申诉中' : rejected ? '申诉不通过' : ''}
          {rejected && <span className={styles["reason"]}>违规原因：{shortReason}</span>}
        </div>
      )}
      {!inAudit && (
        <div className={styles["selection"] + ' ' + (isChecked ? '' : styles['auto-hide'])} onClick={() => previewImage(card as ImageItem)}>
          <div className={styles["action-wrapper"]}>
            <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} onClick={e => stopEvent(e)} />
            <div className={styles["anticon-down-con"]}>
              <div className={styles["anticon-down"]}>
                <DownOutlined />
              </div>
              <div className={styles["down-actions"]} onClick={e => moveImage(e, card as ImageItem)}>
                {showReapplyBtn && (
                  <div className={styles["anticon-down-item"]} onClick={e => reAuditImage(e, card as ImageItem)}>
                    {inAuditLoading ? <LoadingOutlined /> : <ReApplyIcon />}
                    <span>申诉</span>
                  </div>
                )}
                <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card as ImageItem)}>
                  <DeleteOutlined />
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {(!loading && imgUrl) && (
        <img className={styles["cover"]} src={imgUrl} alt="cover" />
      )}
    </div>
  )
}

/**
 * 一些 SVG 图标
 */

function ReApplyIcon() {
  return (
    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path d="M0 0h14v14H0z" />
        <path
          d="M5.782 5.17c.269 0 .487.225.487.502a.494.494 0 01-.487.502H3.447a.493.493 0 01-.485-.5c0-.089.023-.176.066-.252a.493.493 0 01.426-.251H5.79h-.008zM2.966 3.59a.495.495 0 01.48-.495h3.502a.49.49 0 01.48.495v.014a.49.49 0 01-.48.494H3.445a.494.494 0 01-.479-.494v-.014zM2.33 0h8.354c.714-.01 1.304.574 1.323 1.31h.01v.431a.504.504 0 01-.242.432.458.458 0 01-.48 0 .503.503 0 01-.243-.432V1.34a.364.364 0 00-.365-.341H2.324a.364.364 0 00-.365.34v11.324a.364.364 0 00.365.341h8.36c.19.004.35-.146.365-.34v-.433a.503.503 0 01.236-.453.464.464 0 01.5 0 .51.51 0 01.236.453v.432c-.01.749-.605 1.347-1.331 1.338H2.33c-.723.004-1.316-.592-1.33-1.338V1.34C1.014.592 1.607-.005 2.331 0v.001zm3.555 8.8l.79.83.809.842 4.318-4.422L10.2 4.383 5.885 8.807V8.8zm2.276 2.383a.51.51 0 01-.032.704.473.473 0 01-.65 0L4.525 8.81a.512.512 0 010-.696A.469.469 0 015.2 8.1L9.526 3.67a.51.51 0 01.04-.703.472.472 0 01.642 0l1.487 1.546 1.48 1.533c.193.187.204.5.023.7a.47.47 0 01-.706-.003L10.67 8.608l3.168 3.345c.134.124.19.314.148.494a.482.482 0 01-.359.362.482.482 0 01-.48-.152L9.972 9.334l-1.81 1.852-.001-.002z"
          fill="#333" fillRule="nonzero" />
      </g>
    </svg>
  )
}

function AuditFailedIcon() {
  return (
    <svg className={styles['anticon']} xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 22 22" version="1.1">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-317.000000, -486.000000)">
          <g transform="translate(317.000000, 486.000000)">
            <circle fill="#F1492C" cx="11" cy="11" r="11" />
            <path d="M10.8217593,5.72916667 C11.2084864,5.72916667 11.5219907,6.04267098 11.5219907,6.42939815 L11.5211667,10.1211667 L15.2141204,10.1215278 C15.6008475,10.1215278 15.9143519,10.4350321 15.9143519,10.8217593 C15.9143519,11.2084864 15.6008475,11.5219907 15.2141204,11.5219907 L11.5211667,11.5211667 L11.5219907,15.2141204 C11.5219907,15.6008475 11.2084864,15.9143519 10.8217593,15.9143519 C10.4350321,15.9143519 10.1215278,15.6008475 10.1215278,15.2141204 L10.1211667,11.5211667 L6.42939815,11.5219907 C6.04267098,11.5219907 5.72916667,11.2084864 5.72916667,10.8217593 C5.72916667,10.4350321 6.04267098,10.1215278 6.42939815,10.1215278 L10.1211667,10.1211667 L10.1215278,6.42939815 C10.1215278,6.04267098 10.4350321,5.72916667 10.8217593,5.72916667 Z" id="形状结合" fill="#FFFFFF" transform="translate(10.821759, 10.821759) rotate(-45.000000) translate(-10.821759, -10.821759) " />
          </g>
        </g>
      </g>
    </svg>
  )
}

// AssetsMangeAuditListPage.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeAuditListPage
