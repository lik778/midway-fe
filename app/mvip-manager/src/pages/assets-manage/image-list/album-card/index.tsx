import React, { useState, useMemo, useCallback } from 'react'
import { Checkbox, Modal } from "antd"
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { delImagesetAlbum } from '@/api/shop'

import { AlbumItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../../card-list-page/components/cards/index'

import styles from './index.less'

import DEFAULT_ALBUM_COVER from './default-album-cover.png'

export default function AlbumCardWrapper(props: any) {
  const { goTabScope, createAlbum, refreshAllAlbumLists } = props

  // 查看相册详情
  const goAlbumScope = (album: AlbumItem) => goTabScope({ type: 'image', item: album })

  // 编辑相册名称
  const handleEditAlbum = async (e: any, album: AlbumItem) => {
    e.stopPropagation()
    createAlbum(album)
  }

  return (props: CustomCardItemProps) => (
    AlbumCard({
      ...props,
      goAlbumScope,
      handleEditAlbum,
      refreshAllAlbumLists
    })
  )
}

function AlbumCard(props: CustomCardItemProps & {
  goAlbumScope: (album: AlbumItem) => any
  handleEditAlbum: (e: any, album: AlbumItem) => any
  refreshAllAlbumLists: () => any
}) {
  const {
    card, lists, selection,
    refresh, setSelection, handleSelectCard, goAlbumScope, handleEditAlbum,
    refreshAllAlbumLists
  } = props

  const { id, name, coverUrl, totalImg, type } = card as AlbumItem;
  const isDefaultAlbum = type === 'DEFAULT'
  const isChecked = selection.find((y: number) => y === id);

  const stopEvent = (e: any) => e.stopPropagation()

  // FIXME 暂时写死，用来调试
  const shopId = 3863

  // 删除确认 Modal
  const delCallback = async (api: any, query: any, info: string, callback?: () => void) => {
    Modal.confirm({
      title: '确认删除',
      content: info,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          api(shopId, query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功');
                callback && callback()
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

  // 删除相册
  const delAlbum = async (e: any, album: AlbumItem) => {
    e.stopPropagation()
    const { id, totalImg } = album
    const info = totalImg === 0
      ? `相册删除后无法恢复，确认删除？`
      : `本次预计删除 ${totalImg} 张图片，删除后无法恢复，确认删除？`
    await delCallback(delImagesetAlbum, [id], info, () => {
      setSelection(selection.filter(x => x !== id))
      refreshAllAlbumLists()
      // TODO 在选区删除时也这么判断一下，现在那边是 refresh(true)
      refresh(lists.length === 1)
    })
  }

  return (
    <div className={styles["album-card"]} key={`album-card-${id}`} onClick={() => goAlbumScope(card as AlbumItem)}>
      {!isDefaultAlbum && (
        <div className={styles["selection"] + ' ' + (isChecked ? '' : styles['auto-hide'])} onClick={() => goAlbumScope(card as AlbumItem)}>
          <div className={styles["action-wrapper"]}>
            <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} onClick={e => stopEvent(e)} />
            <div className={styles["anticon-down-con"]}>
              <div className={styles["anticon-down"]}>
                <DownOutlined />
              </div>
              <div className={styles["down-actions"]}>
                <div className={styles["anticon-down-item"]} onClick={e => handleEditAlbum(e, card as AlbumItem)}>
                  <EditOutlined />
                  <span>编辑</span>
                </div>
                <div className={styles["anticon-down-item"]} onClick={e => delAlbum(e, card as AlbumItem)}>
                  <DeleteOutlined />
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <img className={styles["cover"]} src={coverUrl || DEFAULT_ALBUM_COVER} alt="cover" />
      <div className={styles["header"]}>
        <span className={styles["name"]} title={name}>{name}</span>
        <span>
          <span>{totalImg}</span> 张
        </span>
      </div>
    </div>
  )
}
