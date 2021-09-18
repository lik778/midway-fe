import React, { forwardRef, Ref, useEffect, useState, useImperativeHandle } from 'react';
import { Table, Tooltip } from 'antd';
import { useHistory, useParams } from "umi";
import Loading from '@/components/loading';
import { getQuestionTaskListApi, getQuestionTaskStatusApi, getQuotaNumApi, setTaskStatusApi } from '@/api/ai-module';
import styles from './index.less';
import { QuestionTaskListItem, GetQuotaNumRes } from '@/interfaces/ai-module';
import { useDebounce } from '@/hooks/debounce'
import { addKeyForListData, formatTime } from '@/utils';
import { warnMessage, errorMessage, successMessage } from '@/components/message';
import { TableColumnProps } from 'antd'
import { ActiveKey } from '@/pages/ai-content/ai-zhidao/index';
import { ZhidaoAiTaskStatus } from '@/enums/ai-module';
import { ZhidaoAiTaskStatusText } from '@/constants/ai-module';

interface QuotaNumInterface extends GetQuotaNumRes {
  consumeCount: number,
  buyUrl?: string
}

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
  const [quotaNum, setQuotaNum] = useState<QuotaNumInterface>({} as QuotaNumInterface)

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

  const getQuotaNum = async () => {
    const res = await getQuotaNumApi()
    if (res.success) {
      const { queryResultVo, consumeCount, buyUrl } = res.data
      setQuotaNum({
        ...queryResultVo,
        consumeCount,
        buyUrl
      })
    }
  }

  useEffect(() => {
    getQuotaNum()
  }, [])


  const getList = useDebounce(async () => {
    if (activeKey !== 'job-list') return
    setListLoading(true)
    const res = await getQuestionTaskListApi({ page, size: 10 })
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

  // 点击检查任务是否完成
  const getQuestionTaskStatus = async (id: number) => {
    if (listLoading) return
    setListLoading(true)
    const res = await getQuestionTaskStatusApi(id)
    if (res.success && res.data === 'true') {
      history.push(`/ai-content/ai-zhidao/${id}/ai-zhidao-detail?pageType=see`)
    } else {
      warnMessage('数据处理中，请稍后再试~')
    }
    setListLoading(false)
  }

  const setTaskStatus = useDebounce(async (id: number) => {
    setListLoading(true)
    const res = await setTaskStatusApi(id)
    if (res.success) {
      successMessage(res.message || '操作成功')
      getList()
    } else {
      errorMessage(res.message || '操作失败')
    }
    setListLoading(false)
  }, 500)

  const getActionBtn = (record: QuestionTaskListItem) => {
    return <Tooltip placement="top" title={ZhidaoAiTaskStatusText[record.status]} overlayStyle={{ minWidth: '60px' }}>
      <img className={styles['action-btn']} src={record.status === ZhidaoAiTaskStatus.PAUSED ? '//file.baixing.net/202101/061832d76086d8f5844d98d495f1b992.png' : '//file.baixing.net/202101/409a5ac0d04377f8468872274863f539.png'} alt="" onClick={() => setTaskStatus(record.taskId)} />
    </Tooltip>
  }

  const columns: TableColumnProps<QuestionTaskListItem>[] = [
    { title: '编号', dataIndex: 'taskId' },
    {
      title: '创建时间', dataIndex: 'createdTime', render: (text: string) => {
        return formatTime(text)
      }
    },
    { title: '预计发布数量', dataIndex: 'expectPublishedNum' },
    {
      title: '累计发布数量', dataIndex: 'publishedNum'
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', render: (text: string, record: QuestionTaskListItem) => {
        if (record.status === ZhidaoAiTaskStatus.ABORTED || record.status === ZhidaoAiTaskStatus.PAUSED) {
          return <div className={`${styles["ai-status-reject"]} ${styles[record.status === ZhidaoAiTaskStatus.ABORTED ? 'aborted' : 'pause']}`}>
            <div className={styles["status"]}>{ZhidaoAiTaskStatusText[text]}</div>
            {record.memo && <Tooltip placement="bottom" title={record.memo} >
              <span className={styles["reason"]}>{`${record.memo.substring(0, 6)}${record.memo.length > 6 ? '...' : ''} `}</span>
            </Tooltip>}
          </div>
        } else {
          return <span>{ZhidaoAiTaskStatusText[text]}</span>
        }
      }
    },
    {
      title: '操作', dataIndex: 'action', render: (text: any, record: QuestionTaskListItem) => {
        return <>
          <div className={styles['list-action-btn-box']}>
            {
              (record.status === ZhidaoAiTaskStatus.ACTIVE || record.status === ZhidaoAiTaskStatus.PAUSED) && getActionBtn(record)
            }
          </div>
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => getQuestionTaskStatus(record.taskId)}>查看详情</span>
        </>
      }
    },
  ];

  // 修改分页后也修改url
  const changePage = (page: number) => {
    setPage(page)
    replaceUrl(page)
  }

  const isLoding = aiList === null
  return (
    <>
      <div className={styles["ai-list-container"]}>
        {isLoding && listLoading && <Loading />}
        <div className={styles["ai-quota-tip"]}>当前AI剩余问答量：<span className={styles["num"]}>{quotaNum.aiRemain || 0}&nbsp;</span>个（每个问答消耗&nbsp;{quotaNum.consumeCount || 0}&nbsp;个信息发布点，当前剩余信息发布点：<span className={styles["num"]}>{quotaNum.remain || 0}</span>{quotaNum.buyUrl ? <> ，<a href={quotaNum.buyUrl} target="_blank">去充值</a></> : ''}）</div>
        {total === 0 && !listLoading && <div className={styles["empty-info"]}>
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