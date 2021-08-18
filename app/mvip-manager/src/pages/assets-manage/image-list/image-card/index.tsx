import React, { useState } from 'react'
import { Checkbox, Modal } from "antd"
import { PartitionOutlined, DeleteOutlined, LoadingOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { moveImagesetImage, delImagesetImage, setImagesetAlbumCover } from '@/api/shop'

import { ImageItem, AlbumItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../../cards-page/cards-container/index'

import styles from './index.less'

export default function ImageCardWrapper(props: any) {
  const { curScope } = props

  const [setCoverItem, setSetCoverItem] = useState<ImageItem | null>()

  // FIXME 暂时写死，用来调试
  const shopId = 3863

  // 设置封面图片
  const setCoverImage = async (e: any, image: ImageItem) => {
    e.stopPropagation()
    setSetCoverItem(image)
    const { id } = image
    const { item } = curScope
    setImagesetAlbumCover(shopId, { id, mediaCateId: item.id })
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

  return (props: CustomCardItemProps) => (
    ImageCard({
      ...props,
      setCoverImage,
      setCoverItem
    } as ImageCardProps)
  )
}

type ImageCardProps = CustomCardItemProps & {
  card: ImageItem
  setCoverItem: ImageItem | null | undefined
  setCoverImage: (e: any, image: ImageItem) => void
  selectAlbum: (arg: any) => AlbumItem
}

function ImageCard(props: ImageCardProps) {
  const {
    lists, curScope, card, selection, setCoverItem, loading,
    handleSelectCard, previewImage, setSelection, refresh,
    setCoverImage, selectAlbum,
  } = props

  const { id, imgUrl } = card
  const isChecked = selection.find((y: number) => y === id)
  const inSetCoverLoading = setCoverItem && setCoverItem.id === id

  const stopEvent = (e: any) => e.stopPropagation()

  // 移动图片
  const moveImage = async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    const album = await selectAlbum({
      exclude: curScope.item ? [curScope?.item?.id] : []
    })
    const resetRefreshPagi = lists.length === 1
    moveImagesetImage(3863, { id, mediaCateId: album.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('移动成功')
          setSelection(selection.filter(x => x !== id))
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
  const delImage = async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    await Modal.confirm({
      title: '确认删除',
      content: `图片删除后无法恢复，确认删除？`,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          delImagesetImage(3863, { ids: [id], mediaCateId: curScope!.item!.id })
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功')
                setSelection(selection.filter(x => x !== id))
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

  return (
    <div className={styles["image-card"]} key={`image-card-${id}`} onClick={() => previewImage(card)}>
      <div className={styles["selection"] + ' ' + (isChecked ? '' : styles['auto-hide'])} onClick={() => previewImage(card)}>
        <div className={styles["action-wrapper"]}>
          <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} onClick={e => stopEvent(e)} />
          <div className={styles["anticon-down-con"]}>
            <div className={styles["anticon-down"]}>
              <DownOutlined />
            </div>
            <div className={styles["down-actions"]} onClick={e => moveImage(e, card)}>
              <div className={styles["anticon-down-item"]}>
                <PartitionOutlined />
                <span>移动</span>
              </div>
              <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card)}>
                <DeleteOutlined />
                <span>删除</span>
              </div>
              <div className={styles["anticon-down-item"]} onClick={e => setCoverImage(e, card)}>
                {inSetCoverLoading ? <LoadingOutlined /> : <EditOutlined />}
                <span>设为封面</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(!loading && imgUrl) && (
        <img className={styles["cover"]} src={imgUrl} alt="cover" />
      )}
    </div>
  )
}
