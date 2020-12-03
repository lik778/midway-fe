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

// tips: 后续，nav组件可以直接抽出来一个公共的
export default (props: Props) => {
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
          <Option key='全部' value={0}>全部</Option>
          {
            cateList.length && cateList.map((item: CateItem) => {
              return (<Option key={item.name} value={item.id}>{item.name}</Option>)
            })
          }
        </Select>
      </div>
      <div style={{ float: 'right' }}>
        <Button onClick={props.showGroup} size="large" style={{ marginRight: 36 }}>服务分组</Button>
        <Button onClick={props.showCreate} icon={<PlusOutlined />} size="large" type="primary">新建服务</Button>
      </div>
    </div>
  )
}
