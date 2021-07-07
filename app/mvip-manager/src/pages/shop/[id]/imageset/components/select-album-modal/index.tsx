import React, { useEffect, useState, useCallback } from 'react';
import { Button, Select, Modal } from "antd";

import { AlbumItem } from '../../types'

import styles from './index.less';

let albumSelectResolver: any = null

type Props = {
  allAlbumLists: AlbumItem[]
}
export function useSelectAlbumListsModal(props: Props) {
  const { allAlbumLists } = props
  const [select, setSelect] = useState<AlbumItem | null>(null);
  const [visible, setVisible] = useState(false);

  const selectAlbum = async (): Promise<AlbumItem> => {
    setVisible(true)
    return await new Promise(async resolve => {
      albumSelectResolver = resolve
    })
  }
  const handleSelectAlbum = (id: number) => {
    const target = allAlbumLists.find((x: AlbumItem) => x.id === id)
    target && setSelect(target)
  }
  const handleConfirmSelectAlbum = () => {
    albumSelectResolver && albumSelectResolver(select)
    setVisible(false)
  }

  return [
    <Modal
      wrapClassName="album-select-modal"
      title="移动到"
      width={432}
      footer={null}
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      <Select
        className='album-select-album-selector'
        placeholder="请选择一个相册"
        onChange={(val: number) => handleSelectAlbum(val)}
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
  ] as const
}
