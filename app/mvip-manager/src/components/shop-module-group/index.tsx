import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupModal from '@/components/group-modal'
import { deleteContentCateApi } from '@/api/shop';
import './index.less';
import { ContentCateType } from '@/enums';
import { RouteParams, CateItem } from '@/interfaces/shop';
import { useParams } from 'umi';
import { errorMessage, successMessage } from '@/components/message';
import MyModal from '@/components/modal';
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
  const [groupModalVisible, setGroupModalVisible] = useState<boolean>(false);
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<CateItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<CateItem | null>(null);
  const { cateList, updateCateList, type } = props
  const hasData = cateList && cateList.length
  const params: RouteParams = useParams();

  const createGroupItem = () => {
    setGroupModalVisible(true);
    setEditItem(null);
  }

  const editGroupItem = (item: any) => {
    setGroupModalVisible(true);
    setEditItem(item);
  }

  const createDeleteGroupItemModal = async (item: any) => {
    setVisibleDeleteDialog(true);
    setDeleteItem(item);
  }

  const deleteGroupItem = async () => {
    const deleteId = deleteItem?.id || 0
    const res  = await deleteContentCateApi(Number(params.id), { id: deleteId })
    if (res?.success) {
      const deleteIndex = cateList.findIndex((x: CateItem) => x.id === deleteId)
      cateList.splice(deleteIndex, 1)
      updateCateList([...cateList]);
      setVisibleDeleteDialog(false);
      successMessage(res?.message);
      location.reload()
    } else {
      errorMessage(res?.message);
    }
  }

  const deleteModalPage = () => {
    if(deleteItem?.num){
      return (<p>删除后，“{deleteItem?.name}”分类下的{deleteItem?.num}个{ type === ContentCateType.PRODUCT ?  '服务' : '文章' }会全部删除，确认删除吗</p>)
    }else{
      return (<p>删除后，“{deleteItem?.name}”分类下的{ type === ContentCateType.PRODUCT ?  '服务' : '文章' }会全部删除，确认删除吗</p>)
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
              <Button style={{ float: 'right' }} onClick={() => createGroupItem() }
                icon={<PlusOutlined />} size="large" type="primary">{props.createBtnText}</Button>
            </div>
            <div className='group-list'>
              { Boolean(hasData) && cateList.map((x: CateItem) => {
                return (
                  <div className='group-item' key={x.name}>
                    <span className="name">{x.name}</span>
                    <div className="action">
                      <span onClick={() => editGroupItem(x)}>编辑</span>
                      <span onClick={() => createDeleteGroupItemModal(x)}>删除</span>
                    </div>
                  </div>
                )
              }) }
            </div>
          <GroupModal
            type={type}
            editItem={editItem}
            visible={groupModalVisible}
            groupCreate={(item: CateItem) => updateCateList([...cateList, item])}
            groupUpdate={(item: CateItem) => {
              updateCateList(cateList.map((x: CateItem) => {
                if (x.id === item.id) { x = item }
                return x;
              }))
            }}
            onClose={() => setGroupModalVisible(false)}/>
        </div>
        <MyModal
        title="确认删除"
        content={deleteModalPage()}
        visible={visibleDeleteDialog}
        onOk={() => deleteGroupItem()}
        onCancel={() => setVisibleDeleteDialog(false)}/>
    </Drawer>)
}
