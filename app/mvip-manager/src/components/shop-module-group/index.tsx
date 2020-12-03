import React, { useState } from 'react';
import { Button, Drawer, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupModal from '@/components/group-modal'
import { deleteContentCateApi } from '@/api/shop';
import './index.less';
import { ContentCateType } from '@/enums';
import { RouteParams, CateItem } from '@/interfaces/shop';
import { useParams } from 'umi';

interface Props {
  type: ContentCateType,
  title: string;
  createBtnText: string;
  visible: boolean;
  cateList: any;
  updateCateList(list: any): void;
  save?(): void;
  onClose?(): void;
}


export default (props: Props) => {
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const { cateList, updateCateList, type } = props
  const hasData = cateList && cateList.length
  const params: RouteParams = useParams();

  const editGroupItem = (id: number) => {
    console.log('编辑')
  }
  const deleteGroupItem = async (id: number) => {
    const res  = await deleteContentCateApi(Number(params.id), { id })
    if (res.success) {
      const deleteIndex = cateList.findIndex((x: CateItem) => x.id === id)
      cateList.splice(deleteIndex, 1)
      updateCateList([...cateList]);
      message.success(res.message);
    } else {
      message.warning(res.message);
    }
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
              { Boolean(hasData) && cateList.map((x: CateItem) => {
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
          <GroupModal
            type={type}
            visible={groupModalVisible}
            addCateList={(item: CateItem) => updateCateList([...cateList, item])}
            updateCateList={(item: CateItem) => console.log(item)}
            onClose={() => setGroupModalVisible(false)}/>
        </div>
    </Drawer>)
}
