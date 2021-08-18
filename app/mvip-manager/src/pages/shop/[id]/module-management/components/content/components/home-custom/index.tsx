import React, { useState } from 'react'
import { Tabs } from 'antd';

import styles from './index.less'
import ModuleForm from './components/module-form'
const TabPane = Tabs.TabPane

const CustomModule = () => {
  const [moduleID, setModuleID] = useState<"1" | "2">("1")
  // 切换 Tabs 时切换模块
  const changeModule = (tab: string) => {
    setModuleID(tab as "1" | "2")
  }
  return <>
    <div className={styles['container']}>
      <Tabs className={styles['tabs']} defaultActiveKey={moduleID} onChange={changeModule}>
        <TabPane tab="自定义模块一" key="1">
          <ModuleForm moduleID={moduleID}> </ModuleForm>
        </TabPane>
        <TabPane tab="自定义模块二" key="2">
          <ModuleForm moduleID={moduleID}> </ModuleForm>
        </TabPane>
      </Tabs>

    </div>
  </>
}

(CustomModule as any).wrappers = ['@/wrappers/path-auth']

export default CustomModule
