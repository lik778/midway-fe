import { Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { CateItem } from '@/interfaces/shop';
const Option = Select.Option;

interface Props {
  cateList: any[];
  onChange(cate: number): void;
  showGroup(): void;
  showCreate(): void;
  type: string;
}

// tips: 后续，nav组件可以直接抽出来一个公共的
export default (props: Props) => {
  const { cateList, type, onChange } = props;
  return (
    <div className="nav-container">
      <div style={{ float: 'left' }}>
        <Select
          showSearch
          size="large"
          style={{ width: 200 }}
          placeholder={`选择${type}`}
          optionFilterProp="children"
          onChange={onChange}
          defaultValue={0}
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          <Option key='全部' value={0}>所有{type}</Option>
          {
            cateList.length && cateList.map((item: CateItem) => {
              return (<Option key={item.name} value={item.id || ''}>{item.name}</Option>)
            })
          }
        </Select>
      </div>
      <div style={{ float: 'right' }}>
        <Button onClick={props.showGroup} size="large" style={{ marginRight: 36 }}>{type}分组</Button>
        <Button style={{ background: '#096DD9', borderColor: '#096DD9' }} onClick={props.showCreate} icon={<PlusOutlined />} size="large" type="primary">新建{type}</Button>
      </div>
    </div>
  )
}
