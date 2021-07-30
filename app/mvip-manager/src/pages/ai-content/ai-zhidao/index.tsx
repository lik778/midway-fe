import React, { useEffect, useState } from 'react';
import { useHistory } from "umi";
import MainTitle from '@/components/main-title';
import { Tabs } from 'antd';
import CreateJob from '../components/zhidao-create-job';
import JobList from '../components/zhidao-job-list';
import BasicMaterial from '../components/basic-material';
import styles from './index.less'
const { TabPane } = Tabs;

export type ActiveKey = 'job-list' | 'create-job' | 'basic-material'

const AiZhidaoPage = (props: any) => {
  const history = useHistory<{ query: { activeKey?: string, page?: string } }>()
  const [activeKey, setActiveKey] = useState<ActiveKey>()

  useEffect(() => {
    // @ts-ignore
    // 这里是history.location的类型定义里没有query字段
    const { activeKey } = history.location.query
    if (!activeKey || (activeKey !== 'job-list' && activeKey !== 'create-job' && activeKey !== 'basic-material')) {
      history.replace(`${history.location.pathname}?activeKey=job-list`)
      setActiveKey('job-list')
    } else {
      setActiveKey(activeKey)
    }
  }, [])

  const changeActiveKey = (key: ActiveKey) => {
    history.replace(`${history.location.pathname}?activeKey=${key}`)
    setActiveKey(key)
  }

  return (<div className={styles['ai-zhidao']}>
    <MainTitle title="问答AI" />
    <Tabs activeKey={activeKey} onChange={(activeKey) => changeActiveKey(activeKey as ActiveKey)}>
      <TabPane tab="任务列表" key="job-list">
        <JobList {...props} activeKey={activeKey} />
      </TabPane>
      <TabPane tab="新建任务" key="create-job">
        <CreateJob {...props} changeActiveKey={changeActiveKey} activeKey={activeKey} />
      </TabPane>
      <TabPane tab="基础素材库" key="basic-material">
        <BasicMaterial {...props} />
      </TabPane>
    </Tabs>
  </div>)
}

AiZhidaoPage.wrappers = ['@/wrappers/path-auth']

export default AiZhidaoPage
