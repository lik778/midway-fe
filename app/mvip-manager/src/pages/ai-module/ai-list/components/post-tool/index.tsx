import React, { FC, useContext, useEffect, useState } from 'react';
import { TableColumnProps, Button, InputNumber, Table } from 'antd'
import { formatTime } from '@/utils';
import { useDebounce } from '@/hooks/debounce'
import AiModuleContext from '../../../context'
import styles from '../../index.less'
import { errorMessage, successMessage } from '@/components/message';
import { getCollectionList, updateCollection } from '@/api/ai-module'
import { CollectionListItem } from '@/interfaces/ai-module';
import { collectionTranslateStatus, collectionText } from '@/constants/ai-module'
import { COLLECTION_STATUS } from '@/enums/ai-module'

const PostTool: FC = (props) => {
  const { activeModuleKey, pageInfo, handleChangeContextData } = useContext(AiModuleContext)
  const { postTool: { page, pageTotal } } = pageInfo
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<CollectionListItem[]>([])

  const getList = useDebounce(async () => {
    setGetDataLoading(true)
    // 因为返回信息里没有分页信息 所以还是按照原来的逻辑请求所有的
    const res = await getCollectionList({ page: 0, size: 1000 })
    console.log(res)
    if (res.success) {
      setDataList(res.data)
      handleChangeContextData({
        pageInfo: {
          ...pageInfo,
          [activeModuleKey]: {
            page,
            pageTotal: res.data.length
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

  useEffect(() => {
    console.log(activeModuleKey, pageInfo)
  })

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

  const columns: TableColumnProps<CollectionListItem>[] = [
    {
      title: '编号',
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
          maxLength={4} onBlur={(e) => { handleBlurCollectionLimit(e, 'dailyPostLimit', record) }} />
      }
    },

    {
      title: '设置最大发帖数(立即生效)',
      dataIndex: 'postLimit',
      key: 'postLimit',
      render: (text, record) => {
        const max = undefined
        return <InputNumber size="small" placeholder={max ? `最多${max}条` : '请设置'} min={1} max={max} defaultValue={text === 0 ? '' : text}
          maxLength={4} onBlur={(e) => { handleBlurCollectionLimit(e, 'dailyPostLimit', record) }} />
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
      title: '状态', dataIndex: 'status', key: 'status', render: (text: COLLECTION_STATUS, record) => {
        const statusMap = collectionTranslateStatus[text]
        return <div>
          <span style={{ color: statusMap['color'] }}>{statusMap['name']}</span>
          {status === COLLECTION_STATUS.COLLECTION_REJECT_STATUS ?
            <span style={{ display: 'block', fontSize: 12, color: statusMap['color'] }}>
              {record.message}
            </span> : ''
          }
        </div>
      }
    },
    {
      title: '操作', dataIndex: 'action', render: (text: any, record) => {
        return <>
          {/* <div className={styles['list-action-btn-box']}>
            {
              (record.status === ZhidaoAiTaskStatus.ACTIVE || record.status === ZhidaoAiTaskStatus.PAUSED) && getActionBtn(record)
            }
          </div>
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => getQuestionTaskStatus(record.taskId)}>查看详情</span> */}
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
          pageTotal: pageTotal
        }
      }
    })
  }

  return <>
    <div className={styles['container-container']}>
      <div className={styles['page-action-btn-line']}>
        <Button className={`${styles['action-btn']} ${styles['create-action-btn']}`}>+AI批量创建推广</Button>
        <Button className={styles['action-btn']}>填写基础信息</Button>
        <Button className={styles['action-btn']}>发帖通帖子列表</Button>
        <Button className={styles['action-btn']}>手动发布</Button>
      </div>
      <p className={styles['page-tip']}>发帖通是您的发帖小助手，通过发帖通添加素材包、设置发帖内容，系统将每天自动发布帖子。</p>
      <p className={styles['page-tip']}>“预估生成帖子数”是系统预估的最大可生成帖子数，会有一定误差，仅供参考</p>
      <p className={styles['page-tip']}>您已添加素材包数：<span className={styles['num']}>0</span> ；发帖通已发布当前在线帖子数：<span className={styles['num']}>7</span>;</p>
      {
        pageTotal === 0 && !getDataLoading && <div className={styles["empty-info"]}>
          <img src="//file.baixing.net/202012/a8df003f95591928fa10af0bbf904d6f.png" />
          <p>暂无进行的任务，你可以去新建任务</p>
        </div>
      }
      {
        pageTotal > 0 && <Table className={styles['table']} rowKey="id" columns={columns} loading={getDataLoading} dataSource={dataList || []} pagination={{
          onChange: changePage,
          current: page,
          total: pageTotal,
          showSizeChanger: false,
          hideOnSinglePage: (dataList && dataList.length < 10) || undefined,
          pageSize: 10,
          position: ['bottomCenter']
        }} />
      }
    </div>

  </>
}

export default PostTool