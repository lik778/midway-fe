import React, { useState, useContext } from 'react'
import { Select } from "antd"

import CardsPageContext from '../../context/cards-page'
import AlbumNamesContext from '../../context/album-names'

import { AlbumNameListItem } from "@/interfaces/shop"

export default function useAlbumSelector() {
  const [select, setSelect] = useState<AlbumNameListItem | undefined>(undefined)
  const { directoryLabel } = useContext(CardsPageContext)
  const { lists: allAlbumLists } = useContext(AlbumNamesContext)

  const handleSelectAlbum = (id?: number) => {
    const target = allAlbumLists.find((x: AlbumNameListItem) => x.id === id)
    if (target) {
      setSelect(target)
    } else {
      setSelect(undefined)
    }
  }
  const setSelectByID = handleSelectAlbum

  return [
    <Select
      className='upload-image-uploador'
      placeholder={`请选择一个${directoryLabel}`}
      value={select ? select.id : undefined}
      onChange={(val: number) => handleSelectAlbum(val)}
    >
      {allAlbumLists.map((x: AlbumNameListItem) => {
        return <Select.Option value={x.id} key={x.id}>{x.name}</Select.Option>
      })}
    </Select>,
    select,
    setSelect,
    setSelectByID,
  ] as const
}
