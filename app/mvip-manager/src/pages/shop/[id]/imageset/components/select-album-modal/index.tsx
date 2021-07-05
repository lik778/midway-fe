import React, { useEffect, useState, useCallback } from 'react';
import { Button, Select, Modal } from "antd";

import { useAllAlbumLists } from '../../hooks/albums'

import { AlbumItem } from '../../types'

import styles from './index.less';

let albumSelectResolver: any = null

// 选择 AlbumLists 所使用的模态框
export function useSelectAlbumListsModal() {
  const [allAlbumLists] = useAllAlbumLists()
  const [moveImageTo, setMoveImageTo] = useState<AlbumItem | null>(null);
  const [albumSelectModal, setAlbumSelectModal] = useState(false);

  const selectAlbum = async (): Promise<AlbumItem> => {
    setAlbumSelectModal(true)
    return await new Promise(async resolve => {
      albumSelectResolver = resolve
    })
  }
  const handleSelectAlbum = (id: number) => {
    const target = allAlbumLists.find((x: AlbumItem) => x.id === id)
    target && setMoveImageTo(target)
  }
  const handleConfirmSelectAlbum = () => {
    albumSelectResolver && albumSelectResolver(moveImageTo)
    setAlbumSelectModal(false)
  }

  return [
    <Modal
      wrapClassName="album-select-modal"
      title="移动到"
      width={432}
      footer={null}
      visible={albumSelectModal}
      onCancel={() => setAlbumSelectModal(false)}
    >
      <Select
        className='album-select-album-selector'
        placeholder="请选择一个相册"
        onChange={val => handleSelectAlbum(val)}
      >
        {allAlbumLists.map((x: AlbumItem) => {
          return <Select.Option value={x.id}>{x.name}</Select.Option>
        })}
      </Select>
      <div>
        <Button
          className={styles["confirm-btn"]}
          type="primary"
          htmlType="submit"
          onClick={handleConfirmSelectAlbum}
        >
          确定
        </Button>
      </div>
    </Modal>,
    selectAlbum
  ]
}
