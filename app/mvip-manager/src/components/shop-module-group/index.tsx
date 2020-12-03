import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupModal from '@/components/group-modal'
import './index.less';
import { ContentCateType } from '@/enums';

interface Props {
  type: ContentCateType,
  title: string;
  createBtnText: string;
  visible: boolean;
  cateList: any;
  save?(): void;
  onClose?(): void;
}


export default (props: Props) => {
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const { cateList, type } = props
  const hasData = cateList && cateList.length

  const editGroupItem = (id: number) => {
    console.log('编辑')
  }
  const deleteGroupItem = (id: number) => {
    console.log('删除')
  }
  return (
    <Drawer
      title={props.title}
      closable={true}
      visible={props.visible}
      onClose={props.onClose}
      width="700">
        <div>
            <div style={{ overflow: 'hidden' }}>
              <Button style={{ float: 'right' }} onClick={() => setGroupModalVisible(true) }
                icon={<PlusOutlined />} size="large" type="primary">{props.createBtnText}</Button>
            </div>
            <div className='group-list'>
              { Boolean(hasData) && cateList.map((x: any) => {
                return (
                  <div className='group-item' key={x.name}>
                    <span className="name">{x.name}</span>
                    <div className="action">
                      <span onClick={() => editGroupItem(x.id)}>编辑</span>
                      <span onClick={() => deleteGroupItem(x.id)}>删除</span>
                    </div>
                  </div>
                )
              }) }
            </div>
          { Boolean(hasData) && <Button className='save-btn' onClick={props.save} size="large" type="primary">保存</Button> }
          <GroupModal isModalVisible={groupModalVisible} onCancel={() => setGroupModalVisible(false)}/>
        </div>
    </Drawer>)
}
