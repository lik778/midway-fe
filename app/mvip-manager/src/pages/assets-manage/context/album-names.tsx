import React, { useEffect, useCallback, useReducer } from 'react'

import { getMediaCatesNameList } from '@/api/shop'

import { MediaCatesNameListItem, MediaCateSource } from "@/interfaces/shop"

const notNull = (x: any) => !!x

async function fetchAlbumNameLists(sourceType: MediaCateSource) {
  try {
    const res = await getMediaCatesNameList({
      source: sourceType
    })
    return {
      lists: res.data.filter(notNull),
      total: res.data.length
    } as AlbumNamesContextType
  } catch(err) {
    return {
      lists: [],
      total: 0
    }
  }
}

type AlbumNamesContextType = {
  lists: MediaCatesNameListItem[]
  total: number
  refresh: () => void
}

const initialState = {
  lists: [],
  total: 0,
  refresh: () => {}
}

const AlbumNamesContext = React.createContext<AlbumNamesContextType>(initialState)

export default AlbumNamesContext

const reducer = (_: any, action: any): AlbumNamesContextType => {
  switch (action.type) {
    case 'refresh':
      return action.payload
    default:
      throw new Error(`invalid action ${action.type}`)
  }
}

export function AlbumNamesContextProvider(props: any) {
  const { sourceType } = props
  let [albumNames, dispatch] = useReducer(reducer, initialState)

  const refresh = useCallback(async () => {
    const res = await fetchAlbumNameLists(sourceType)
    dispatch({
      type: 'refresh',
      payload: res
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [])

  return (
    <AlbumNamesContext.Provider value={{
      lists: albumNames.lists,
      total: albumNames.total,
      refresh
    }}>
      {props.children}
    </AlbumNamesContext.Provider>
  )
}
