import React, { FC, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { AiModuleContextProps } from './data'
import { ShopInfo } from '@/interfaces/shop';
import { QuestionTaskListItem, AiContentItem, AuthKey } from '@/interfaces/ai-module'
import { ModuleKey } from './data'

export const defaultValue: AiModuleContextProps = {
  auth: null,
  activeModuleKey: 'postTool' as ModuleKey,
  // 拷贝数据
  copyId: null,
  // 拷贝数据类型
  copyIdType: null,
  // 记录分页
  pageInfo: {
    postTool: {
      page: 1,
      dataTotal: 0,
    },
    shop: {
      page: 1,
      dataTotal: 0,
    },
    zhidao: {
      page: 1,
      dataTotal: 0,
    },
  },
  postToolFormDisabled: false,
  postToolFormData: {},
  vipResourcesList: [],
  selectedVipResources: null,
  
  handleChangeContextData: () => { }
}

const AiModuleContext = React.createContext<AiModuleContextProps>({ ...defaultValue });

export default AiModuleContext