import React, { useState, useContext } from 'react'
import { Checkbox, Modal } from "antd"
import { PartitionOutlined, DeleteOutlined, LoadingOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { moveImagesetImage, delImagesetImage, setImagesetAlbumCover } from '@/api/shop'

import CardsPageContext from '../../context/cards-page'
import AlbumNamesContext from '../../context/album-names'

import { ImageItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../../cards-page/cards-container/index'

import styles from './index.less'

export default function ImageCardWrapper(props: any) {
  const { curScope, lists, selection, setSelection, editVideo, refresh, selectAlbum } = props
  const { directoryType } = useContext(CardsPageContext)
  const { } = useContext(AlbumNamesContext)
  const [setCoverItem, setSetCoverItem] = useState<ImageItem | null>()

  // 编辑视频名称
  const editVideoName = async (e: any, image: ImageItem) => {
    e.stopPropagation()
    await editVideo(image)
  }

  // 设置封面图片
  const setCoverImage = async (e: any, image: ImageItem) => {
    if (directoryType !== 'image') {
      return
    }
    e.stopPropagation()
    setSetCoverItem(image)
    const { id } = image
    const { item } = curScope
    setImagesetAlbumCover({ id, mediaCateId: item.id })
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
  const moveImage = async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    const album = await selectAlbum({
      exclude: curScope.item ? [curScope?.item?.id] : []
    })
    const resetRefreshPagi = lists.length === 1
    moveImagesetImage({ id, mediaCateId: album.id })
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
          delImagesetImage({ ids: [id], mediaCateId: curScope!.item!.id })
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

  return (props: CustomCardItemProps) => (
    ImageCard({
      ...props,
      setCoverImage,
      setCoverItem,
      editVideoName,
      moveImage,
      delImage,
    } as ImageCardProps)
  )
}

type ImageCardProps = CustomCardItemProps & {
  card: ImageItem
  setCoverItem: ImageItem | null | undefined
  editVideoName: (e: any, image: ImageItem) => any
  setCoverImage: (e: any, image: ImageItem) => void
  moveImage: (arg: any, image: ImageItem) => void
  delImage: (arg: any, image: ImageItem) => void
}

function ImageCard(props: ImageCardProps) {
  const {
    card, selection, setCoverItem, loading,
    handleSelectCard, preview,
    setCoverImage, moveImage, delImage, editVideoName
  } = props
  const { directoryType } = useContext(CardsPageContext)

  const { id, imgUrl } = card
  const isChecked = selection.find((y: number) => y === id)
  const inSetCoverLoading = setCoverItem && setCoverItem.id === id

  const stopEvent = (e: any) => e.stopPropagation()

  return (
    <div
      className={styles["image-card"] + ' ' + (directoryType === 'video' ? styles['video-card'] : '')}
      key={`image-card-${id}`}
      onClick={() => preview(card)}
    >
      <div className={styles["selection"] + ' ' + (isChecked ? '' : styles['auto-hide'])} onClick={() => preview(card)}>
        <div className={styles["action-wrapper"]}>
          <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} onClick={e => stopEvent(e)} />
          <div className={styles["anticon-down-con"]}>
            <div className={styles["anticon-down"]}>
              <DownOutlined />
            </div>
            <div className={styles["down-actions"]} onClick={e => moveImage(e, card)}>
              {directoryType === 'video' && (
                <div className={styles["anticon-down-item"]} onClick={e => editVideoName(e, card)}>
                  <EditOutlined />
                  <span>编辑</span>
                </div>
              )}
              <div className={styles["anticon-down-item"]}>
                <PartitionOutlined />
                <span>移动</span>
              </div>
              <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card)}>
                <DeleteOutlined />
                <span>删除</span>
              </div>
              {directoryType === 'image' && (
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
      {directoryType === 'video' && (
        <div className={styles["header"]}>
          <span className={styles["name"]} title={'视频名称，非常长视频名称，非常长视频名称，非常长视频名称，非常长视频名称，非常长视频名称，非常长'}>{'视频名称，非常长视频名称，非常长视频名称，非常长视频名称，非常长视频名称，非常长视频名称，非常长'}</span>
        </div>
      )}
    </div>
  )
}
