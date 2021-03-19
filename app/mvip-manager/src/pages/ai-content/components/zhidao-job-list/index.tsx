import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import Loading from '@/components/loading';
import { getQuestionTaskListApi } from '@/api/ai-content';
import './index.less';
import { QuestionTaskListItem } from '@/interfaces/ai-content';
import { addKeyForListData, formatTime } from '@/utils';
import { errorMessage } from '@/components/message';
import { Link } from 'umi';
import { TableColumnProps } from 'antd'
import { mockData } from '@/utils'
export default (props: any) => {
  const [page, setPage] = useState<number>(1);
  const [aiList, setAiList] = useState<QuestionTaskListItem[] | null>(null);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<any>(null);
  useEffect(() => {
    (async () => {
      setListLoading(true)
      // const res = await getQuestionTaskListApi({ page, size: 10 })
      /** 模拟数据，正式数据则解开上面的注释 */
      const res = await mockData<QuestionTaskListItem>('list', {
        id: 1,
        no: 1,
        createdTime: 1616054198,
        expect: 2, // 预期
        actual: 10 // 实际
      }, 'contentCateName', page, 10)
      if (res.success) {
        setAiList(addKeyForListData(res.data.result || [], page))
        setTotal(res.data.totalRecord)
      } else {
        errorMessage(res.message)
      }
      setListLoading(false)
    })()
  }, [page])


  const columns: TableColumnProps<QuestionTaskListItem>[] = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    {
      title: '创建时间', dataIndex: 'createdTime', key: 'createdTime', render: (text: string) => {
        return formatTime(text)
      }
    },
    { title: '预计发布数量', dataIndex: 'expect', key: 'expect' },
    {
      title: '已发布数量', dataIndex: 'actual', key: 'actual'
    },
    { title: '操作', dataIndex: '', key: 'x', render: (text: any, record: QuestionTaskListItem) => <Link to={`/ai-content/${record.id}/ai-zhidao-detail?pageType=see`}>查看详情</Link> },
  ];

  const isLoding = aiList === null

  return (
    <>
      <div className="ai-list-container">
        {isLoding && <Loading />}
        {total === 0 && <div className="empty-info">
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>暂无进行的任务，你可以去新建任务</p>
        </div>}
        {total > 0 && <Table columns={columns} loading={listLoading} dataSource={aiList || []} pagination={{
          onChange: (page: number) => setPage(page), total, showSizeChanger: false,
          hideOnSinglePage: (aiList && aiList.length < 10) || undefined, pageSize: 10, position: ['bottomCenter']
        }} />}
      </div>
    </>
  )
}
