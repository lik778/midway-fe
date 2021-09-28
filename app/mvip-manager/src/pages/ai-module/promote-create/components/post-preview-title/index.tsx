import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, TableColumnProps, Table, Button } from 'antd'
import { useHistory } from 'umi';
import { CollectionCreateTitleParmas, CollectionPreviewTitleListItem } from '@/interfaces/ai-module';
import { getCollectionTitles } from '@/api/ai-module'
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import { createCollectionTitles } from '@/api/ai-module'
interface Props {
  action: 'see' | 'edit',
  editDataList?: CollectionCreateTitleParmas[],
  taskId: number,
  visible: boolean,
  onCancel: (visible: boolean) => void,
}

const PostPreviewTitle: FC<Props> = (props) => {
  const history = useHistory()
  const { action, editDataList, taskId, visible, onCancel, } = props
  const [seeDataList, setSeeDataList] = useState<CollectionPreviewTitleListItem[]>()
  const [localEditDataList, setLocalEditDataList] = useState<CollectionCreateTitleParmas[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [delIds, setDelIds] = useState<string[]>([])
  const delKeyMap = useRef<Map<string, boolean>>(new Map())
  // const 
  useEffect(() => {
    if (editDataList) {
      const editDataListFilter: { [key: string]: boolean } = {}
      setLocalEditDataList(editDataList.filter(item => {
        if (editDataListFilter[item.content]) {
          return false
        } else {
          editDataListFilter[item.content] = true
          return true
        }
      }))
    }
  }, [editDataList])

  const getTaskTitle = async () => {
    setGetDataLoading(true)
    const res = await getCollectionTitles({ id: taskId! })
    setSeeDataList(res.data)
    setGetDataLoading(false)
  }

  console.log(action)
  useEffect(() => {
    console.log('useEffect', action)
    if (action === 'see') {
      getTaskTitle()
    }
  }, [])

  const handleClickDel = useCallback((record: CollectionCreateTitleParmas, index: number) => {
    const newLocalEditDataList = [...localEditDataList]
    newLocalEditDataList.splice(index, 1)
    setLocalEditDataList(newLocalEditDataList)
    delKeyMap.current.delete(record.content)
    successMessage('删除成功')
  }, [localEditDataList])

  const handleClickDels = () => {
    setLocalEditDataList(localEditDataList.filter(item => !delKeyMap.current.get(item.content)))
    setDelIds([])
    delKeyMap.current.clear()
    successMessage('删除成功')
  }

  const seeColumns: TableColumnProps<CollectionPreviewTitleListItem>[] = [
    {
      title: '编号',
      width: 60,
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '标题',
      dataIndex: 'content',
      key: 'content'
    }
  ]

  // [
  //   {
  //     "areaName": "浦东新区",
  //     "cityName": "上海",
  //     "city_id": "m30",
  //     "content": "上海浦东新区房地产公司注册怎么办理哪家安全可靠",
  //     "coreWord": "公司注册",
  //     "modal": "哪家安全可靠",
  //     "prefix": "房地产",
  //     "suffix": "怎么办理"
  //   }
  // ]
  const editColumns: TableColumnProps<CollectionCreateTitleParmas>[] = [
    {
      title: '编号',
      width: 60,
      dataIndex: 'city_id',
      key: 'city_id',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '标题',
      dataIndex: 'content',
    },
    {
      title: '操作',
      width: 60,
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => {
        return <span className={styles['del']} onClick={() => handleClickDel(record, index)}>删除</span>
      }
    }
  ]


  const config = useMemo(() => {
    if (action === 'see') {
      return {
        rowKey: 'id',
        columns: seeColumns,
        dataList: seeDataList,
        rowSelection: undefined
      }
    } else {
      return {
        rowKey: 'content',
        columns: editColumns,
        dataList: localEditDataList,
        rowSelection: {
          selectedRowKeys: delIds,
          selections: [
            Table.SELECTION_ALL,
            // Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
          onChange: (selectedRowKeys: any[], selectedRows: CollectionCreateTitleParmas[]) => {
            console.log('onChange', selectedRows, selectedRowKeys)
            setDelIds(selectedRowKeys)
          },
          onSelect: (record: CollectionCreateTitleParmas, selected: boolean) => {
            console.log('onSelect', selected, record)
            // 用来删除行
            delKeyMap.current.set(record.content, selected)
          },
          onSelectAll: (selected: boolean, selectedRows: CollectionCreateTitleParmas[], changeRows: CollectionCreateTitleParmas[]) => {
            console.log('onSelectAll', selected, selectedRows, changeRows)
            if (selected) {
              localEditDataList.forEach(item => {
                delKeyMap.current.set(item.content, selected)
              })
            } else {
              delKeyMap.current.clear()
            }
          },
        }
      }
    }
  }, [localEditDataList, seeDataList, delIds])

  const handleClickOk = async () => {
    setUpDataLoading(true)
    const res = await createCollectionTitles({
      id: taskId,
      data: JSON.stringify(localEditDataList)
    })
    if (res.success) {
      successMessage('提交成功')
      setTimeout(() => {
        history.goBack()
      }, 1500)
    } else {
      errorMessage(res.message)
      setUpDataLoading(false)
    }
  }

  return <Modal
    title={<div className={styles['title']}>
      <span className={styles['big']}>预览标题</span>
      <span>（标题总数：</span>
      <span className={styles['blue']}>{localEditDataList.length || seeDataList?.length}</span>
      <span>）</span>
    </div>}
    className={styles['preview-title-modal']}
    width={940}
    visible={visible}
    onCancel={() => onCancel(false)}
    footer={null}
  >
    <Table rowKey={config.rowKey} scroll={{
      y: 420
    }} className={styles['table']} columns={config.columns as any} loading={getDataLoading} dataSource={config.dataList as any} pagination={false} rowSelection={config.rowSelection} />
    {
      action === 'edit' && <div className={styles['footer']}>
        <span className={styles['dels']} onClick={handleClickDels}>批量删除</span>
        <div className={styles['buttons']}>
          <Button className={styles['cancal']} onClick={() => onCancel(false)}>取消</Button>
          <Button className={styles['ok']} disabled={upDataLoading} loading={upDataLoading} onClick={handleClickOk}>生成标题</Button>
        </div>
      </div>
    }
  </Modal >
}

export default PostPreviewTitle