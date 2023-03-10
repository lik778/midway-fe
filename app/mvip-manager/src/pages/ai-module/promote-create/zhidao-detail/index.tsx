import React, { useEffect, useState } from 'react'
import { TableColumnProps, Table, Spin, Tooltip, Button } from 'antd'
import { useHistory, useParams } from "umi";
import MainTitle from '@/components/main-title';
import { EditQuestion, QuestionListItem, } from '@/interfaces/ai-module'
import { getQuestionTaskDetailApi, getQuestionListApi, editQuestionApi, submitTaskApi, cancalTaskApi } from '@/api/ai-module'
import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less'
import EditableRow from './components/editable/row'
import EditableCell from './components/editable/cell'
import EditableExpandable from './components/expandable'
import { ZhidaoAiTaskQuestionStatusText } from '@/constants/ai-module'
import { ZhidaoAiTaskQuestionStatus } from '@/enums/ai-module'
import MyModal, { ModalType } from '@/components/modal';
import { mockData } from '@/utils/index'
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'


const AiZhidaoDetail = (props: any) => {
  const history = useHistory<{ query: { pageType: 'see' | 'edit', id: string } }>()
  // @ts-ignore
  // 这里是history.location的类型定义里没有query字段
  const { pageType, id } = history.location.query

  const [dataList, setDataList] = useState<QuestionListItem[]>([]);
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const columsEdit: TableColumnProps<QuestionListItem>[] = [
    {
      title: '序号', dataIndex: 'index',
      width: 100,
      render: (text: number, record: QuestionListItem, index: number) => {
        return <span data-id={record.id}>{text}</span>
      }
    },
    {
      title: '问答标题',
      dataIndex: 'question',
      onCell: (record: QuestionListItem) => ({
        record,
        editable: pageType === 'edit',
        dataIndex: 'question',
        title: '问答标题',
        upDataLoading,
        handleSave: (row: QuestionListItem) => handleSave({ questionId: row.id, content: row.question }, row),
      }),
    },
  ]

  const columsSee: TableColumnProps<QuestionListItem>[] = [{
    title: '序号', dataIndex: 'index',
    width: 100,
    render: (text: number, record: QuestionListItem, index: number) => {
      return <span data-id={record.id}>{text}</span>
    }
  },
  {
    title: '问答标题',
    dataIndex: 'question',
    onCell: (record: QuestionListItem) => ({
      record,
      editable: pageType === 'edit',
      dataIndex: 'question',
      title: '问答标题',
      upDataLoading,
      handleSave: (row: QuestionListItem) => handleSave({ questionId: row.id, content: row.question }, row),
      detailUrl: record.status === ZhidaoAiTaskQuestionStatus.DONE ? record.url : ''
    }),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 200,
    render: (text: number, record: QuestionListItem, index: number) => {
      if (text === ZhidaoAiTaskQuestionStatus.DONE) {
        // 已发出
        return <div className={styles['question-status-1']}>{
          ZhidaoAiTaskQuestionStatusText[text]
        }</div>
      } else if (text === ZhidaoAiTaskQuestionStatus.REJECT) {
        // 审核驳回
        return (
          <Tooltip title={record.tip} overlayStyle={{ width: '150px' }}>
            <div className={styles['question-status-2']}>{
              ZhidaoAiTaskQuestionStatusText[text]
            }</div>
            <div className={styles['question-status-2-tip']}>{record.tip}</div>
          </Tooltip>
        )
      } else {
        return <div className={styles['question-status-0']}>{
          ZhidaoAiTaskQuestionStatusText[text]
        }</div>
      }
    }
  }]


  const getData = async () => {
    setGetDataLoading(true)
    const res = await (pageType === 'edit' ? getQuestionListApi : getQuestionTaskDetailApi)(Number(id))
    if (res.success) {
      // 这里是为了处理测试提出的bug
      if (!res.data || res.data.length === 0) {
        history.replace('/ai-module/promote-create/zhidao-create')
        return
      }
      setDataList(res.data.map((item, index) => ({
        index: index + 1,
        ...item
      })))
    } else {
      errorMessage(res.message || '暂无任务详情')
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getData()
    track({
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        action: 'entry-page',
        action_page: 'zhidao-task-detail',
        action_type: pageType // 当前动作产生:查看任务 | 修改任务
      }
    })
  }, [])

  // 这里传row是为了知道修改的序号
  const handleSave = async (requestData: EditQuestion, row: QuestionListItem) => {
    try {
      setUpDataLoading(true)
      const res = await editQuestionApi(requestData)
      if (res.success) {
        const index = dataList.findIndex(item => row.index === item.index);
        const item = dataList[index];
        dataList.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataList([...dataList])
      } else {
        errorMessage(res.message || '修改失败')
      }
      setUpDataLoading(false)
    } catch (e: any) {
      errorMessage(e.message || '修改失败')
      setUpDataLoading(false)
      return
    }
  };

  const submit = async () => {
    setUpDataLoading(true)
    const res = await submitTaskApi()
    if (res.success && res.data === 'true') {
      successMessage('新建任务成功')
      history.goBack()
      track({
        eventType: BXMAINSITE,
        data: {
          event_type: BXMAINSITE,
          action: 'time-end',
          action_page: 'zhidao-task-detail',
          action_type: pageType // 当前动作产生:查看任务 | 修改任务
        }
      })

    } else {
      errorMessage(res.message || '发布失败')
    }
    setUpDataLoading(false)
  }

  const cancalSubmit = async () => {
    setUpDataLoading(true)
    const res = await cancalTaskApi()
    if (res.success) {
      successMessage('撤销成功')
      history.goBack()
      track({
        eventType: BXMAINSITE,
        data: {
          event_type: BXMAINSITE,
          action: 'time-end',
          action_page: 'zhidao-task-detail',
          action_type: pageType // 当前动作产生:查看任务 | 修改任务
        }
      })
    } else {
      errorMessage(res.message || '撤销失败')
    }
    setUpDataLoading(false)
  }

  return (
    <>
      <MainTitle title='返回查看任务列表' showJumpIcon={true}></MainTitle>
      <Spin spinning={getDataLoading}>
        <div className={styles['ai-list-container']} >
          <Table components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }} columns={pageType === 'edit' ? columsEdit : columsSee} dataSource={dataList} rowKey="id"
            expandable={{
              expandedRowRender: (record, index) => <EditableExpandable record={record} upDataLoading={upDataLoading} handleSave={handleSave} editable={pageType === 'edit'}></EditableExpandable>,
              rowExpandable: record => record.answers && record.answers.length > 0,
            }}
            expandedRowClassName={() => styles['expanded-row']}
            pagination={{
              position: ["bottomLeft"]
            }}
          ></Table>
          {
            pageType === 'edit' && <>
              <Button className={styles['create-question-btn']} onClick={submit} htmlType="submit" disabled={dataList.length === 0 || upDataLoading} loading={upDataLoading}>提交发布</Button>
              <Button className={styles['cancal-btn']} onClick={() => setModalVisible(true)}>放弃</Button>
            </>
          }
        </div>
      </Spin>
      <MyModal
        title="确认放弃"
        content="放弃后本次生成的内容会全部删除，不会恢复，确认放弃？"
        type={ModalType.info}
        onCancel={() => setModalVisible(false)}
        onOk={() => cancalSubmit()}
        footer={<div>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button type="primary" disabled={upDataLoading} loading={upDataLoading} onClick={() => cancalSubmit()}>确认</Button>
        </div>}
        visible={modalVisible} />
    </>
  )
}

export default AiZhidaoDetail
