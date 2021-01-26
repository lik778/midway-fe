import * as React from 'react';
import { Table, Button } from 'antd';

export default () => {
  const dataSource = [
    {
      key: '1',
      name: '1号',
      age: 32,
      address: '1号',
    },
    {
      key: '2',
      name: '2号',
      age: 42,
      address: '1号',
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <div>
      <Button type="primary">检查</Button>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}
