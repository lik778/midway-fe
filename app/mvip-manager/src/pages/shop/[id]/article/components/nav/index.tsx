import { Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { CateItem } from '@/interfaces/shop';
import Recharge from '@/components/recharge';
const Option = Select.Option;

interface Props {
  cateList: any[];
  onChange(cate: number): void;
  showGroup(): void;
  showCreate(): void;
  shopId: number;
}

export default (props: Props) => {
  const { cateList, onChange, showGroup, showCreate, shopId} = props;
  return (
    <div>
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
            <Option key='全部' value={0}>所有文章</Option>
            {
              cateList.length && cateList.map((item: CateItem) => {
                return (<Option key={item.name} value={item.id || ''}>{item.name}</Option>)
              })
            }
          </Select>
        </div>
        <div style={{ float: 'right' }}>
          <Button onClick={showGroup} size="large" style={{ marginRight: 36 }}>文章分组</Button>
          <Button style={{ background: '#096DD9', borderColor: '#096DD9' }} onClick={showCreate} icon={<PlusOutlined />} size="large" type="primary">新建文章</Button>
        </div>
      </div>
    </div>
  )
}
