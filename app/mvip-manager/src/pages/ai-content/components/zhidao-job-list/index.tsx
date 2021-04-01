import React, { forwardRef, Ref, useEffect, useState, useImperativeHandle } from 'react';
import { Table } from 'antd';
import { useHistory, useParams } from "umi";
import Loading from '@/components/loading';
import { getQuestionTaskListApi } from '@/api/ai-content';
import './index.less';
import { QuestionTaskListItem } from '@/interfaces/ai-content';
import { useDebounce } from '@/hooks/debounce'
import { addKeyForListData, formatTime } from '@/utils';
import { errorMessage } from '@/components/message';
import { Link } from 'umi';
import { TableColumnProps } from 'antd'
import { mockData } from '@/utils'
import { ActiveKey } from '@/pages/ai-content/ai-zhidao/index';

interface ZhidaoJobListProp {
  activeKey: ActiveKey
}

const ZhidaoJobList = (props: ZhidaoJobListProp) => {
  const { activeKey } = props
  const history = useHistory<{ query: { page?: string } }>()
  const [page, setPage] = useState<number>(1);
  const [aiList, setAiList] = useState<QuestionTaskListItem[] | null>(null);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<any>(null);

  // 给页面挂上page
  useEffect(() => {
    if (activeKey === 'job-list') {
      // @ts-ignore
      // 这里是history.location的类型定义里没有query字段
      const query = history.location.query

      // 当url上不存在page 则取组件内的
      if (!query.page || isNaN(Number(query.page))) {
        replaceUrl(page)
        getList()
      } else {
        setPage(Number(query.page))
      }
    }
  }, [activeKey])

  const replaceUrl = (page: number) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('page', `${page}`);
    history.replace(`${history.location.pathname}?${currentUrlParams.toString()}`)
  }

  const getList = useDebounce(async () => {
    if (activeKey !== 'job-list') return
    setListLoading(true)
    // TODO;
    const res = await getQuestionTaskListApi({ page, size: 10 })
    /** 模拟数据，正式数据则解开上面的注释 */
    // const res = await mockData<QuestionTaskListItem>('list', {
    //   /** 任务id 同时也是编号 */
    //   taskId: 1,
    //   /** 已发布数量 */
    //   publishedNum: 2,
    //   /** 预期发布数量 */
    //   expectNum: 4,
    //   createdTime: 1616054198,
    // }, 'taskId', page, 10)
    if (res.success) {
      setAiList(addKeyForListData(res.data.result || [], page))
      setTotal(res.data.totalRecord || 0)
    } else {
      errorMessage(res.message || '暂无进行的任务，你可以去新建任务')
    }
    setListLoading(false)
  }, 100)

  useEffect(() => {
    getList()
  }, [page])


  const columns: TableColumnProps<QuestionTaskListItem>[] = [
    { title: '编号', dataIndex: 'taskId', align: 'center' },
    {
      title: '创建时间', dataIndex: 'createdTime', align: 'center', render: (text: string) => {
        return formatTime(text)
      }
    },
    { title: '预计发布数量', dataIndex: 'expectPublishedNum', align: 'center' },
    {
      title: '已发布数量', dataIndex: 'publishedNum', align: 'center'
    },
    { title: '操作', dataIndex: 'action', align: 'center', render: (text: any, record: QuestionTaskListItem) => <Link to={`/ai-content/${record.taskId}/ai-zhidao-detail?pageType=see`}>查看详情</Link> },
  ];

  // 修改分页后也修改url
  const changePage = (page: number) => {
    setPage(page)
    replaceUrl(page)
  }

  const isLoding = aiList === null
  return (
    <>
      <div className="ai-list-container">
        {isLoding && listLoading && <Loading />}
        {total === 0 && <div className="empty-info">
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>暂无进行的任务，你可以去新建任务</p>
        </div>}
        {total > 0 && <Table columns={columns} loading={listLoading} dataSource={aiList || []} pagination={{
          onChange: changePage,
          current: page,
          total,
          showSizeChanger: false,
          hideOnSinglePage: (aiList && aiList.length < 10) || undefined,
          pageSize: 10,
          position: ['bottomCenter']
        }} />}
      </div>
    </>
  )
}

export default ZhidaoJobList