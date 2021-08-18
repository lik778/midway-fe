import React, { useState } from 'react'
import { Checkbox } from "antd"
import { PartitionOutlined, DeleteOutlined, LoadingOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { setImagesetAlbumCover } from '@/api/shop'

import { ImageItem } from "@/interfaces/shop"
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
  setCoverImage: (e: any, image: ImageItem) => void
  setCoverItem: ImageItem | null | undefined
}

function ImageCard(props: ImageCardProps) {
  const {
    card, selection, setCoverItem, loading,
    handleSelectCard, previewImage, moveImage, delImage,
    setCoverImage,
  } = props

  const { id, imgUrl } = card
  const isChecked = selection.find((y: number) => y === id)
  const inSetCoverLoading = setCoverItem && setCoverItem.id === id

  const stopEvent = (e: any) => e.stopPropagation()

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
