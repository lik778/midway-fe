import React, { useEffect, useState, useCallback } from 'react';
import { Select } from "antd";

import { AlbumItem } from "@/interfaces/shop";

interface Props {
  allAlbumLists: AlbumItem[];
}
export function useAlbumSelector(props: Props) {
  const { allAlbumLists } = props
  const [select, setSelect] = useState<AlbumItem | undefined>(undefined);

  const handleSelectAlbum = (id?: number) => {
    const target = allAlbumLists.find((x: AlbumItem) => x.id === id)
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
      placeholder="请选择一个相册"
      value={select ? select.id : undefined}
      onChange={(val: number) => handleSelectAlbum(val)}
    >
      {allAlbumLists.map((x: AlbumItem) => {
        return <Select.Option value={x.id}>{x.name}</Select.Option>
      })}
    </Select>,
    select,
    setSelect,
    setSelectByID,
  ] as const
}
