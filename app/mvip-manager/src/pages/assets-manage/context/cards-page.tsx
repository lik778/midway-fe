import React, { useReducer } from 'react'

import { AlbumItem, AlbumNameListItem } from "@/interfaces/shop"

type CardsPageContextType = {
  directoryType: 'image' | 'video'
  directoryLabel: '相册' | '视频分组'
  subDirectoryLabel: '图片' | '视频'
  subDirectoryCountLabel: '张' | '个'
  // // 刷新页面列表
  // refresh: (resetPagi?: boolean) => void
  // // 创建或编辑相册
  // createAlbum: (album?: AlbumItem) => void
  // 选择相册模态框
  selectAlbum: (args: { exclude: number[] }) => any
  dispatch: any
}

const initialState: CardsPageContextType = {
  directoryType: 'image',
  directoryLabel: '相册',
  subDirectoryLabel: '图片',
  subDirectoryCountLabel: '张',
  // refresh: () => { },
  // createAlbum: () => { },
  selectAlbum: () => {},
  dispatch: () => { }
}

const CardsPageContext = React.createContext<CardsPageContextType>(initialState)

export default CardsPageContext

const reducer = (prevState: CardsPageContextType, action: any): CardsPageContextType => {
  switch (action.type) {
    case 'update-directory-type':
      prevState.directoryLabel = action.payload === 'image' ? '相册' : '视频分组'
      prevState.subDirectoryLabel = action.payload === 'image' ? '图片' : '视频'
      prevState.subDirectoryCountLabel = action.payload === 'image' ? '张' : '个'
      prevState.directoryType = action.payload
      return prevState
    // case 'update-refresh':
    //   prevState.refresh = action.payload
      // return prevState
    case 'update-select-album':
      prevState.selectAlbum = action.payload
      return prevState
    // case 'update-create-album':
    //   return {
    //     ...prevState,
    //     createAlbum: action.payload
    //   }
    default:
      throw new Error(`invalid action ${action.type}`)
  }
}

export function CardsPageContextProvider(props: any) {
  let [context, dispatch] = useReducer(reducer, initialState)

  return (
    <CardsPageContext.Provider value={{ ...context, dispatch }}>
      {props.children}
    </CardsPageContext.Provider>
  )
}
