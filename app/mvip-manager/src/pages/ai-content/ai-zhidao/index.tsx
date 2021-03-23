import React, { useEffect, useState } from 'react';
import MainTitle from '@/components/main-title';
import { Tabs } from 'antd';
import CreateJob from '../components/zhidao-create-job';
import JobList from '../components/zhidao-job-list';
import BasicMaterial from '../components/basic-material';

const { TabPane } = Tabs;

export type ActiveKey = 'job-list' | 'create-job' | 'basic-material'

export default (props: any) => {

  const [activeKey, setActiveKey] = useState<ActiveKey>('create-job')

  const changeActiveKey = (key: ActiveKey) => {
    setActiveKey(key)
  }

  return (<>
    <MainTitle title="问答AI" />
    <Tabs activeKey={activeKey} onChange={(activeKey) => changeActiveKey(activeKey as ActiveKey)}>
      <TabPane tab="任务列表" key="job-list">
        <JobList {...props} />
      </TabPane>
      <TabPane tab="新建任务" key="create-job">
        <CreateJob {...props} changeActiveKey={changeActiveKey} activeKey={activeKey} />
      </TabPane>
      <TabPane tab="基础素材库" key="basic-material">
        <BasicMaterial {...props} />
      </TabPane>
    </Tabs>
  </>)
}