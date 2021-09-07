import React, { useReducer } from 'react'

import { MediaCateItem, MediaCatesNameListItem } from "@/interfaces/shop"

type CardsPageContextType = {
  directoryType: 'IMAGE' | 'VIDEO'
  directoryLabel: '相册' | '分组'
  subDirectoryLabel: '图片' | '视频'
  subDirectoryCountLabel: '张' | '个'
  // // 刷新页面列表
  // refresh: (resetPagi?: boolean) => void
  // // 创建或编辑相册
  // createAlbum: (album?: MediaCateItem) => void
  // 选择相册模态框
  selectAlbum: (args: { exclude: number[] }) => any
  dispatch: any
}

const initialState: CardsPageContextType = {
  directoryType: 'IMAGE',
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
      const directoryLabel = action.payload === 'IMAGE' ? '相册' : '分组'
      const subDirectoryLabel = action.payload === 'IMAGE' ? '图片' : '视频'
      const subDirectoryCountLabel = action.payload === 'IMAGE' ? '张' : '个'
      const directoryType = action.payload
      return {
        ...prevState,
        directoryLabel,
        subDirectoryLabel,
        subDirectoryCountLabel,
        directoryType,
      }
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
