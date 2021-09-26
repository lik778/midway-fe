import React, { FC, useContext } from 'react';
import { Tabs } from 'antd';
import MainTitle from '@/components/main-title';
import AiModuleContext from '@/pages/ai-module/promote-create/context'
import { ModuleKey } from '@/pages/ai-module/promote-create/data'
import PostTool from './components/post-tool'
import Shop from './components/shop'
import Zhidao from './components/zhidao'
import styles from './index.less'
const { TabPane } = Tabs;

const AiList = () => {
  const { activeModuleKey, handleChangeContextData } = useContext(AiModuleContext)

  return <>
    <MainTitle title={'创建推广'}></MainTitle>
    <Tabs className={styles['ai-list']} activeKey={activeModuleKey} onChange={(activeModuleKey) => handleChangeContextData({ activeModuleKey: activeModuleKey as ModuleKey })}>
      <TabPane tab="贴子" key="postTool"><PostTool></PostTool></TabPane>
      <TabPane tab="知道" key="zhidao"><Zhidao></Zhidao></TabPane>
      <TabPane tab="店铺文章" key="shop"><Shop></Shop></TabPane>
    </Tabs>
  </>
}

AiList.wrappers = ['@/wrappers/path-auth']

export default AiList

