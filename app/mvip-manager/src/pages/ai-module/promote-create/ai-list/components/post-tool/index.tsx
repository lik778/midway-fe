import React, { FC, useContext, useEffect, useState } from 'react';
import { TableColumnProps, Button, InputNumber, Table, Tooltip } from 'antd'
import { Link, useHistory } from 'umi'

import { formatTime } from '@/utils';
import { useDebounce } from '@/hooks/debounce'
import AiModuleContext from '../../../context'
import styles from '../../index.less'
import postToolstyles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import { getCollectionList, updateCollection, updateCollectionStatus, deleteCollection } from '@/api/ai-module'
import { CollectionListItem } from '@/interfaces/ai-module';
import { collectionTranslateStatus, collectionText } from '@/constants/ai-module'
import { CollectionStatus, CollectionAction } from '@/enums/ai-module'
import Tip from './components/tip'

const PostTool: FC = (props) => {
  const { activeModuleKey, pageInfo, handleChangeContextData, } = useContext(AiModuleContext)
  const { postTool: { page, dataTotal } } = pageInfo
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<CollectionListItem[]>([])


  const getList = useDebounce(async () => {
    setGetDataLoading(true)
    // 因为返回信息里没有分页信息 所以还是按照原来的逻辑请求所有的
    const res = await getCollectionList({ page: 0, size: 1000 })
    if (res.success) {
      setDataList(res.data)
      handleChangeContextData({
        pageInfo: {
          ...pageInfo,
          [activeModuleKey]: {
            page,
            dataTotal: res.data.length
          }
        }
      })
    } else {
      errorMessage(res.message || '暂无进行的任务，你可以去新建任务')
    }
    setGetDataLoading(false)
  }, 100)

  useEffect(() => {
    getList()
  }, [])

  const handleBlurCollectionLimit = async (e: React.FocusEvent<HTMLInputElement>, key: 'dailyPostLimit' | 'postLimit', record: CollectionListItem) => {
    const { value } = e.target
    const inputValue = value ? value : 'null'
    if (Number(inputValue) === Number(record[key])) return
    if (!/^([1-9]\d*)|null$/.test(inputValue)) {
      errorMessage('请输入正整数');
      return
    }
    if (key === 'dailyPostLimit' && Number(inputValue) > 50) {
      errorMessage('每天发帖数最多50条');
      return
    }
    const { id } = record
    const params = {
      id,
      [key]: value
    }
    const res = await updateCollection(params)
    if (res.success) {
      successMessage(`${record.name}素材包的${collectionText[key]}修改成功`)
    } else {
      errorMessage('请重新输入')
    }
  }

  const handleChangeCollectionAction = async (id: number, action: CollectionAction) => {
    setUpDataLoading(true)
    const res = await updateCollectionStatus({ id, action })
    successMessage('修改素材包状态成功')
    const editCollection = dataList.find(x => x.id === id)
    editCollection!.status = res.data.status
    setDataList(dataList)
    setUpDataLoading(false)
  }

  const handleClickDel = async (id: number) => {
    setUpDataLoading(true)
    const res = await deleteCollection({ id })
    successMessage('删除成功')
    setUpDataLoading(false)
    getList()
  }

  const handleClickCopy = async (copyId: number) => {
    handleChangeContextData({
      copyId,
      copyIdType: 'postTool'
    })
  }

  const columns: TableColumnProps<CollectionListItem>[] = [
    {
      title: '编号',
      width: 60,
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '素材包名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类目',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '已发布帖子数',
      dataIndex: 'adsSuccess',
      key: 'adsSuccess',
    },
    {
      title: '预估生成帖子数',
      dataIndex: 'adsTotal',
      key: 'adsTotal',
      render: (counts) => {
        return counts > 0 ? counts : ''
      }
    },
    {
      title: '设置每天发帖数(次日生效)',
      dataIndex: 'dailyPostLimit',
      key: 'dailyPostLimit',
      render: (text, record) => {
        const max = 50
        return <InputNumber size="small" placeholder={max ? `最多${max}条` : '请设置'} min={1} max={max} defaultValue={text === 0 ? '' : text}
          maxLength={4} onBlur={(e) => { handleBlurCollectionLimit(e, 'dailyPostLimit', record) }} disabled={upDataLoading} />
      }
    },

    {
      title: '设置最大发帖数(立即生效)',
      dataIndex: 'postLimit',
      key: 'postLimit',
      render: (text, record) => {
        const max = undefined
        return <InputNumber size="small" placeholder={max ? `最多${max}条` : '请设置'} min={1} max={max} defaultValue={text === 0 ? '' : text}
          maxLength={4} onBlur={(e) => { handleBlurCollectionLimit(e, 'dailyPostLimit', record) }} disabled={upDataLoading} />
      }
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time) => {
        return time && formatTime(time, 'YYYY-MM-DD HH:mm')
      }
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', render: (text: CollectionStatus, record) => {
        const statusMap = collectionTranslateStatus[text]
        return <div>
          <span style={{ color: statusMap['color'] }}>{statusMap['name']}</span>
          {status === CollectionStatus.COLLECTION_REJECT_STATUS ?
            <span style={{ display: 'block', fontSize: 12, color: statusMap['color'] }}>
              {record.message}
            </span> : ''
          }
        </div>
      }
    },
    {
      title: '操作', dataIndex: 'action', width: 200, render: (text: any, record) => {

        return <>
          {/* 暂停 */}
          {
            record.status === CollectionStatus.COLLECTION_PUBLISH_STATUS && <div className={postToolstyles['list-action-btn-box']}>
              <img className={postToolstyles['table-action-btn']} src='//file.baixing.net/202101/409a5ac0d04377f8468872274863f539.png' alt="" onClick={() => handleChangeCollectionAction(record.id, CollectionAction.PAUSE)} />
            </div>
          }
          {/* 启动 */}
          {
            record.status === CollectionStatus.COLLECTION_PAUSED_STATUS && <div className={postToolstyles['list-action-btn-box']}>
              <img className={postToolstyles['table-action-btn']} src='//file.baixing.net/202101/061832d76086d8f5844d98d495f1b992.png' alt="" onClick={() => handleChangeCollectionAction(record.id, CollectionAction.AUDIT)} />
            </div>
          }
          {/* 查看 */}
          {

            ([CollectionStatus.COLLECTION_PUBLISH_STATUS, CollectionStatus.COLLECTION_FINISHED_STATUS, CollectionStatus.COLLECTION_PENDING_STATUS, CollectionStatus.COLLECTION_PAUSED_STATUS]).includes(record.status) && <Link className={postToolstyles['func-btn']} to={`/ai-module/promote-create/post-create?id=${record.id}`}>查看</Link>
          }
          {/* 编辑 */}
          {
            ([CollectionStatus.COLLECTION_DRAFT_STATUS, CollectionStatus.COLLECTION_REJECT_STATUS].includes(record.status)) && <Link className={postToolstyles['func-btn']} to={`/ai-module/promote-create/post-create?id=${record.id}`}>编辑</Link>
          }
          {/* 复制 */}
          {
            record.copyId && <span className={postToolstyles['func-btn']} onClick={() => handleClickCopy(record.copyId!)}>复制</span>
          }
          {/* 删除 */}
          {
            [CollectionStatus.COLLECTION_DRAFT_STATUS, CollectionStatus.COLLECTION_REJECT_STATUS, CollectionStatus.COLLECTION_PAUSED_STATUS].includes(record.status) && <span className={postToolstyles['func-btn']} onClick={() => handleClickDel(record.id)}>删除</span>
          }
        </>
      }
    },
  ];

  // 分页变化
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

  return <>
    <div className={styles['container-container']}>
      <Tip dataTotal={dataList.length}></Tip>
      {
        dataTotal === 0 && !getDataLoading && <div className={styles["empty-info"]}>
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>暂无进行的任务，你可以去新建任务</p>
        </div>
      }
      {
        dataTotal > 0 && <Table className={styles['table']} rowKey="id" columns={columns} loading={getDataLoading} dataSource={dataList || []} pagination={{
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

export default PostTool