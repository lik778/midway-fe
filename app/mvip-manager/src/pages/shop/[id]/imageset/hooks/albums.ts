import React, { useEffect, useState, useCallback } from 'react';

import { AlbumItem } from '../types'

export function useAllAlbumLists() {
  const [lists, setLists] = useState<AlbumItem[]>([])
  new Promise(resolve => setTimeout(resolve, 500)).then(() => {
    setLists(Array(80).fill('').map((x, idx) => {
      return {
        type: 'album',
        id: idx + 1,
        name: '默认相册' + idx,
        count: ~~(Math.random() * 29),
        url: (idx % 1)
          ? `http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1?x=${idx + 1}`
          : "http://img4.baixing.net/63becd57373449038fcbc3b599aecc8c.jpg_sv1",
      }
    }))
  })
  return [lists, setLists] as const
}
