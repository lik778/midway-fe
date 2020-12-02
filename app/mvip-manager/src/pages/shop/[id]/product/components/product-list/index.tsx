// tips: 这边和文章模块还要继续抽组件出来，还有css的scope要分离好
import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import { deleteProductApi } from '@/api/shop';

interface Props {
  dataSource: any[];
  total: number;
  onChange(page: number): void;
}

export default (props: Props) => {
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
  const { onChange, total, dataSource } = props
  const editItem = (record: any) => {
    alert('去编辑')
  }
  const deleteItem = (record: any) => {
    setVisibleDeleteDialog(true)
  }
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '封面', dataIndex: 'headImg', key: 'headImg', render: (text: string) =>
        <img width="60" height="40" src={text}/> },
    { title: '服务名称', dataIndex: 'name', key: 'name' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    { title: '服务分组', dataIndex: 'cateName', key: 'cateName' },
    { title: '审核结果', dataIndex: 'status', key: 'status' },
    { title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: any) => (
        <div>
          <span onClick={() => editItem(record)} className="action-btn">修改</span>
          <span onClick={() => deleteItem(record)} className="action-btn">删除</span>
        </div>)
    },
  ];

  return (
    <div>
      <Modal title={<span style={{ color: '#F1492C' }}>确认删除</span>}
             onCancel={() => setVisibleDeleteDialog(false)}
             onOk={() => { console.log('已删除'); setVisibleDeleteDialog(true) }}
             visible={visibleDeleteDialog}>
        <p>删除后无法恢复，确认删除？</p>
      </Modal>
      <Table columns={columns}  dataSource={dataSource} pagination={{
        onChange, total, hideOnSinglePage: dataSource.length < 10, position: ['bottomCenter']}} />
    </div>)
}
