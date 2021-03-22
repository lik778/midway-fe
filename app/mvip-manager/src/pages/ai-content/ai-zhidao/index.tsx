import React, { useEffect, useState } from 'react';
import MainTitle from '@/components/main-title';
import { Tabs } from 'antd';
import CreateJob from '../components/zhidao-create-job';
import JobList from '../components/zhidao-job-list';
import BasicMaterial from '../components/basic-material';

const { TabPane } = Tabs;

export default (props: any) => {
  return (<div>
    <MainTitle title="问答AI" />
    <Tabs defaultActiveKey="basic-material">
      <TabPane tab="任务列表" key="">
        <JobList {...props} />
      </TabPane>
      <TabPane tab="新建任务" key="create-job">
        <CreateJob {...props} />
      </TabPane>
      <TabPane tab="基础素材库" key="basic-material">
        <BasicMaterial {...props} />
      </TabPane>
    </Tabs>
  </div>)
}