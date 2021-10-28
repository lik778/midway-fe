import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, TableColumnProps, Table, Button } from 'antd'
import { useHistory } from 'umi';
import { CollectionCreateTitleParmas, CollectionPreviewTitleListItem } from '@/interfaces/ai-module';
import { getCollectionTitles, deleteCollectionTitle, deleteCollectionTitles } from '@/api/ai-module'
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import { createCollectionTitles } from '@/api/ai-module'
interface Props {
  action: 'see' | 'edit',
  page: 'formPage' | 'titlePage'
  editDataList?: CollectionCreateTitleParmas[],
  taskId: number,
  visible: boolean,
  onCancel: (visible: boolean) => void,
  onOk?: () => void
}

const PostPreviewTitle: FC<Props> = (props) => {
  const history = useHistory()
  const { page, action, editDataList, taskId, visible, onCancel, onOk } = props
  const [seeDataList, setSeeDataList] = useState<CollectionPreviewTitleListItem[]>([])
  const [localEditDataList, setLocalEditDataList] = useState<CollectionCreateTitleParmas[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [delIds, setDelIds] = useState<string[] | number[]>([])
  const delKeyMap = useRef<{ [key: string]: boolean }>({})
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

  useEffect(() => {
    if (action === 'see' || (page === 'formPage' && action === 'edit')) {
      getTaskTitle()
    }
  }, [])

  const handleClickDel = useCallback(async (record: CollectionCreateTitleParmas | CollectionPreviewTitleListItem, index: number) => {
    if (page === 'titlePage') {
      const newLocalEditDataList = [...localEditDataList]
      newLocalEditDataList.splice(index, 1)
      setLocalEditDataList(newLocalEditDataList)
      delete delKeyMap.current[record.content]
      successMessage('删除标题成功')
    } else {
      setUpDataLoading(true)
      const res = await deleteCollectionTitle({ id: (record as CollectionPreviewTitleListItem).id })
      if (res.success) {
        setSeeDataList(seeDataList.filter(item => item.id !== (record as CollectionPreviewTitleListItem).id))
        delete delKeyMap.current[(record as CollectionPreviewTitleListItem).id]
        successMessage('删除标题成功')
      }
      setUpDataLoading(false)
    }
  }, [localEditDataList, seeDataList])

  const handleClickDels = async () => {
    if (delIds.length === 0) {
      errorMessage('请选择需要删除的标题')
      return
    }
    if (page === 'titlePage') {
      setLocalEditDataList(localEditDataList.filter(item => !delKeyMap.current[item.content]))
      successMessage('删除标题成功')
      setDelIds([])
      delKeyMap.current = {}
    } else {
      setUpDataLoading(true)
      const res = await deleteCollectionTitles({ ids: delIds as number[] })
      if (res.success) {
        setSeeDataList(seeDataList.filter(item => !delKeyMap.current[item.id]))
        successMessage('删除标题成功')
        setDelIds([])
        delKeyMap.current = {}
      } else {
        errorMessage(res.message)
      }
      setUpDataLoading(false)
    }

  }

  const seeColumns: TableColumnProps<CollectionPreviewTitleListItem>[] = [
    {
      title: '编号',
      width: 80,
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

  const editColumns: TableColumnProps<CollectionCreateTitleParmas>[] = [
    {
      title: '编号',
      width: 80,
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
      const config = {
        columns: editColumns,
        rowSelection: {
          selectedRowKeys: delIds,
          // hideSelectAll: true,
          selections: undefined,
          onChange: (selectedRowKeys: any[], selectedRows: CollectionCreateTitleParmas[]) => {
            setDelIds(selectedRowKeys)
          },
          onSelect: (record: CollectionCreateTitleParmas | CollectionPreviewTitleListItem, selected: boolean) => {
            if (page === 'formPage') {
              // 用来删除行
              delKeyMap.current[(record as CollectionPreviewTitleListItem).id] = selected
            } else if (page === 'titlePage') {
              // 用来删除行
              delKeyMap.current[record.content] = selected
            }
          },
          onSelectAll: (selected: boolean, selectedRows: CollectionCreateTitleParmas[] | CollectionPreviewTitleListItem[], changeRows: CollectionCreateTitleParmas[] | CollectionPreviewTitleListItem[]) => {
            if (selected) {
              if (page === 'formPage') {
                seeDataList.forEach(item => {
                  delKeyMap.current[(item as CollectionPreviewTitleListItem).id] = selected
                })
              } else if (page === 'titlePage') {
                localEditDataList.forEach(item => {
                  delKeyMap.current[item.content] = selected
                })
              }
            } else {
              delKeyMap.current = {}
            }
          },
          onSelectNone: () => {
            delKeyMap.current = {}
          }
        }
      }
      if (page === 'formPage') {
        return {
          ...config,
          rowKey: 'id',
          dataList: seeDataList || []
        }
      } else {
        return {
          ...config,
          rowKey: 'content',
          dataList: localEditDataList
        }
      }
    }
  }, [localEditDataList, seeDataList, delIds, page])

  const handleClickOk = async () => {
    setUpDataLoading(true)
    const res = await createCollectionTitles({
      id: taskId,
      data: JSON.stringify(localEditDataList)
    })
    setUpDataLoading(false)
    if (res.success) {
      successMessage('生成标题成功')
      onOk && onOk()
      setTimeout(() => {
        history.goBack()
      }, 1500)
    } else {
      errorMessage(res.message, 2)
    }
  }

  return <Modal
    title={<div className={styles['title']}>
      <span className={styles['big']}>预览标题</span>
      <span>（标题总数：</span>
      <span className={styles['blue']}>{localEditDataList.length || seeDataList?.length}</span>
      <span>）</span>
    </div>}
    centered={true}
    className={styles['preview-title-modal']}
    width={940}
    visible={visible}
    maskClosable={false}
    onCancel={() => onCancel(false)}
    footer={null}
  >

    <Table loading={getDataLoading || upDataLoading} rowKey={config.rowKey} scroll={{
      y: 420
    }} className={styles['table']} columns={config.columns as any} dataSource={config.dataList as any} pagination={false} rowSelection={config.rowSelection} />
    {
      action === 'edit' && <div className={styles['footer']}>
        <span className={styles['dels']} onClick={handleClickDels}>批量删除</span>
        {
          page === 'titlePage' && <div className={styles['buttons']}>
            <Button className={styles['cancal']} onClick={() => onCancel(false)}>取消</Button>
            <Button className={styles['ok']} disabled={upDataLoading} loading={upDataLoading} onClick={handleClickOk}>生成标题</Button>
          </div>
        }
      </div>
    }
  </Modal >
}

export default PostPreviewTitle