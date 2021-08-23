import React, { useState, useContext } from 'react'
import { Checkbox, Modal } from "antd"
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { delMediaCategory } from '@/api/shop'

import CardsPageContext from '../../context/cards-page'
import AlbumNamesContext from '../../context/album-names'

import { MediaCateItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../../cards-page/cards-container/index'

import styles from './index.less'

import DEFAULT_ALBUM_COVER from './default-album-cover.png'

const createNewImageScope = (album: MediaCateItem) => ({ item: album, type: 'image', label: '图片', countLabel: '张' })
const createNewVideoScope = (album: MediaCateItem) => ({ item: album, type: 'image', label: '视频', countLabel: '个' })

export default function AlbumCardWrapper(props: any) {
  const { lists, selection, setSelection, goTabScope, createAlbum, refresh } = props
  const {
    directoryType,
    directoryLabel,
    subDirectoryLabel,
    subDirectoryCountLabel
  } = useContext(CardsPageContext)
  const { refresh: refreshAllAlbumLists } = useContext(AlbumNamesContext)
  const [_, __] = useState('for padding')

  // 查看相册详情
  const intoScope = (album: MediaCateItem) => directoryType === 'IMAGE'
    ? goTabScope(createNewImageScope(album))
    : goTabScope(createNewVideoScope(album))

  // 编辑相册名称
  const editAlbumName = async (e: any, album: MediaCateItem) => {
    e.stopPropagation()
    await createAlbum(album)
  }

  // 删除确认 Modal
  const delCallback = async (api: any, query: any, info: string, callback?: () => void) => {
    Modal.confirm({
      title: '确认删除',
      content: info,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          api(query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功')
                callback && callback()
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

  // 删除相册
  const delAlbum = async (e: any, album: MediaCateItem) => {
    e.stopPropagation()
    const { id, totalImg } = album
    const info = totalImg === 0
      ? `${directoryLabel}删除后无法恢复，确认删除？`
      : `本次预计删除 ${totalImg} ${subDirectoryCountLabel + subDirectoryLabel}，删除后无法恢复，确认删除？`
    const query = { ids: [id], souce: directoryType }
    await delCallback(delMediaCategory, query, info, () => {
      setSelection(selection.filter((x: number) => x !== id))
      refreshAllAlbumLists()
      // TODO 在选区删除时也这么判断一下，现在那边是 refresh(true)
      refresh(lists.length === 1)
    })
  }

  return (props: CustomCardItemProps) => (
    AlbumCard({
      ...props,
      delAlbum,
      intoScope,
      editAlbumName
    } as AlbumCardProps)
  )
}

type AlbumCardProps = CustomCardItemProps & {
  card: MediaCateItem
  intoScope: (album: MediaCateItem) => any
  editAlbumName: (e: any, album: MediaCateItem) => any
  delAlbum: (e: any, album: MediaCateItem) => any
}

function AlbumCard(props: AlbumCardProps) {
  const {
    card, selection,
    handleSelectCard, intoScope, editAlbumName,
    delAlbum,
  } = props
  const { subDirectoryCountLabel } = useContext(CardsPageContext)

  const { id, name, coverUrl, totalImg, type } = card
  const isDefaultAlbum = type === 'DEFAULT'
  const isChecked = selection.find((y: number) => y === id)

  const stopEvent = (e: any) => e.stopPropagation()

  return (
    <div className={styles["album-card"]} key={`album-card-${id}`} onClick={() => intoScope(card)}>

    {!isDefaultAlbum && (
        <div className={styles["selection"] + ' ' + (isChecked ? '' : styles['auto-hide'])} onClick={() => intoScope(card)}>
          <div className={styles["action-wrapper"]}>
            <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} onClick={e => stopEvent(e)} />
            <div className={styles["anticon-down-con"]}>
              <div className={styles["anticon-down"]}>
                <DownOutlined />
              </div>
              <div className={styles["down-actions"]}>
                <div className={styles["anticon-down-item"]} onClick={e => editAlbumName(e, card)}>
                  <EditOutlined />
                  <span>编辑</span>
                </div>
                <div className={styles["anticon-down-item"]} onClick={e => delAlbum(e, card)}>
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
          <span>{totalImg}</span> {subDirectoryCountLabel}
        </span>
      </div></div>
  )
}
