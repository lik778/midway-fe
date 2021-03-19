import React, { FC, useEffect, useState } from 'react'
import { TableColumnProps, Table, Spin, Tooltip } from 'antd'
import { useHistory, useParams } from "umi";
import MainTitle from '@/components/main-title';
import { QuestionListItem, AnswerListItem } from '@/interfaces/ai-content'
import { getQuestionTaskDetailApi, editQuestion } from '@/api/ai-content'
import { addKeyForListData, formatTime, mockData } from '@/utils';
import { errorMessage } from '@/components/message';
import styles from './index.less'
import EditableRow from './components/editable/row'
import EditableCell from './components/editable/cell'
import EditableExpandable from './components/expandable'

interface JobListDetailProp {

}

const AiZhidaoDetail: FC<JobListDetailProp> = (props) => {
  const history = useHistory<{ query: { pageType: 'see' | 'edit' } }>()
  const params = useParams<{ id: string }>()
  // @ts-ignore
  // 这里是history.location的类型定义里没有query字段
  const { pageType } = history.location.query
  const { id } = params

  const [dataList, setDataList] = useState<QuestionListItem[]>([]);
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);

  const columsEdit: TableColumnProps<QuestionListItem>[] = [
    {
      title: '序号', dataIndex: 'index',
      width: 100
    },
    {
      title: '问题标题',
      dataIndex: 'title',
      onCell: (record: QuestionListItem) => ({
        record,
        editable: pageType === 'edit',
        dataIndex: 'title',
        title: '问题标题',
        upDataLoading,
        handleSave: handleSave,
      }),
    },
  ]

  const columsSee: TableColumnProps<QuestionListItem>[] = [...columsEdit,
  {
    title: '状态',
    dataIndex: 'status',
    width: 200,
    render: (text: number, record: QuestionListItem, index: number) => {
      if (text === 0) {
        return <div className={styles['question-status-0']}>未发布</div>
      } else if (text === 1) {
        return <div className={styles['question-status-1']}>已发布</div>
      } else if (text === 2) {
        return (
          <Tooltip title={record.tip}>
            <div className={styles['question-status-2']}>发布失败</div>
            <div className={styles['question-status-2-tip']}>{record.tip}</div>
          </Tooltip>
        )
      }
    }
  }]



  const getData = async () => {
    setGetDataLoading(true)
    // const res = await getQuestionTaskDetailApi(Number(id))
    let i = 1
    const data = []
    while (i <= 200) {
      data.push({
        id: i,
        title: `这是标题${i}`,
        answer: [{
          id: 1,
          content: '这是答案1'
        }, {
          id: 2,
          content: '这是答案2'
        }, {
          id: 3,
          content: '这是答案3'
        }],
        /** 0 待审核，1 已通过，2 未通过 */
        status: 2 as 2,
        tip: `这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示${i}`
      })
      i++
    }
    const res = await mockData<QuestionListItem[]>('data', data)
    if (res.success) {
      setDataList(res.data.map((item, index) => ({
        index: index + 1,
        ...item
      })))
    } else {
      errorMessage(res.message)
    }
    setGetDataLoading(false)
  }

  const handleClickBack = () => {
    history.goBack()
  }

  useEffect(() => {
    getData()
  }, [])

  const handleSave = async (row: QuestionListItem) => {
    console.log(row)
    setUpDataLoading(true)
    // await editQuestion(row)
    await mockData<boolean>('data', true)
    const index = dataList.findIndex(item => row.index === item.index);
    const item = dataList[index];
    dataList.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataList([...dataList])
    setUpDataLoading(false)
  };

  return (
    <>
      <div className={styles['go-back']} onClick={handleClickBack}>
        <MainTitle title={
          `< 返回${pageType === 'see' ? '查看任务列表' : '生成问答列表'}`
        }></MainTitle>
      </div>
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
              rowExpandable: record => record.answer && record.answer.length > 0,
            }}
            expandedRowClassName={() => styles['expanded-row']}
          ></Table>
        </div>
      </Spin>
    </>

  )
}

export default AiZhidaoDetail
