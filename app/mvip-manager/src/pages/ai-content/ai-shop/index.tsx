import React from 'react';
import MainTitle from '@/components/main-title';
import { Tabs } from 'antd';
import CreateJob from '../components/shop-create-job';
import JobList from '../components/shop-job-list';
import styles from './index.less'
const { TabPane } = Tabs;

const AIShopPage = (props: any) => {
    return (<div className={styles['ai-shop']}>
        <MainTitle title="店铺AI" />
        <Tabs defaultActiveKey="job-list">
            <TabPane tab="任务列表" key="job-list">
                <JobList {...props} />
            </TabPane>
            <TabPane tab="新建任务" key="create-job">
                <CreateJob {...props} />
            </TabPane>
        </Tabs>
    </div>)
}

AIShopPage.wrappers = ['@/wrappers/path-auth']

export default AIShopPage
