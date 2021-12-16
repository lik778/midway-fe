import React, { useState } from 'react'
import { Tabs, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { ModuleID } from './data'
import styles from './index.less'
import ModuleForm from './components/module-form'
import BigImage from './components/big-image';

const TabPane = Tabs.TabPane

const CustomModule = () => {
  const [moduleID, setModuleID] = useState<ModuleID>("1")
  // 切换 Tabs 时切换模块
  const changeModule = (tab: string) => {
    setModuleID(tab as ModuleID)
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
        <TabPane tab="大图模块" key="3">
          <BigImage moduleID={moduleID}></BigImage>
        </TabPane>
      </Tabs>
      <Tooltip color='#fff' overlayStyle={{ maxWidth: 400 }} overlayInnerStyle={{ color: '#999', padding: '10px 20px' }} title='三个模块“在前台对应的位置及样式”不同，大家可进入各模块“查看示例”，根据自己的诉求选择需要的模块，填写模块内容并设置是否展现。' placement='left'>
        <div className={styles['tip']}>
          <QuestionCircleOutlined className={styles['icon']} color={'#999999'} />使用指引
        </div>
      </Tooltip>
    </div>
  </>
}

(CustomModule as any).wrappers = ['@/wrappers/path-auth']

export default CustomModule
