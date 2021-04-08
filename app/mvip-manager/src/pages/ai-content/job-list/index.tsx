import React, { useCallback, useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { Link } from 'umi';
import MainTitle from '@/components/main-title';
import Loading from '@/components/loading';
import AiEditModal from '@/pages/ai-content/job-list/components/ai-edit-modal';
import AiChooseModal from '@/pages/ai-content/job-list/components/ai-choose-modal';
import AiPackageModal from '@/pages/ai-content/job-list/components/ai-package-modal';
import { getAiListApi, pauseAiTaskApi, startAiTaskApi } from '@/api/ai-content';
import './index.less';
import { AiContentItem } from '@/interfaces/ai-content';
import { addKeyForListData, formatTime, mockData } from '@/utils';
import { errorMessage } from '@/components/message';
import { AiTaskAction, AiTaskStatus } from '@/enums';
import { AiTaskStatusText } from '@/constants';

export default (props: any) => {
  const [aiEditModalVisible, setAiEditModalVisible] = useState<boolean>(false);
  const [aiChooseModalVisible, setAiChooseModalVisible] = useState<boolean>(false);
  const [aiPackageModalVisible, setAiPackageModalVisible] = useState<boolean>(false);
  const [editAiTask, setEditAiTask] = useState<AiContentItem | null>(null);
  const [page, setPage] = useState<number>(1);
  const [aiList, setAiList] = useState<AiContentItem[] | null>(null);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<any>(null);
  const [viewtaskId, setViewTaskId] = useState<number | null>(null)
  const [chooseTaskId, setChooseTaskId] = useState<number | null>(null)

  useEffect(() => {
    getList()
  }, [page])

  const getList = async () => {
    setListLoading(true)
    const res = await getAiListApi({ page, size: 10 })
    if (res.success) {
      setAiList(addKeyForListData(res.data.result || [], page))
      setTotal(res.data.totalRecord)
    } else {
      errorMessage(res.message)
    }
    setListLoading(false)
  }

  const setAiListStatus = (id: number, status: AiTaskStatus) => {
    if (!aiList || aiList.length === 0) return
    const item = aiList.find(x => x.id === id)
    if (item) item.status = status
    setAiList([...aiList])
  }

  const changeAiTaskStatus = async (action: string, record: AiContentItem) => {
    const id = record.id;
    if (action === AiTaskAction.PAUSE) {
      const res = await pauseAiTaskApi(record.id)
      if (res.success) {
        setAiListStatus(id, AiTaskStatus.ON_PAUSE)
      } else {
        errorMessage(res.message)
      }
    } else if (action === AiTaskAction.START) {
      const res = await startAiTaskApi(record.id)
      if (res.success) {
        setAiListStatus(id, AiTaskStatus.ON_TASK)
      } else {
        errorMessage(res.message)
      }
    }
  }

  const viewWords = (record: AiContentItem) => {
    setEditAiTask(record)
    setAiEditModalVisible(true)

  }

  const chooseWords = (record: number) => {
    setChooseTaskId(record)
    setAiChooseModalVisible(true)
  }

  const viewPackage = (record: number) => {
    setViewTaskId(record)
    setAiPackageModalVisible(true)
  }

  const viewWordsBtn = (record: AiContentItem, text = '词组') => {
    return <span onClick={() => viewWords(record)} style={{marginLeft: 40}}>{text}</span>
  }

  const viewPackageBtn = (record: number, text = '词包') => {
    return <span onClick={() => viewPackage(record)}>{text}</span>
  }

  const aiAction = (record: AiContentItem) => {
    const status = record.status
    if (status === AiTaskStatus.ON_TASK) {
      return <div className="ai-action-box">
        <Tooltip placement="top" title="开启中">
          <span onClick={() => changeAiTaskStatus(AiTaskAction.PAUSE, record)} className="ai-action ai-pause-action"></span>
        </Tooltip>
        {viewWordsBtn(record)}
        <span style={{color:'black'}}> | </span>
        {viewPackageBtn(record.id)}
      </div>
    } else if (status === AiTaskStatus.REJECT) {
      return <div className="ai-action-box">{viewWordsBtn(record, '修改')}</div>
    } else if (status === AiTaskStatus.ON_PAUSE) {
      return <div className="ai-action-box">
        <Tooltip placement="top" title="已暂停">
          <span onClick={() => changeAiTaskStatus(AiTaskAction.START, record)} className="ai-action ai-start-action" />
        </Tooltip>
        {viewWordsBtn(record)}
        <span style={{color:'black'}}> | </span>
        {viewPackageBtn(record.id)}
      </div>
    } else if (status === AiTaskStatus.ON_SELECT) {
      return <div className="ai-action-box">
        <Tooltip placement="top" title="去选词">
          <span onClick={() => chooseWords(record.id)} className="ai-action ai-choose-action" />
        </Tooltip>
        {viewWordsBtn(record)}
        </div>
    } else {
      return <div className="ai-action-box">{viewWordsBtn(record)}</div>
    }
  }

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    {
      title: '创建时间', dataIndex: 'createdTime', key: 'createdTime', render: (text: string) => {
        return formatTime(text)
      }
    },
    { title: '文章分组', dataIndex: 'contentCateName', key: 'contentCateName' },
    { title: '预计发文', dataIndex: 'topArticleNum', key: 'topArticleNum' },
    { title: '昨日发文', dataIndex: 'yesterdayArticleNum', key: 'yesterdayArticleNum' },
    {
      title: '状态', dataIndex: 'status', key: 'status', render: (text: string, record: AiContentItem) => {
        if (record.status === AiTaskStatus.REJECT) {
          return <div className="ai-status-reject">
            <span className="status">{AiTaskStatusText[Number(text)]}</span>
            {record.memo && <Tooltip placement="bottom" title={record.memo} >
              <span className="reason">{`${record.memo.substring(0, 3)}...`}</span>
            </Tooltip>}
          </div>
        } else {
          return <span style={{ color: AiTaskStatus.ON_TASK ? '#999' : '' }}>{AiTaskStatusText[Number(text)]}</span>
        }
      }
    },
    {
      title: '累计发文', dataIndex: 'articleNum', key: 'articleNum', render: (text: string, record: AiContentItem) => {
        return <div>
          <label>已发文<span style={{ color: '#096DD9' }}>{text}</span>篇</label>
          <span> | </span>
          <Link to={`/shop/${record.shopId}/article`}>
            <span className="action-btn">查看发文</span>
          </Link>
        </div>
      }
    },
    {
      title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: AiContentItem) => aiAction(record)
    },
  ];

  const isLoding = aiList === null

  return (
    <div>
      <MainTitle title="任务列表"/>
      <div className="ai-list-container">
        {isLoding && listLoading && <Loading />}
        {total === 0 && <div className="empty-info">
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>暂无进行的任务，你可以去新建任务</p>
        </div>}
        {total > 0 && <Table columns={columns} loading={listLoading} dataSource={aiList || []} pagination={{
          onChange: (page: number) => setPage(page), total, showSizeChanger: false,
          hideOnSinglePage: (aiList && aiList.length < 10) || undefined, pageSize: 10, position: ['bottomCenter']
        }} />}
      </div>
      <AiEditModal close={() => setAiEditModalVisible(false)} visible={aiEditModalVisible} editItem={editAiTask} />
      <AiChooseModal close={() => setAiChooseModalVisible(false)} visible={aiChooseModalVisible} chooseTaskId={chooseTaskId}/>
      <AiPackageModal close={() => setAiPackageModalVisible(false)} visible={aiPackageModalVisible} viewtaskId={viewtaskId}/>
    </div>
  )
}
