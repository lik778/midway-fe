import React, { useState } from 'react';
import { Modal, Table, message } from 'antd';
import { RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ArticleSource } from '@/enums'
import { deleteArticleApi } from '@/api/shop';
import { auditStatusText, ArticleSourceText } from '@/constants';

interface Props {
  dataSource: any[];
  total: number;
  openEditForm(item: any): void;
  update(list: any): void;
  onChange(page: number): void;
}

export default (props: Props) => {
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
  const [actionId, setActionId] = useState(0);
  const { onChange, total, dataSource, update, openEditForm } = props
  // 获取店铺id
  const params: RouteParams = useParams();
  const editAction = (item: any) => {
    setActionId(item.id)
    openEditForm(item)
  }

  const deleteAction = (id: number) => {
    setActionId(id)
    setVisibleDeleteDialog(true)
  }
  const confirmDelete = async () => {
    const res  = await deleteArticleApi(Number(params.id), { id: actionId })
    if (res.success) {
      message.success(res.message);
      // 动态
      const deleteIndex = dataSource.findIndex(x => x.id === actionId)
      dataSource.splice(deleteIndex, 1)
      update(dataSource)
      setVisibleDeleteDialog(false)
    } else {
      message.warning(res.message);
    }
  }

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '文章标题', dataIndex: 'name', key: 'name' },
    { title: '文章分组', dataIndex: 'cateName', key: 'cateName' },
    { title: '发文来源', dataIndex: 'source', key: 'source',
      render: (text: string) => <span style={{
        color: Number(text) ===ArticleSource.AI ? '#FF8D19' : '' }}>{ ArticleSourceText[text] }</span>  },
    { title: '审核结果', dataIndex: 'status', key: 'status',
      render: (text: string) => <span>{ auditStatusText[text] }</span>},
    { title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: any) => (
        <div>
          <span onClick={() => editAction(record)} className="action-btn">修改</span>
          <span onClick={() => deleteAction(record.id)} className="action-btn">删除</span>
        </div>)
    },
  ];

  return (
    <div>
      <Modal title={<span style={{ color: '#F1492C' }}>确认删除</span>}
             onCancel={() => setVisibleDeleteDialog(false)}
             onOk={() => confirmDelete()}
             visible={visibleDeleteDialog}>
        <p>删除后无法恢复，确认删除？</p>
      </Modal>
      <Table columns={columns}  dataSource={dataSource} pagination={{
        onChange, total, hideOnSinglePage: dataSource.length < 10, position: ['bottomCenter']}} />
    </div>)
}
