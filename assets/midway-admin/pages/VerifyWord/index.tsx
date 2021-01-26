import * as React from 'react';
import { Table, Select, Form } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default () => {
  const dataSource = [
    {
      key: '1',
      uid: '1232',
      id: 2332,
      task_id: 1233,
      address: '1号',
      cate: '搬家',
      create_time: '2021-07-08',
      status: 1
    },

  ];

  const columns = [
    {
      title: 'uid',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'shop_id',
      dataIndex: 'shop_id',
      key: 'shop_id',
    },
    {
      title: 'task_id',
      dataIndex: 'task_id',
      key: 'task_id',
    },
    {
      title: '所属分组',
      dataIndex: 'cate',
      key: 'cate',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      render: () => <span>查看</span>
    },
  ];

  return (
    <div>
      <Form style={{ marginBottom: 32 }}>
        <FormItem label="审核状态">
          <Select defaultValue="" style={{ width: 200 }} >
            <Option value="">全部</Option>
            <Option value="0">待审核</Option>
            <Option value="1">审核通过</Option>
            <Option value="2">审核驳回</Option>
          </Select>
        </FormItem>
      </Form>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}
