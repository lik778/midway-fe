import React, { FC, useContext, useState } from 'react';
import { Tabs } from 'antd';
import MainTitle from '@/components/main-title';
import AiModuleContext from '@/pages/ai-module/promote-create/context'
import { ModuleKey } from '@/pages/ai-module/promote-create/data'
import PostTool from './components/post-tool'
import Shop from './components/shop'
import Zhidao from './components/zhidao'
import styles from './index.less'
import SelectCopy from './components/select-copy'

const { TabPane } = Tabs;

const AiList = () => {
  const { auth, activeModuleKey, handleChangeContextData } = useContext(AiModuleContext)
  const [selectCopyVisible, setSelectCopyVisible] = useState<boolean>(false)

  const onCopy = () => {
    setSelectCopyVisible(true)
  }

  const onClose = () => {
    setSelectCopyVisible(false)
  }

  return <>
    <MainTitle title={'创建推广'}></MainTitle>
    <Tabs className={styles['ai-list']} activeKey={activeModuleKey} onChange={(activeModuleKey) => handleChangeContextData('activeModuleKey', activeModuleKey as ModuleKey)}>
      {
        auth && <>
          {
            auth.postTool && <TabPane tab="贴子" key="postTool"><PostTool onCopy={onCopy}></PostTool></TabPane>
          }
          {
            auth.zhidao && <TabPane tab="知道" key="zhidao"><Zhidao onCopy={onCopy}></Zhidao></TabPane>
          }
          {
            auth.shop && <TabPane tab="店铺文章" key="shop"><Shop onCopy={onCopy}></Shop></TabPane>
          }
        </>
      }
    </Tabs>
    <SelectCopy visible={selectCopyVisible} onClose={onClose}></SelectCopy>
  </>
}

AiList.wrappers = ['@/wrappers/path-auth']

export default AiList

