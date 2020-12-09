import React, { useEffect } from 'react';
import { message, Table } from 'antd';
import MainTitle from '@/components/main-title';
import { getAiListApi } from '@/api/ai-content'
import './index.less';

export default (props: any) => {
  useEffect(() => {
    (async () => {
     const res =  await getAiListApi()
     if (res.success) {
     } else {
       message.error(res.message)
     }
    })()
  }, [])
  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '文章分组', dataIndex: 'group', key: 'group' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '发文数量', dataIndex: 'num', key: 'num', render: (text: string, record: any) => {
        return <label>已发文<span style={{ color: '#096DD9' }}>{text}</span>篇</label>
    }
    },
    { title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: any) => (
        <div>
          <span className="action-btn">查看发文</span>
        </div>)
    },
  ];
  const data = [
    { id: 1, key: 1, createTime: '2020-09-19', group: '维修', status: '发文中', num: '200' },
    { id: 2, key: 2, createTime: '2020-10-19', group: '维修', status: '发文中', num: '23' },
  ];
  return (<div>
      <MainTitle title="任务列表"/>
      <div className="ai-list-container">
        <Table columns={columns}  dataSource={data} pagination={{
          hideOnSinglePage: data.length < 10, pageSize: 10, position: ['bottomCenter']}} />
      </div>
    </div>)
}
