import React, { FC, useEffect, useState } from 'react'
import { TableColumnProps, Table, Spin, Tooltip } from 'antd'
import { useHistory, useParams } from "umi";
import MainTitle from '@/components/main-title';
import { QuestionListItem, } from '@/interfaces/ai-content'
import { getQuestionTaskDetailApi, editQuestion } from '@/api/ai-content'
import { mockData } from '@/utils';
import { errorMessage } from '@/components/message';
import styles from './index.less'
import EditableRow from './components/editable/row'
import EditableCell from './components/editable/cell'
import EditableExpandable from './components/expandable'
import { AiTaskStatus } from '@/enums/index'
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
      dataIndex: 'question',
      onCell: (record: QuestionListItem) => ({
        record,
        editable: pageType === 'edit',
        dataIndex: 'question',
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
      if (text === 2) {
        return <div className={styles['question-status-1']}>{
          AiTaskStatus[text]
        }</div>
      } else if (text === 3) {
        return (
          <Tooltip title={record.tip}>
            <div className={styles['question-status-2']}>发布失败</div>
            <div className={styles['question-status-2-tip']}>{record.tip}</div>
          </Tooltip>
        )
      } else {
        return <div className={styles['question-status-0']}>{
          AiTaskStatus[text]
        }</div>
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
        "id": i,
        "question": "江西优质的冰箱维修怎么收费帮忙回答一下呗",
        "answers": [
          "这个价格问题很难说，不能照标准单纯执行有歧义的。反正在我们上海，北京这里，听到百姓网股份他家的名字都是认可的，毕竟也是做了5年年的了。他家的联系方式就是给出的那几个，你往旁边找找看。建议你从预算、质量、环保度、口碑等综合去比较。百姓网股份这家公司真是千载难逢的好企业，对员工的各种培训都很到位，客人结伴去。要找冰箱维修相关商家，要拥有一双火眼金睛，听到看到免费、赠送等字眼别入坑。",
          "这家百姓网股份，是由{创始人}建立的。他们公司非常正规的，对用户有很多承诺，让我们很放心，给你看看他们的承诺：{服务承诺}。之前我还看过他们的简介：{公司介绍}，也发你了解下，他们提供的服务：我是公司产品我是公司产品，在上海，北京里都是数一数二的，基本上没有什么差评，售后都非常不错，你可以了解下。如果您对这行感兴趣，不妨了解下：",
          "价格方面无法那么确切，得看你的具体情况而定。之前有个朋友想知道行业信息，我写了一些：鄙人特别支持这位老师写的重要建议，老铁你真牛呀!"
        ],
        "wordTypes": "ABCDE",
        "questionType": "PRICE",
        "words": [
          "江西",
          "优质的",
          "冰箱维修",
          "6|||怎么收费|||价格决策",
          "帮忙回答一下呗"
        ],
        "coreWords": "冰箱维修",
        /** 0 待审核，1 已通过，2 未通过 */
        status: 0 as 0,
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
              rowExpandable: record => record.answers && record.answers.length > 0,
            }}
            expandedRowClassName={() => styles['expanded-row']}
          ></Table>
        </div>
      </Spin>
    </>

  )
}

export default AiZhidaoDetail
