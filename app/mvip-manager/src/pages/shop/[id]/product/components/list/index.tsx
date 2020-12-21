import React, { useState } from 'react';
import { Modal, Table, message } from 'antd';
import { deleteProductApi } from '@/api/shop';
import { RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { auditStatusText } from '@/constants';

interface Props {
  dataSource: any[];
  total: number;
  page: number;
  loading: boolean;
  openEditForm(item: any): void;
  onChange(page: number): void;
}

const styles = {
  cover: {}
}

export default (props: Props) => {
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
  const [actionId, setActionId] = useState(0);
  const { onChange, total, page, loading, dataSource, openEditForm } = props
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
      const res  = await deleteProductApi(Number(params.id), { id: actionId })
      if (res?.success) {
        message.success(res.message);
        location.reload()
      } else {
        message.warning(res.message);
      }
  }
  const columns = [
    { title: '序号', dataIndex: 'key', key: 'key' },
    { title: '封面', dataIndex: 'headImg', key: 'headImg', render: (text: string) => {
        return (
          <div style={{ width: 60, height: 40, textAlign: 'center', overflow: 'hidden', backgroundColor: '#f0f2f5'}}>
            <img   height={40} src={`${text ? text : '//file.baixing.net/202011/722f557a62889f098f7843fd3481e22b.png'}`} alt="" />
          </div>
        )
      }},
    { title: '服务名称', dataIndex: 'name', key: 'name' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    { title: '服务分组', dataIndex: 'cateName', key: 'cateName' },
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
      <Table columns={columns} loading={loading} dataSource={dataSource} pagination={{
        showSizeChanger: false,  current: page, onChange, total, hideOnSinglePage: dataSource.length < 10, position: ['bottomCenter']}} />
    </div>)
}
