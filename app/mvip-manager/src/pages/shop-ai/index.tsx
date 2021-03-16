import React, { useEffect, useState } from 'react';
import MainTitle from '@/components/main-title';
import { Menu } from 'antd';
import { Link } from 'umi';
import './index.less';

export default () => {
    return (<div>
        <MainTitle title="店铺AI"/>
        <Menu className="menu-ul">
            <Menu.Item key="job-list">
                <Link to="/ai-content/job-list">任务列表</Link>
            </Menu.Item>
            <Menu.Item key="create-job">
                <Link to="/ai-content/create-job">新建任务</Link>
            </Menu.Item>
        </Menu>
    </div>)
}