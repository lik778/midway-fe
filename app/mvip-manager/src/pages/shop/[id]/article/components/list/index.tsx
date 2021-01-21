import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import { RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ArticleSource, AuditStatus } from '@/enums';
import Loading from '@/components/loading';
import { deleteArticleApi } from '@/api/shop';
import { auditStatusText, ArticleSourceText } from '@/constants';
import { errorMessage, successMessage } from '@/components/message';

interface Props {
  dataSource: any[];
  page: number;
  total: number | null
  loading: boolean;
  openEditForm(item: any): void;
  onChange(page: number): void;
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
    const res  = await deleteArticleApi(Number(params.id), { id: actionId })
    if (res.success) {
      successMessage(res.message);
      location.reload()
    } else {
      errorMessage(res.message);
    }
  }

  const columns = [
    { title: '序号', dataIndex: 'key', key: 'key' },
    { title: '文章标题', dataIndex: 'name', key: 'name',
      render: (text: string, record: any) => <a className="article-action-btn" href={record.urlSuffix} target="_blank">{text}</a>
    },
    { title: '文章分组', dataIndex: 'cateName', key: 'cateName' },
    { title: '发文来源', dataIndex: 'source', key: 'source',
      render: (text: string) => <span style={{
        color: Number(text) ===ArticleSource.AI ? '#FF8D19' : '' }}>{ ArticleSourceText[text] }</span>  },
    { title: '审核结果', dataIndex: 'status', key: 'status',
      render: (text: AuditStatus) => {
        return <span style={{  color: text === AuditStatus.APPROVE ? '#999' :
            (AuditStatus.REJECT ? '#F1492C' : '')}}>{ auditStatusText[text] }</span>
      }
    },
    { title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: any) => (
        <div>
          <span onClick={() => editAction(record)} className="article-action-btn">修改</span>
          { record.status === AuditStatus.APPROVE && <a className="article-action-btn" href={record.urlSuffix} target="_blank">查看</a> }
          <span onClick={() => deleteAction(record.id)} className="article-action-btn">删除</span>
        </div>)
    },
  ];

  return (
    <div>
      { total === null && <Loading /> }
      {
        total === 0 && <div className="no-list-data">
          <img src="//file.baixing.net/202012/de46c0eceb014b71d86c304b20224032.png"  />
          <p>暂无文章，你可以新建文章</p>
        </div>
      }
      {
        total !== null && total > 0 && <div>
          <Modal title={<span style={{ color: '#F1492C' }}>确认删除</span>}
                 onCancel={() => setVisibleDeleteDialog(false)}
                 onOk={() => confirmDelete()}
                 visible={visibleDeleteDialog}>
            <p>删除后无法恢复，确认删除？</p>
          </Modal>
          <Table columns={columns} loading={loading} dataSource={dataSource} pagination={{
            showSizeChanger: false, current: page, onChange, total: total || 0, hideOnSinglePage: dataSource.length < 10, position: ['bottomCenter']}} />
        </div>
      }
    </div>
    )
}
