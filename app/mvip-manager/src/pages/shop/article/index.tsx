import React, { useState } from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ModuleEmpty from '@/components/shop-module-empty';
import ArticleBox from '@/components/article-box';
import { ShopModuleType } from '@/enums';
import './index.less';
import { Button, Select, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ShopModuleGroup from '@/components/shop-module-group';
const Option = Select.Option;

const ArticleList = () => {
  const editItem = (record: any) => {
    console.log('编辑', record)
  }

  const deleteItem = (recordr: any) => {
    console.log('删除', recordr)
  }
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '文章标题', dataIndex: 'title', key: 'name' },
    { title: '文章分组', dataIndex: 'group', key: 'price' },
    { title: '发文来源', dataIndex: 'from', key: 'from',
      render: (text: string, record: any) => {
        return <span style={{ color: text === 'AI发布' ? '#FF8D19' :'' }}>{text}</span>
      }
    },
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
    { id: 1, key: 1, title: '空调家电维修空调家电维修', group: '空调家电维修', from: '手动发布', auditStatus: '审核不通过' },
    { id: 2, key: 2, title: '空调家电维修空调家电维修', group: '维修', from: 'AI发布', auditStatus: '审核不通过' },
    { id: 3, key: 3, title: '空调家电维修', group: '维修', from: '手动发布', auditStatus: '审核通过' },
  ];

  return (
    <div>
      {/*<Modal title={<span style={{ color: '#F1492C' }}>确认删除</span>} visible={true}>*/}
      {/*  <p>删除后无法恢复，确认删除？</p>*/}
      {/*</Modal>*/}
      <Table columns={columns}  dataSource={data} pagination={{
        hideOnSinglePage: data.length < 10, pageSize: 10, position: ['bottomCenter']}} />
    </div>)
}

const NavBox = (props: any) => {
  return (
    <div className="nav-container">
      <div style={{ float: 'left' }}>
        <Select
          showSearch
          size="large"
          style={{ width: 200 }}
          placeholder="选择文章"
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          <Option value="文章1">文章1</Option>
          <Option value="文章2">文章2</Option>
          <Option value="文章3">文章3</Option>
        </Select>
      </div>
      <div style={{ float: 'right' }}>
        <Button onClick={props.getGroup} size="large" style={{ marginRight: 36 }}>文章分组</Button>
        <Button onClick={props.createModuleItem} icon={<PlusOutlined />} size="large" type="primary">新建文章</Button>
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
        <ShopModuleGroup
          title="文章分组"
          createBtnText="新建文章"
          onClose={() => setVisible(false)}
          visible={visible}
          save={() => { console.log('保存') }}
        />
        <ArticleList />
        {/*<ArticleBox/>*/}
      </div>
    )
  } else {
    containerComponent = <ModuleEmpty type={props.type}/>
  }
  return (<div>
    <MainTitle title="百姓网店铺"/>
    <ShopModuleTab type={ShopModuleType.article}/>
    <div className="container">
      { containerComponent }
    </div>
  </div>)
}
