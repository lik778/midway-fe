import React, { useMemo, useState, useContext } from 'react'
import { Button, Select, Modal } from "antd"

import CardsPageContext from '../../context/cards-page'
import AlbumNamesContext from '../../context/album-names'

import { MediaCatesNameListItem } from "@/interfaces/shop"

import styles from './index.less'

let albumSelectResolver: ((select: MediaCatesNameListItem | PromiseLike<MediaCatesNameListItem>) => void) | null = null

export default function useSelectAlbumListsModal() {
  const { directoryLabel } = useContext(CardsPageContext)
  const { lists: allAlbumLists } = useContext(AlbumNamesContext)
  const [exclude, setExclude] = useState<number[]>([])
  const displayLists = useMemo(() => allAlbumLists.filter(x => !exclude.includes(x.id)), [exclude])
  const [select, setSelect] = useState<MediaCatesNameListItem>()
  const [visible, setVisible] = useState(false)

  const selectAlbum = async (args: { exclude: number[] }): Promise<MediaCatesNameListItem> => {
    const { exclude = [] } = args
    if (exclude && exclude.length > 0) {
      setExclude(exclude)
    }
    setVisible(true)
    return await new Promise(async resolve => {
      albumSelectResolver = resolve
    })
  }
  const handleSelectAlbum = (id: number) => {
    const target = allAlbumLists.find((x: MediaCatesNameListItem) => x.id === id)
    target && setSelect(target)
  }
  const handleConfirmSelectAlbum = () => {
    albumSelectResolver && albumSelectResolver(select as MediaCatesNameListItem)
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
        placeholder={`请选择一个${directoryLabel}`}
        onChange={(val: number) => handleSelectAlbum(val)}
      >
        {displayLists.map((x: MediaCatesNameListItem, idx: number) => (
          <Select.Option
            value={x.id}
            key={String(x.id) + idx}
          >
            {x.name}
          </Select.Option>
        ))}
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
