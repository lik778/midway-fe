import React, { useEffect, useState } from 'react';
import { Input, Tooltip , Form , Col , Row  , Button} from 'antd';
import { Link } from 'umi';
import MainTitle from '@/components/main-title';
import Loading from '@/components/loading';
import AiEditModal from '@/components/ai-edit-modal';
import { getAiListApi, pauseAiTaskApi, startAiTaskApi } from '@/api/ai-content';
import './index.less';
import { AiContentItem } from '@/interfaces/ai-content';
import { addKeyForListData, formatTime } from '@/utils';
import { errorMessage } from '@/components/message';
import { AiTaskAction, AiTaskStatus } from '@/enums';
import { AiTaskStatusText } from '@/constants';

export default (props: any) => {
  const [ aiEditModalVisible, setAiEditModalVisible ] = useState<boolean>(false);
  const [ editAiTask, setEditAiTask ] = useState<AiContentItem | null>(null);
  const [page, setPage] = useState<number>(1);
  const [aiList, setAiList] = useState<AiContentItem[] | null>(null);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<any>(null);
  useEffect(() => {
    (async () => {
       setListLoading(true)
       const res =  await getAiListApi({ page, size: 10 })
       if (res.success) {
         setAiList(addKeyForListData(res.data.result || [], page))
         setTotal(res.data.totalRecord)
       } else {
         errorMessage(res.message)
       }
       setListLoading(false)
    })()
  }, [page])

  const setAiListStatus = (id: number, status: AiTaskStatus) => {
    if (!aiList || aiList.length === 0) return
    const item = aiList.find(x => x.id === id)
    if (item) item.status =  status
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

  const viewWordsBtn = (record: AiContentItem, text = '查看词组') => {
    return <span onClick={() => viewWords(record)}>{ text }</span>
  }

  const aiAction = (record: AiContentItem) => {
    const status = record.status
    if (status === AiTaskStatus.ON_TASK) {
      return <div className="ai-action-box">
        <Tooltip placement="top" title="开启中">
          <span onClick={() => changeAiTaskStatus(AiTaskAction.PAUSE, record)}  className="ai-action ai-pause-action"></span>
        </Tooltip>
        { viewWordsBtn(record) }
      </div>
    } else if (status === AiTaskStatus.REJECT) {
      return <div className="ai-action-box">{ viewWordsBtn(record, '修改') }</div>
    } else if (status === AiTaskStatus.ON_PAUSE) {
      return <div className="ai-action-box">
        <Tooltip placement="top" title="已暂停">
          <span onClick={() => changeAiTaskStatus(AiTaskAction.START, record)} className="ai-action ai-start-action"/>
        </Tooltip>
        { viewWordsBtn(record) }
      </div>
    } else {
      return <div className="ai-action-box">{ viewWordsBtn(record) }</div>
    }
  }

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime', render: (text: string) => {
        return formatTime(text)
    } },
    { title: '文章分组', dataIndex: 'contentCateName', key: 'contentCateName' },
    { title: '预计发文', dataIndex: 'topArticleNum', key: 'topArticleNum' },
    { title: '昨日发文', dataIndex: 'yesterdayArticleNum', key: 'yesterdayArticleNum' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (text: string, record: AiContentItem) => {
        if (record.status === AiTaskStatus.REJECT) {
          return <div className="ai-status-reject">
            <span className="status">{ AiTaskStatusText[Number(text)] }</span>
            { record.memo && <Tooltip placement="bottom" title={record.memo} >
                <span className="reason">{ `${record.memo.substring(0, 3)}...` }</span>
              </Tooltip> }
          </div>
        } else {
          return <span style={{ color: AiTaskStatus.ON_TASK ? '#999' : '' }}>{ AiTaskStatusText[Number(text)] }</span>
        }
    }},
    { title: '累计发文', dataIndex: 'articleNum', key: 'articleNum', render: (text: string, record: AiContentItem) => {
        return <div>
          <label>已发文<span style={{ color: '#096DD9' }}>{text}</span>篇</label>
          <span> | </span>
          <Link to={`/shop/${record.shopId}/article`}>
            <span className="action-btn">查看发文</span>
          </Link>
        </div>
    }},
    { title: '操作', dataIndex: '', key: 'x',
      render: (text: string, record: AiContentItem) => aiAction(record)
    },
  ];

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;

  const contentName: any = {
    wordA: {
      label: '公司优势',
      name: 'One',
      placeholder: "一行一个素材，至少填写5个，多个素材以回车分行区别。",
    },
    wordB: {
      label: '公司好评',
      name: 'Two',
      placeholder: "一行一个素材，至少填写5个，多个素材以回车分行区别。",
    },
    wordC: {
      label: '公服务承诺',
      name: 'Three',
      placeholder: "一行一个素材，至少填写5个，多个素材以回车分行区别。",
    },
    wordD: {
      label: '公司服务产品',
      name: 'Four',
      placeholder: "一行一个素材，至少填写5个，多个素材以回车分行区别。",
    },
    wordE: {
      label: '行业小知识',
      name: 'Five',
      placeholder: "一行一个素材，至少填写5个，多个素材以回车分行区别。",
    }
  }

  return (
    <div>
      <MainTitle title="基础信息素材"/>
      <div className="ai-list-container">
          <div className="ai-create-box">
            <Form name="create-job-form">
              <Col className="group-words-list" span={24}>
                {
                  Object.keys(contentName).map((k) => {
                    const x = contentName[k];
                    return (<Row key={k} className="gutter-row" gutter={40} justify="center">
                        <Col className="content-label" span={3}><div><span style={{color:'red'}}>*</span>{x.label}：</div> </Col>
                        <Col span={18}>
                        <FormItem name={x.name}>
                          <TextArea rows={5} placeholder={x.placeholder} />
                        </FormItem>
                        </Col>
                      </Row>
                    )
                  })
                }
              </Col>
            </Form>
            {/* <Button style={{ width: 120, height: 40, background: '#096DD9', borderColor: '#096DD9' }} type="primary" onClick={() => setModalVisible(true)} htmlType="submit">提交</Button> */}
          </div>
        </div>
    </div>
  )
}
