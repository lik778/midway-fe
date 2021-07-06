import React, { useEffect, useState, useCallback } from 'react';
import { Select } from "antd";

import { useAllAlbumLists } from '../../hooks/albums'

import { AlbumItem } from '../../types'

export function useAlbumSelector() {
  const [allAlbumLists] = useAllAlbumLists()
  const [select, setSelect] = useState<AlbumItem | null>(null);

  const handleSelectAlbum = (id: number) => {
    const target = allAlbumLists.find((x: AlbumItem) => x.id === id)
    target && setSelect(target)
  }

  return [
    <Select
      className='upload-image-uploador'
      placeholder="请选择一个相册"
      onChange={(val: number) => handleSelectAlbum(val)}
    >
      {allAlbumLists.map((x: AlbumItem) => {
        return <Select.Option value={x.id}>{x.name}</Select.Option>
      })}
    </Select>,
    select,
    setSelect
  ] as const
}
