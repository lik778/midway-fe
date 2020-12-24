import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'umi';
import MainTitle from '@/components/main-title';
import Loading from '@/components/loading';
import { getAiListApi } from '@/api/ai-content'
import './index.less';
import { AiContentItem } from '@/interfaces/ai-content';
import { addKeyForListData, formatTime } from '@/utils';
import { AiTaskStatusText } from '@/constants';
import { errorMessage } from '@/components/message';

export default (props: any) => {
  const [page, setPage] = useState<number>(1);
  const [aiList, setAiList] = useState<AiContentItem[] | null>(null);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<any>(null);
  useEffect(() => {
    (async () => {
       setListLoading(true)
       const res =  await getAiListApi({ page, size: 10 })
       if (res.success) {
         setAiList(addKeyForListData(res.data.result || [], page))
         setTotal(res.data.totalRecord)
       } else {
         errorMessage(res.message)
       }
       setListLoading(false)
    })()
  }, [page])

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime', render: (text: string) => {
        return formatTime(text)
    } },
    { title: '文章分组', dataIndex: 'contentCateName', key: 'contentCateName' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (text: string) => {
        return AiTaskStatusText[Number(text)];
    }},
    { title: '发文数量', dataIndex: 'articleNum', key: 'articleNum', render: (text: string) => {
        return <label>已发文<span style={{ color: '#096DD9' }}>{text}</span>篇</label>
    }},
    { title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: AiContentItem) => (
        <Link to={`/shop/${record.shopId}/article`}>
          <span className="action-btn">查看发文</span>
        </Link>
      )
    },
  ];

  const isLoding = aiList === null

  return (
    <div>
      <MainTitle title="任务列表"/>
      <div className="ai-list-container">
        { isLoding && <Loading />}
        { total === 0 && <div className="empty-info">
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>暂无进行的任务，你可以去新建任务</p>
        </div>}
        { total > 0 && <Table columns={columns} loading={listLoading} dataSource={aiList || []} pagination={{
          onChange:(page: number) => setPage(page), total, showSizeChanger: false,
          hideOnSinglePage: (aiList && aiList.length < 10) || undefined, pageSize: 10, position: ['bottomCenter']}} />}
      </div>
    </div>
  )
}
