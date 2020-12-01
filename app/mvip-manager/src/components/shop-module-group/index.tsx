import React from 'react';
import { Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';

interface Props {
  title: string;
  createBtnText: string;
  visible: boolean;
  create?(): void;
  save?(): void;
  editGroup?(): void;
  deleteGroup?(): void;
  onClose?(): void;
}


export default (props: Props) => {
  // 弹窗显示隐藏
  const hasData = true
  const data = hasData ? [{ id: 1, groupName: '保姆'}, { id: 2, groupName: '月嫂'}] : [];
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
              { Boolean(data.length) && data.map(x => {
                return (
                  <div className='group-item' key={x.groupName}>
                    <span className="name">{x.groupName}</span>
                    <div className="action">
                      <span onClick={props.editGroup}>编辑</span>
                      <span onClick={props.deleteGroup}>删除</span>
                    </div>
                  </div>
                )
              }) }
            </div>
          { Boolean(data.length) && <Button className='save-btn' onClick={props.save} size="large" type="primary">保存</Button> }
        </div>
    </Drawer>)
}
