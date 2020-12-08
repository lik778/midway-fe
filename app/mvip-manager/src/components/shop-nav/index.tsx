
import React from 'react';
import { Table, Checkbox, Button } from 'antd';
import InputLen from "@/components/input-len"
import './index.less';
export default (props: any) => {
  const onChange = (e: { target: { checked: any; }; }) => {
    console.log(`checked = ${e.target.checked}`);
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: React.ReactNode) => <InputLen value={text}/>,
    },
    {
      title: '页面介绍',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '是否显示',
      key: 'action',
      render: () => (
        <Checkbox onChange={onChange}></Checkbox>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: '首页',
      description: '首页',
      disable: true, 
    },
    {
      key: '2',
      name: '产品服务',
      description: '商家产品/服务分类的介绍页面',
    },
    {
      key: '3',
      name: '文章服务',
      description: ' 新闻资讯的展示页面',
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} />
      <Button type="primary" className="save-nav" size="large">保存</Button>
    </div>
    

  );
}
