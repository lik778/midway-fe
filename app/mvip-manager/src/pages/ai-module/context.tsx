import React, { FC, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { AiModuleContextProps } from './data'
import { ShopInfo } from '@/interfaces/shop';
import { QuestionTaskListItem, AiContentItem } from '@/interfaces/ai-content'
import { ModuleKey } from './data'

export const defaultValue: AiModuleContextProps = {
  activeModuleKey: 'postTool' as ModuleKey,
  // 拷贝数据
  copyData: null,
  // 拷贝数据类型
  copyDataType: null,
  // 记录分页
  pageInfo: {
    postTool: 1,
    shop: 1,
    zhidao: 1
  },
  handleChangeContextData: () => { }
}

const AiModuleContext = React.createContext<AiModuleContextProps>({ ...defaultValue });

export default AiModuleContext