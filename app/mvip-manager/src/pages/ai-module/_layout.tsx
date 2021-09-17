import React, { useState, FC } from 'react';
import { AiModuleContextProps } from './data'
import AiModuleContext, { defaultValue as defaultContextValue } from './context'

const AiModule: FC = (props) => {

  const [contextValue, setContextValue] = useState<AiModuleContextProps>({ ...defaultContextValue })

  const handleChangeContextData = (data: {
    [key in keyof AiModuleContextProps]?: any
  }) => {
    setContextValue({
      ...contextValue,
      ...data
    })
  }

  return <AiModuleContext.Provider value={{
    ...contextValue,
    handleChangeContextData
  }}>
    {props.children}
  </AiModuleContext.Provider>
}

export default AiModule