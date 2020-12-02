import React,  { useState, useEffect, useCallback } from 'react';
import { Table, Button, Select, Modal, message } from 'antd';
import { useParams } from "umi";
import { PlusOutlined } from '@ant-design/icons';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ModuleEmpty from '@/components/shop-module-empty';
import ShopModuleGroup from '@/components/shop-module-group';
import CategoryBox from '@/components/category-box';
import { ShopModuleType } from '@/enums';
import { getProductListApi }  from '@/api/shop';

import './index.less'
import { RouteParams } from '@/interfaces/shop';
const Option = Select.Option;

// tips: 这边和文章模块还要继续抽组件出来，还有css的scope要分离好
interface CategoryListProps {
  dataSource: any[];
  total: number;
  onChange(page: number): void;
}

const CategoryList = (props: CategoryListProps) => {
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

interface NavBoxProps {
  cateList: any[];
  onChange(cate: number): void;
  getGroup(): void;
  createModuleItem(): void;
}
const NavBox = (props: NavBoxProps) => {
  const { cateList, onChange } = props;
  return (
    <div className="nav-container">
        <div style={{ float: 'left' }}>
          <Select
            showSearch
            size="large"
            style={{ width: 200 }}
            placeholder="选择服务"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            <Option value={0}>全部</Option>
            {
              cateList.length && cateList.map(item => {
              return (<Option value={item.id}>{item.name}</Option>)
              })
            }
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
  const [productList, setProductList] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [contentCateId, setContentCateId] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  // 获取店铺id
  const params: RouteParams = useParams();

  useEffect(() => {
    (async () => {
      const { success, data, message } = await getProductListApi(Number(params.id), { page, contentCateId, size: 10 })
      if (success) {
        setProductList(data.productList.result || [])
        setCateList(data.cateList || [])
        setTotal(data.productList.totalRecord)
      } else {
        message.error(message);
      }
    })()
  }, [page, contentCateId])


  const hasData = true;
  let containerComponent;

  if (hasData) {
    containerComponent = (
      <div>
        <NavBox
          onChange={(cateId) => {
            setPage(1)
            setContentCateId(cateId)
          }}
          cateList={cateList}
          getGroup={() => setVisible(true)}
          createModuleItem={() => alert('创建')} />
        <CategoryList dataSource={productList} total={total} onChange={(page) => setPage(page)}/>
        <ShopModuleGroup
          title="服务分组"
          createBtnText="新建服务"
          onClose={() => setVisible(false)}
          visible={visible}
          save={() => { console.log('保存') }}
        />
        <CategoryBox/>
      </div>
    )
  } else {
    containerComponent = <ModuleEmpty type={ShopModuleType.product}/>
  }
  return (<div>
      <MainTitle title="百姓网店铺"/>
      <ShopModuleTab type={ShopModuleType.product}/>
      <div className="container">
        { containerComponent }
      </div>
  </div>)
}
