import React, { useEffect, useCallback, useReducer } from 'react'

import { getAlbumNameList } from '@/api/shop'

import { AlbumNameListItem } from "@/interfaces/shop"

const notNull = (x: any) => !!x

async function fetchAlbumNameLists() {
  try {
    const res = await getAlbumNameList()
    return {
      lists: res.data.filter(notNull),
      total: res.data.length
    } as AlbumNamesContextType
  } catch(err) {
    throw new Error(err)
  }
}

type AlbumNamesContextType = {
  lists: AlbumNameListItem[]
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
  let [albumNames, dispatch] = useReducer(reducer, initialState)

  const refresh = useCallback(async () => {
    const res = await fetchAlbumNameLists()
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
