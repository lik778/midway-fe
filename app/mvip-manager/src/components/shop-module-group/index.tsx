import React from 'react';
import { Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupModal from '@/components/group-modal'
import './index.less';

interface Props {
  title: string;
  createBtnText: string;
  visible: boolean;
  cateList: any;
  create?(): void;
  save?(): void;
  editGroup?(): void;
  deleteGroup?(): void;
  onClose?(): void;
}


export default (props: Props) => {
  const { cateList } = props
  const hasData = cateList && cateList.length
  return (
    <Drawer
      title={props.title}
      closable={true}
      visible={props.visible}
      onClose={props.onClose}
      width="700">
        <div>
            <div style={{ overflow: 'hidden' }}>
              <Button style={{ float: 'right' }} onClick={props.create} icon={<PlusOutlined />} size="large" type="primary">{props.createBtnText}</Button>
            </div>
            <div className='group-list'>
              { Boolean(hasData) && cateList.map((x: any) => {
                return (
                  <div className='group-item' key={x.name}>
                    <span className="name">{x.name}</span>
                    <div className="action">
                      <span onClick={props.editGroup}>编辑</span>
                      <span onClick={props.deleteGroup}>删除</span>
                    </div>
                  </div>
                )
              }) }
            </div>
          { Boolean(hasData) && <Button className='save-btn' onClick={props.save} size="large" type="primary">保存</Button> }
          <GroupModal />
        </div>
    </Drawer>)
}
