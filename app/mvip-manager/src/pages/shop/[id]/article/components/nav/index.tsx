import { Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { CateItem } from '@/interfaces/shop';
const Option = Select.Option;

interface Props {
  cateList: any[];
  onChange(cate: number): void;
  showGroup(): void;
  showCreate(): void;
}

export default (props: any) => {
  const { cateList, onChange, showGroup, showCreate} = props;
  return (
    <div className="nav-container">
      <div style={{ float: 'left' }}>
        <Select
          showSearch
          size="large"
          style={{ width: 200 }}
          placeholder="选择文章"
          optionFilterProp="children"
          onChange={onChange}
          defaultValue={0}
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          <Option key='全部' value={0}>全部</Option>
          {
            cateList.length && cateList.map((item: CateItem) => {
              return (<Option key={item.name} value={item.id || ''}>{item.name}</Option>)
            })
          }
        </Select>
      </div>
      <div style={{ float: 'right' }}>
        <Button onClick={showGroup} size="large" style={{ marginRight: 36 }}>文章分组</Button>
        <Button onClick={showCreate} icon={<PlusOutlined />} size="large" type="primary">新建文章</Button>
      </div>
    </div>
  )
}
