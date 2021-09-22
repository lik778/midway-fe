import React, { FC, useEffect, useState, useContext } from 'react';
import { Table, Tooltip, TableColumnProps, Button } from 'antd';
import { Link, useHistory } from "umi";
import { getQuestionTaskListApi, getQuestionTaskStatusApi, getQuotaNumApi, setTaskStatusApi } from '@/api/ai-module';
import styles from '../../index.less';
import zhidaoStyles from './index.less';
import { QuestionTaskListItem, GetQuotaNumRes, CollectionListItem } from '@/interfaces/ai-module';
import { useDebounce } from '@/hooks/debounce'
import { addKeyForListData, formatTime } from '@/utils';
import { warnMessage, errorMessage, successMessage } from '@/components/message';
import { ZhidaoAiTaskStatus } from '@/enums/ai-module';
import { ZhidaoAiTaskStatusText } from '@/constants/ai-module';
import AiModuleContext from '../../../context'


interface QuotaNumInterface extends GetQuotaNumRes {
  consumeCount: number,
  buyUrl?: string
}

const Zhidao: FC = () => {
  const history = useHistory()
  const { activeModuleKey, pageInfo, handleChangeContextData } = useContext(AiModuleContext)
  const { zhidao: { page, dataTotal } } = pageInfo
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<QuestionTaskListItem[]>([])
  const [quotaNum, setQuotaNum] = useState<QuotaNumInterface>({} as QuotaNumInterface)

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


  const getList = useDebounce(async () => {
    setGetDataLoading(true)
    const res = await getQuestionTaskListApi({ page, size: 10 })
    if (res.success) {
      setDataList(addKeyForListData(res.data.result || [], page))
      if (dataTotal !== res.data.totalRecord || 0) {
        handleChangeContextData({
          pageInfo: {
            ...pageInfo,
            [activeModuleKey]: {
              page,
              dataTotal: res.data.totalRecord || 0
            }
          }
        })
      }
    } else {
      errorMessage(res.message || '暂无进行的任务，你可以去新建任务')
    }
    setGetDataLoading(false)
  }, 100)


  useEffect(() => {
    getQuotaNum()
    getList()
  }, [])


  const setTaskStatus = useDebounce(async (id: number) => {
    setGetDataLoading(true)
    const res = await setTaskStatusApi(id)
    if (res.success) {
      successMessage(res.message || '操作成功')
      getList()
    } else {
      errorMessage(res.message || '操作失败')
    }
    setGetDataLoading(false)
  }, 500)

  // 点击检查任务是否完成
  const getQuestionTaskStatus = async (id: number) => {
    if (getDataLoading) return
    setGetDataLoading(true)
    const res = await getQuestionTaskStatusApi(id)
    if (res.success && res.data === 'true') {
      history.push(`/ai-module/zhidao-detail?pageType=see&&id=${id}`)
    } else {
      warnMessage('数据处理中，请稍后再试~')
    }
    setGetDataLoading(false)
  }

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
          return <div className={`${zhidaoStyles["ai-status-reject"]} ${zhidaoStyles[record.status === ZhidaoAiTaskStatus.ABORTED ? 'aborted' : 'pause']}`}>
            <div className={zhidaoStyles["status"]}>{ZhidaoAiTaskStatusText[text]}</div>
            {record.memo && <Tooltip placement="bottom" title={record.memo} >
              <span className={zhidaoStyles["reason"]}>{`${record.memo.substring(0, 6)}${record.memo.length > 6 ? '...' : ''} `}</span>
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
    handleChangeContextData({
      pageInfo: {
        ...pageInfo,
        [activeModuleKey]: {
          page,
          dataTotal: dataTotal
        }
      }
    })
  }

  
  const handleClickA = (url: string) => {
    window.open(url, '_blank')
  }

  return <>
    <div className={styles['container-container']}>
      <div className={styles['page-action-btn-line']}>
        <Link className={`${styles['action-btn']} ${styles['create-action-btn']}`} to={'/ai-module/zhidao-create'}>+AI批量创建推广</Link>
        <Link className={styles['action-btn']} to={'/ai-module/zhidao-basic-material'}>基础素材</Link>
        {/* TODO; */}
        <Button className={styles['action-btn']} onClick={()=>handleClickA('https://www.baixing.com/vip/manager/service/12/enterpriseQA/release')}>手动发布</Button>
      </div>

      <p className={styles['page-tip']}>当前AI剩余问答量：<span className={styles["num"]}>{quotaNum.aiRemain || 0}&nbsp;</span>个（每个问答消耗&nbsp;{quotaNum.consumeCount || 0}&nbsp;个信息发布点，当前剩余信息发布点：<span className={styles["num"]}>{quotaNum.remain || 0}</span>{quotaNum.buyUrl ? <> ，<a href={quotaNum.buyUrl} target="_blank">去充值</a></> : ''}）</p>

      {
        dataTotal === 0 && !getDataLoading && <div className={styles["empty-info"]}>
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>暂无进行的任务，你可以去新建任务</p>
        </div>
      }
      {
        dataTotal > 0 && <Table className={styles['table']} rowKey="key" columns={columns} loading={getDataLoading} dataSource={dataList || []} pagination={{
          onChange: changePage,
          current: page,
          total: dataTotal,
          showSizeChanger: false,
          pageSize: 10,
          position: ['bottomCenter']
        }} />
      }
    </div>
  </>
}

export default Zhidao