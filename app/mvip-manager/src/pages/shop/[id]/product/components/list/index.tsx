import React, { useState } from 'react';
import { Table, Popover } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons'
import MyModal from '@/components/modal';
import { deleteProductApi } from '@/api/shop';
import { RouteParams, ProductListItem } from '@/interfaces/shop';
import { useParams } from 'umi';
import { auditStatusText } from '@/constants';
import { errorMessage, successMessage } from '@/components/message';
import { AuditStatus } from '@/enums';
import Loading from '@/components/loading';

interface Props {
  dataSource: any[];
  total: number | null;
  page: number;
  loading: boolean;
  openEditForm(item: any): void;
  onChange(page: number): void;
  type: string;
}

const styles = {
  cover: {}
}

export default (props: Props) => {
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
  const [actionId, setActionId] = useState(0);
  const { onChange, total, page, loading, dataSource, openEditForm, type } = props
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
    const res = await deleteProductApi(Number(params.id), { id: actionId })
    if (res?.success) {
      successMessage(res.message);
      location.reload()
    } else {
      errorMessage(res.message);
    }
  }
  const columns = [
    { title: '序号', dataIndex: 'key', key: 'key' },
    {
      title: '封面', dataIndex: 'headImg', key: 'headImg', render: (text: string) => {
        return (
          <div style={{ width: 60, height: 40, textAlign: 'center', overflow: 'hidden', backgroundColor: '#f0f2f5' }}>
            <img height={40} src={`${text ? text : '//file.baixing.net/202011/722f557a62889f098f7843fd3481e22b.png'}`} alt="" />
          </div>
        )
      }
    },
    {
      title: `${type}名称`, dataIndex: 'name', key: 'name',
      render: (text: string, record: any) => <a className="article-action-btn" href={record.urlSuffix} target="_blank">{text}</a>
    },
    { title: '价格', dataIndex: 'price', key: 'price' },
    { title: `${type}分组`, dataIndex: 'cateName', key: 'cateName' },
    {
      title: '审核结果', dataIndex: 'status', key: 'status',
      render: (text: AuditStatus, record: ProductListItem) => {
        return <>
          <span style={{
            color: text === AuditStatus.APPROVE ? '#999' :
              (text === AuditStatus.REJECT ? '#F1492C' : ''),
            marginRight: 4
          }}>{auditStatusText[text]}</span>
          {
            text === AuditStatus.REJECT && <Popover trigger="hover" placement="top" title="审核信息" content={<div style={{
              maxWidth: 200
            }}>{record.memo}</div>}>
              <ExclamationCircleFilled style={{
                color: '#F1492C',
              }} />
            </Popover>
          }
        </>
      }
    },
    {
      title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: any) => (
        <div>
          <a className="article-action-btn" href={record.urlSuffix} target="_blank">查看</a>
          <span onClick={() => editAction(record)} className="action-btn">修改</span>
          <span onClick={() => deleteAction(record.id)} className="action-btn">删除</span>
        </div>)
    },
  ];

  return (
    <div>
      {total === null && <Loading />}
      {
        total === 0 && <div className="no-list-data">
          <img src="//file.baixing.net/202012/6b1ce056c5c675ec3a92e8e70fed06ed.png" />
          <p>暂无服务内容，你可以新建服务</p>
        </div>
      }
      {
        total !== null && total > 0 && <div>
          <MyModal
            title="确认删除"
            content="删除后无法恢复，确认删除？"
            onCancel={() => setVisibleDeleteDialog(false)}
            onOk={() => confirmDelete()}
            visible={visibleDeleteDialog} />
          <Table rowKey="id" columns={columns} loading={loading} dataSource={dataSource} pagination={{
            showSizeChanger: false, current: page, onChange, total: total || 0, hideOnSinglePage: dataSource.length < 10, position: ['bottomCenter']
          }} />
        </div>
      }
    </div>)
}
