import React,  { useState } from 'react';
import { Table, Button, Select, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ModuleEmpty from '@/components/shop-module-empty';
import ShopModuleGroup from '@/components/shop-module-group';
import { ShopModuleType } from '@/enums';
import './index.less'
const Option = Select.Option;

const CategoryList = () => {
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);

  const editItem = (record: any) => {
    alert('去编辑')
  }

  const deleteItem = (record: any) => {
    setVisibleDeleteDialog(true)
  }
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '封面', dataIndex: 'img', key: 'img', render: () =>
        <img width="60" height="40" src="//file.baixing.net/202012/8d77706058cd168278be2d967d40e085.jpg"/> },
    { title: '服务名称', dataIndex: 'name', key: 'name' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    { title: '服务分组', dataIndex: 'group', key: 'group' },
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
    { id: 1, key: 1, name: '空调家电维修', price: '面议', group: '维修', auditStatus: '审核不通过' },
    { id: 2, key: 2, name: '空调家电维修', price: '面议', group: '维修', auditStatus: '审核不通过' },
    { id: 3, key: 3, name: '空调家电维修', price: '面议', group: '维修', auditStatus: '审核通过' },
  ];

  return (
    <div>
      <Modal title={<span style={{ color: '#F1492C' }}>确认删除</span>}
       onCancel={() => setVisibleDeleteDialog(false)}
       onOk={() => { console.log('已删除'); setVisibleDeleteDialog(true) }}
       visible={visibleDeleteDialog}>
        <p>删除后无法恢复，确认删除？</p>
      </Modal>
      <Table columns={columns}  dataSource={data} pagination={{
        hideOnSinglePage: data.length < 10, pageSize: 10, position: ['bottomCenter']}} />
  </div>)
}

interface NavBoxProps {
  getGroup(): void;
  createModuleItem(): void;
}
const NavBox = (props: NavBoxProps) => {
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
          <Button onClick={props.getGroup} size="large" style={{ marginRight: 36 }}>服务分组</Button>
          <Button onClick={props.createModuleItem} icon={<PlusOutlined />} size="large" type="primary">新建服务</Button>
        </div>
    </div>
  )
}

export default (props: any) => {
  const [visible, setVisible] = useState(false);
  const hasData = true;
  let containerComponent;
  if (hasData) {
    containerComponent = (
      <div>
        <NavBox getGroup={() => setVisible(true)}
            createModuleItem={() => alert('创建')} />
        <CategoryList />
        <ShopModuleGroup
          title="服务分组"
          createBtnText="新建服务"
          onClose={() => setVisible(false)}
          visible={visible}
          save={() => { console.log('保存') }}
        />
      </div>
    )
  } else {
    containerComponent = <ModuleEmpty type={ShopModuleType.category}/>
  }
  return (<div>
      <MainTitle title="百姓网店铺"/>
      <ShopModuleTab type={ShopModuleType.category}/>
      <div className="container">
        { containerComponent }
      </div>
  </div>)
}
