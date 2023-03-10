import React, { FC, useEffect, useState, useContext } from 'react';
import { Table, Tooltip, TableColumnProps, Button } from 'antd';
import { Link, useHistory } from "umi";
import { getAiListApi, pauseAiTaskApi, startAiTaskApi } from '@/api/ai-module';
import styles from '../../index.less';
import { GetQuotaNumRes, AiContentItem } from '@/interfaces/ai-module';
import { useDebounce } from '@/hooks/debounce'
import { addKeyForListData, formatTime } from '@/utils';
import { errorMessage, } from '@/components/message';
import AiModuleContext from '../../../context'
import AiEditModal from '@/pages/ai-module/promote-create/ai-list/components/shop/components/ai-edit-modal';
import AiChooseModal from '@/pages/ai-module/promote-create/ai-list/components/shop/components/ai-choose-modal';
import AiPackageModal from '@/pages/ai-module/promote-create/ai-list/components/shop/components/ai-package-modal';
import shopStyles from './index.less';
import { AiTaskAction, AiTaskStatus } from '@/enums/ai-module';
import { AiTaskStatusText } from '@/constants/ai-module';

interface QuotaNumInterface extends GetQuotaNumRes {
  consumeCount: number,
  buyUrl?: string
}

interface Props {
  onCopy: () => void
}

const Shop: FC<Props> = (props) => {
  const { onCopy } = props
  const history = useHistory()
  const { activeModuleKey, pageInfo, handleChangeContextData } = useContext(AiModuleContext)
  const { shop: { page, dataTotal } } = pageInfo

  const [aiEditModalVisible, setAiEditModalVisible] = useState<boolean>(false);
  const [aiChooseModalVisible, setAiChooseModalVisible] = useState<boolean>(false);
  const [aiPackageModalVisible, setAiPackageModalVisible] = useState<boolean>(false);
  const [editAiTask, setEditAiTask] = useState<AiContentItem | null>(null);

  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<AiContentItem[]>([])

  const [viewtaskId, setViewTaskId] = useState<number | null>(null)
  const [chooseTaskId, setChooseTaskId] = useState<number | null>(null)



  const getList = async () => {
    setGetDataLoading(true)
    const res = await getAiListApi({ page, size: 10 })
    if (res.success) {
      setDataList(addKeyForListData(res.data.result || [], page))
      if (dataTotal !== res.data.totalRecord || 0) {
        handleChangeContextData('pageInfo', {
          ...pageInfo,
          [activeModuleKey]: {
            page,
            dataTotal: res.data.totalRecord || 0
          }
        })
      }
    } else {
      errorMessage(res.message)
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getList()
  }, [page])

  const setAiListStatus = (id: number, status: AiTaskStatus) => {
    if (!dataList || dataList.length === 0) return
    const item = dataList.find(x => x.id === id)
    if (item) item.status = status
    setDataList([...dataList])
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

  const viewWordsBtn = (record: AiContentItem, text = '??????') => {
    return <span onClick={() => viewWords(record)} style={{ marginLeft: 40 }}>{text}</span>
  }

  const viewPackageBtn = (record: number, text = '??????') => {
    return <span onClick={() => viewPackage(record)}>{text}</span>
  }


  const handleClickCopy = async (wordId: number) => {
    handleChangeContextData('copyId', wordId)
    onCopy()
  }


  const aiAction = (record: AiContentItem) => {
    const status = record.status
    if (status === AiTaskStatus.ON_TASK) {
      return <div className={shopStyles["ai-action-box"]}>
        <Tooltip placement="top" title="?????????" overlayStyle={{ minWidth: '60px' }}>
          <span onClick={() => changeAiTaskStatus(AiTaskAction.PAUSE, record)} className={`${shopStyles['ai-action']} ${shopStyles["ai-pause-action"]}`} ></span>
        </Tooltip>
        {viewWordsBtn(record)}
        <span style={{ color: 'black' }}> | </span>
        {viewPackageBtn(record.id)}
      </div>
    } else if (status === AiTaskStatus.REJECT) {
      return <div className={shopStyles["ai-action-box"]}>{viewWordsBtn(record, '??????')}</div>
    } else if (status === AiTaskStatus.ON_PAUSE) {
      return <div className={shopStyles["ai-action-box"]}>
        <Tooltip placement="top" title="?????????" overlayStyle={{ minWidth: '60px' }}>
          <span onClick={() => changeAiTaskStatus(AiTaskAction.START, record)} className={`${shopStyles['ai-action']} ${shopStyles["ai-start-action"]}`} />
        </Tooltip>
        {viewWordsBtn(record)}
        <span style={{ color: 'black' }}> | </span>
        {viewPackageBtn(record.id)}
      </div>
    } else if (status === AiTaskStatus.ON_SELECT) {
      return <div className={shopStyles["ai-action-box"]}>
        <Tooltip placement="top" title="?????????" overlayStyle={{ minWidth: '60px' }}>
          <span onClick={() => chooseWords(record.id)} className={`${shopStyles['ai-action']} ${shopStyles["ai-choose-action"]}`} />
        </Tooltip>
        {viewWordsBtn(record)}
      </div>
    } else {
      return <div className={shopStyles["ai-action-box"]}>{viewWordsBtn(record)}</div>
    }
  }

  const columns = [
    { title: '??????', dataIndex: 'id', key: 'id' },
    {
      title: '????????????', dataIndex: 'createdTime', key: 'createdTime', render: (text: string) => {
        return formatTime(text)
      }
    },
    { title: '????????????', dataIndex: 'contentCateName', key: 'contentCateName' },
    { title: '????????????', dataIndex: 'topArticleNum', key: 'topArticleNum' },
    { title: '????????????', dataIndex: 'yesterdayArticleNum', key: 'yesterdayArticleNum' },
    {
      title: '??????', dataIndex: 'status', key: 'status', render: (text: string, record: AiContentItem) => {
        if (record.status === AiTaskStatus.REJECT) {
          return <div className={shopStyles["ai-status-reject"]}>
            <span className={shopStyles["status"]}>{AiTaskStatusText[Number(text)]}</span>
            {record.memo && <Tooltip placement="bottom" title={record.memo} >
              <span className={shopStyles["reason"]}>{`${record.memo.substring(0, 3)}...`}</span>
            </Tooltip>}
          </div>
        } else {
          return <span style={{ color: AiTaskStatus.ON_TASK ? '#999' : '' }}>{AiTaskStatusText[Number(text)]}</span>
        }
      }
    },
    {
      title: '????????????', dataIndex: 'articleNum', key: 'articleNum', render: (text: string, record: AiContentItem) => {
        return <div>
          <label>?????????<span style={{ color: '#096DD9' }}>{text}</span>???</label>
          <span> | </span>
          <Link to={`/shop/${record.shopId}/article`}>
            <span>????????????</span>
          </Link>
        </div>
      }
    },
    {
      title: '??????', dataIndex: '', key: 'x',
      render: (text: string, record: AiContentItem) => {
        return <>
          {aiAction(record)}
          {
            typeof record.wordId === 'number' && record.wordId > 0 && <div className={shopStyles["ai-action-box"]}> <span style={{ color: 'black' }}> | </span>  <span className={shopStyles['func-btn']} onClick={() => handleClickCopy(record.wordId!)}>??????</span></div>
          }
        </>
      }
    },
  ];

  // ????????????????????????url
  const changePage = (page: number) => {

    handleChangeContextData('pageInfo', {
      ...pageInfo,
      [activeModuleKey]: {
        page,
        dataTotal: dataTotal
      }
    })

  }

  const onAiEditModalSuccess = () => {
    getList()
    setAiEditModalVisible(false)
  }

  const onAiChooseModalSuccess = () => {
    getList()
    setAiChooseModalVisible(false)
  }

  return <>
    <div className={styles['container-container']}>
      <div className={styles['page-action-btn-line']}>
        <Link className={`${styles['action-btn']} ${styles['create-action-btn']}`} to={'/ai-module/promote-create/shop-create'}>+AI??????????????????</Link>
        <Link className={`${styles['action-btn']}`} to={'/management/shop'}>????????????</Link>
      </div>
      {
        dataTotal === 0 && !getDataLoading && <div className={styles["empty-info"]}>
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>????????????????????????????????????????????????</p>
        </div>
      }
      {
        dataTotal > 0 && <Table columns={columns} loading={getDataLoading} dataSource={dataList || []} pagination={{
          onChange: changePage,
          current: page,
          total: dataTotal,
          showSizeChanger: false,
          pageSize: 10,
          position: ['bottomCenter']
        }} />
      }
    </div>
    <AiEditModal close={() => setAiEditModalVisible(false)} visible={aiEditModalVisible} editItem={editAiTask} onSuccess={onAiEditModalSuccess} />
    <AiChooseModal close={() => setAiChooseModalVisible(false)} visible={aiChooseModalVisible} chooseTaskId={chooseTaskId} onSuccess={onAiChooseModalSuccess} />
    <AiPackageModal close={() => setAiPackageModalVisible(false)} visible={aiPackageModalVisible} viewtaskId={viewtaskId} />
  </>
}

export default Shop