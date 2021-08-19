import React, { useReducer } from 'react'

type CardsPageContextType = {
  directoryType: 'image' | 'video'
  directoryLabel: '相册' | '视频分组'
  subDirectoryLabel: '图片' | '视频'
  subDirectoryCountLabel: '张' | '个'
  dispatch: any
}

const initialState: CardsPageContextType = {
  directoryType: 'image',
  directoryLabel: '相册',
  subDirectoryLabel: '图片',
  subDirectoryCountLabel: '张',
  dispatch: () => {}
}

const CardsPageContext = React.createContext<CardsPageContextType>(initialState)

export default CardsPageContext

const reducer = (state: CardsPageContextType, action: any): CardsPageContextType => {
  switch (action.type) {
    case 'update-directory-type':
      const directoryLabel = action.payload === 'image' ? '相册' : '视频分组'
      const subDirectoryLabel = action.payload === 'image' ? '图片' : '视频'
      const subDirectoryCountLabel = action.payload === 'image' ? '张' : '个'
      return {
        directoryType: action.payload,
        directoryLabel,
        subDirectoryLabel,
        subDirectoryCountLabel,
        dispatch: state.dispatch
      }
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
