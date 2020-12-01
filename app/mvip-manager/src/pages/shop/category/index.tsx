import React from 'react';
import { Table, Button, Select, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ModuleEmpty from '@/components/shop-module-empty';
import { ShopModuleType } from '@/enums';
import './index.less'
const Option = Select.Option;

const CategoryList = () => {
  const editItem = (record: any) => {
    console.log('编辑', record)
  }

  const deleteItem = (recordr: any) => {
    console.log('删除', recordr)
  }
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '封面', dataIndex: 'img', key: 'img', render: () =>
        <img width="60" height="40" src="//file.baixing.net/202012/8d77706058cd168278be2d967d40e085.jpg"/> },
    { title: '服务名称', dataIndex: 'name', key: 'name' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    { title: '服务分组', dataIndex: 'category', key: 'category' },
    { title: '审核结果', dataIndex: 'auditStatus', key: 'auditStatus' },
    { title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: any) => (
        <div>
          <span onClick={() => editItem(record)} className="action-btn">修改</span>
          <span onClick={() => deleteItem(record)} className="action-btn">删除</span>
        </div>)
    },
  ];
  const data = [
    { id: 1, key: 1, name: '空调家电维修', price: '面议', category: '维修', auditStatus: '审核不通过' },
    { id: 2, key: 2, name: '空调家电维修', price: '面议', category: '维修', auditStatus: '审核不通过' },
    { id: 3, key: 3, name: '空调家电维修', price: '面议', category: '维修', auditStatus: '审核通过' },
  ];

  return (
    <div>
      {/*<Modal title="确认删除吗？" visible={true}>*/}
      {/*  <p>这里是提示</p>*/}
      {/*</Modal>*/}
      <Table columns={columns}  dataSource={data} pagination={{
        hideOnSinglePage: data.length < 10, pageSize: 10, position: ['bottomCenter']}} />
  </div>)
}

const NavBox = (props: any) => {
  const group = () => { alert('服务分组') }
  const create = () => { alert('创建') }
  return (
    <div className="nav-container">
        <div style={{ float: 'left' }}>
          <Select
            showSearch
            size="large"
            style={{ width: 200 }}
            placeholder="选择服务"
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            <Option value="服务1">服务1</Option>
            <Option value="服务2">服务2</Option>
            <Option value="服务3">服务3</Option>
          </Select>
        </div>
        <div style={{ float: 'right' }}>
          <Button onClick={() => group()} size="large" style={{ marginRight: 36 }}>服务分组</Button>
          <Button onClick={() => create() } icon={<PlusOutlined />} size="large" type="primary">新建服务</Button>
        </div>
    </div>
  )
}

export default (props: any) => {
  const hasData = true;
  let containerComponent;
  if (hasData) {
    containerComponent = (
      <div>
        <NavBox />
        <CategoryList />
      </div>
    )
  } else {
    containerComponent = <ModuleEmpty type={props.type}/>
  }
  return (<div>
      <MainTitle title="百姓网店铺"/>
      <ShopModuleTab type={ShopModuleType.category}/>
      <div className="container">
        { containerComponent }
      </div>
  </div>)
}
