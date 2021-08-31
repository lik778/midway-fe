import React, { useState, useContext } from 'react'
import { Checkbox, Modal } from "antd"
import { PartitionOutlined, DeleteOutlined, LoadingOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { moveMediaAssets, delMediaAssets, setMediaCatesCover } from '@/api/shop'

import CardsPageContext from '../../context/cards-page'
import AlbumNamesContext from '../../context/album-names'

import { MediaAssetsItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../../cards-page/cards-container/index'

import styles from './index.less'

export default function ImageCardWrapper(props: any) {
  const { curScope, lists, selection, setSelection, editVideo, refresh } = props
  const { directoryType, subDirectoryLabel, selectAlbum } = useContext(CardsPageContext)
  const { } = useContext(AlbumNamesContext)
  const [setCoverItem, setSetCoverItem] = useState<MediaAssetsItem | null>()

  // 编辑视频名称
  const editVideoName = async (e: any, video: MediaAssetsItem) => {
    e.stopPropagation()
    await editVideo(video)
  }

  // 设置封面图片
  const setCoverImage = async (e: any, image: MediaAssetsItem) => {
    e.stopPropagation()
    setSetCoverItem(image)
    const { id } = image
    const { item } = curScope
    setMediaCatesCover({ id, mediaCateId: item.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('设置成功')
        } else {
          throw new Error(res.message || "出错啦，请稍后重试")
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
      .finally(() => {
        setSetCoverItem(null)
      })
  }

  // 移动图片
  const moveImage = async (e: any, image: MediaAssetsItem) => {
    e.stopPropagation()
    const { id } = image
    const album = await selectAlbum({
      exclude: curScope.item ? [curScope?.item?.id] : []
    })
    const resetRefreshPagi = lists.length === 1
    moveMediaAssets({ id, mediaCateId: album.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('移动成功')
          setSelection(selection.filter((x: number) => x !== id))
          refresh(resetRefreshPagi)
        } else {
          throw new Error(res.message || "出错啦，请稍后重试")
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
  }

  // 删除图片
  const delImage = async (e: any, image: MediaAssetsItem) => {
    e.stopPropagation()
    const { id } = image
    await Modal.confirm({
      title: '确认删除',
      content: `${subDirectoryLabel}删除后无法恢复，确认删除？`,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          const query = {
            ids: [id],
            mediaCateId: curScope!.item!.id,
            source: directoryType
          }
          delMediaAssets(query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功')
                setSelection(selection.filter((x: number) => x !== id))
                refresh(lists.length === 1)
                resolve(res.success)
              } else {
                throw new Error(res.message || "出错啦，请稍后重试")
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

  return (props: CustomCardItemProps) => {
    const card = props.card
    return (
      <ImageCard
        {...props}
        setCoverItem={setCoverItem}
        setCoverImage={setCoverImage}
        editVideoName={editVideoName}
        moveImage={moveImage}
        delImage={delImage}
        key={card.id}
      />
    )
  }
}

type ImageCardProps = CustomCardItemProps & {
  setCoverItem: MediaAssetsItem | null | undefined
  editVideoName: (e: any, image: MediaAssetsItem) => any
  setCoverImage: (e: any, image: MediaAssetsItem) => void
  moveImage: (arg: any, image: MediaAssetsItem) => void
  delImage: (arg: any, image: MediaAssetsItem) => void
}

function ImageCard(props: ImageCardProps) {
  const {
    selection, setCoverItem, loading,
    handleSelectCard, preview,
    setCoverImage, moveImage, delImage, editVideoName
  } = props
  const card = props.card as MediaAssetsItem
  const { directoryType } = useContext(CardsPageContext)
  const isImage = directoryType === 'IMAGE'

  const { id, imgUrl, title, decodeStatus } = card
  const isChecked = selection.find((y: number) => y === id)
  const inSetCoverLoading = setCoverItem && setCoverItem.id === id
  const inEncoding = decodeStatus === 'DECODING'
  const isSuccess = decodeStatus === 'SUCCESS'
  const isError = !isSuccess && !inEncoding
  // 应该是数据流动的问题，导致如果不检测 decodeStatus 就会显示 ErrorMask
  const showVideoMask = directoryType === 'VIDEO' && card.hasOwnProperty('decodeStatus') && !loading

  const stopEvent = (e: any) => e.stopPropagation()

  return (
    <div
      className={isImage ? styles["image-card"] : styles["video-card"]}
      key={`image-card-${id}`}
      onClick={() => preview(card)}
    >
      {showVideoMask && inEncoding && (
        <div className={styles["mask"] + ' ' + styles['full']}>
          <LoadingOutlined />
          <span>正在转码中，请稍等</span>
          <span className={styles["reason"]}>转码完成后第一时间通知您</span>
        </div>
      )}
      {showVideoMask && isError && (
        <div className={styles["mask"] + ' ' + styles['full']}>
          <ErrorIcon />
          <span>转码失败</span>
          <span className={styles["reason"]}>转码失败，请删除重试</span>
        </div>
      )}
      <div className={styles["selection"] + ' ' + (isChecked ? '' : styles['auto-hide'])} onClick={() => preview(card)}>
        <div className={styles["action-wrapper"]}>
          <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} onClick={e => stopEvent(e)} />
          <div className={styles["anticon-down-con"]}>
            <div className={styles["anticon-down"]}>
              <DownOutlined />
            </div>
            <div className={styles["down-actions"]} onClick={e => moveImage(e, card)}>
              {!isError && directoryType === 'VIDEO' && (
                <div className={styles["anticon-down-item"]} onClick={e => editVideoName(e, card)}>
                  <EditOutlined />
                  <span>编辑</span>
                </div>
              )}
              {!isError && (
                <div className={styles["anticon-down-item"]}>
                  <PartitionOutlined />
                  <span>移动</span>
                </div>
              )}
              <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card)}>
                <DeleteOutlined />
                <span>删除</span>
              </div>
              {(directoryType === 'IMAGE') && (
                <div className={styles["anticon-down-item"]} onClick={e => setCoverImage(e, card)}>
                  {inSetCoverLoading ? <LoadingOutlined /> : <EditOutlined />}
                  <span>设为封面</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {(!loading && imgUrl) && (
        <div className={styles["cover-con"]}>
          <img className={styles["cover"]} src={imgUrl} alt="cover" />
        </div>
      )}
      {(!loading && imgUrl && directoryType === 'VIDEO') && (
        <div className={styles["header"]}>
          <span className={styles["name"]} title={title}>{title || '未命名视频'}</span>
        </div>
      )}
    </div>
  )
}

function ErrorIcon() {
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
