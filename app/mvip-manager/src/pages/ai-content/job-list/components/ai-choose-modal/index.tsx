import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Menu, Dropdown } from 'antd';
import { errorMessage, successMessage } from '@/components/message';
import { history } from 'umi';
import { getAiChooseWordListApi, submitAiChooseWordListApi } from '@/api/ai-content';
import { ChooseWord } from '@/interfaces/ai-content';
import { DownOutlined } from '@ant-design/icons';
import './index.less';

interface DataType {
  id: number;
  seoWord: string;
  type: string;
  isCheck: boolean
}

interface Props {
  visible: boolean;
  close(): void;
  chooseTaskId: number | null;
}

export default (props: Props) => {
  const { visible, close, chooseTaskId } = props
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const [wordIds, setWordIds] = useState<number[]>([])
  const [seoWord, setSeoWord] = useState<DataType[]>([])
  const [showWord, setShowWord] = useState<DataType[]>([])

  useEffect(()=>{
    if(chooseTaskId){
      getWord(chooseTaskId)
    }
  },[chooseTaskId])

  const getWord = async (id: number) => {
    setListLoading(true)
    setWordIds([])
    setSeoWord([])
    setShowWord([])
    setDataLoading(false)
    const res = await getAiChooseWordListApi({ "taskId": id })
    if (res.success) {
      const value = res.data.wordsGrouped
      if(Object.getOwnPropertyNames(seoWord).length != 0){
        const newSeoWord = Object.values(value).reduce((total, items: { id: number, seoWord: string, type: string }[], index) => {
          return total.concat(items)
        }, [] as ChooseWord[]).map((item, index) => ({
          ...item, isCheck: true, key: index + 1
        }))
        setSeoWord(newSeoWord)
        setWordIds(newSeoWord.map(item => item.id))
        setShowWord(newSeoWord)
      }
    } else {
      errorMessage(res.message)
    }
    setListLoading(false)
    if(Object.getOwnPropertyNames(res.data.wordsGrouped).length != 0){
      setDataLoading(true)
    }
  }

  const submitData = async () => {
    setSubmitLoading(true)
    if (wordIds.length >= 200) {
      const notSelectWordIds: number[] = seoWord.filter(item=>!item.isCheck).map(item=>item.id)
      const value = {
        notSelectWordIds: notSelectWordIds,
        taskId: chooseTaskId,
      }
      const resData = await submitAiChooseWordListApi(value)
      if (resData.success) {
        successMessage(resData.message)
        setTimeout(()=> location.reload(), 500)
      } else {
        errorMessage(resData.message)
      }
    } else {
      errorMessage("提交失败：请至少选择200个优选词")
    }
    setSubmitLoading(false)
  }

  const columns = [
    { title: '编号', dataIndex: 'key', key: 'key', width: 80 },
    { title: '关键词', dataIndex: 'seoWord', key: 'seoWord' },
    {
      title: () =>{
        return(
          <Dropdown overlay={() => {
            return (
              <Menu onClick={ key => {
                if(key.key === "all"){
                  setShowWord(seoWord)

                } else {
                  const newShowWord = seoWord.filter(item=>item.type===key.key)
                  setShowWord(newShowWord)
                }
              } }>
                <Menu.Item key="all">全部</Menu.Item>
                <Menu.Item key="AC">AC</Menu.Item>
                <Menu.Item key="ABC">ABC</Menu.Item>
                <Menu.Item key="ACD">ACD</Menu.Item>
                <Menu.Item key="ABCD">ABCD</Menu.Item>
              </Menu>
            )
          }}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              关键词类型 <DownOutlined />
            </a>
          </Dropdown>
        )
      },
      dataIndex: 'type',
      key: 'type',
    },
  ];

  const rowSelection: any = {
    selectedRowKeys: wordIds,
    preserveSelectedRowKeys:true,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    onChange: (selectedRowKeys: number[], selectedRows: DataType[]) => {
      setWordIds(selectedRowKeys)
    },
    onSelect: (record: DataType, selected: boolean) => {
      const index = seoWord.findIndex((value,index)=>{
        return value.id === record.id
      })
      seoWord.splice(index, 1, { 
        ...record,
        isCheck: selected
      })
      setSeoWord(seoWord)
    },

    onSelectAll:(selected:boolean, selectedRows:DataType[], changeRows:DataType[])=> {
      const newSeoWord = [...seoWord]
      changeRows.forEach(item=>{
        const index = newSeoWord.findIndex((value,index)=>{
          return value.id === item.id
        })
        newSeoWord.splice(index, 1, { 
          ...item,
          isCheck: selected
        })
      })
      setSeoWord(newSeoWord)
    },
  };

  return (
    <Modal
      width={940}
      style={{ padding: 0 }}
      title={'选词列表'}
      className="my-modal-box"
      visible={visible}
      confirmLoading={submitLoading}
      footer={null}
      onOk={submitData}
      onCancel={() => { close(); }}>
      <div className="ai-body">
        <Table
          columns={columns} rowKey="id" dataSource={showWord}
          rowSelection={rowSelection}
          loading={listLoading} scroll={{ y: 380 }}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: (page, size) => setSize(size),
            current: page, onChange: (page) => setPage(page),
            pageSize: size, position: ['bottomLeft']
          }}
        />
        { dataLoading && 
          <div className="ai-footer">
            当前已选关键词：
            <span style={{ color: 'orange', fontSize: 16 }}>{wordIds ? wordIds.length : 0}个</span>
            <span style={{ color: '#999', fontSize: 10 }}>（至少选择200个词）</span>
            <Button key="submit" type="primary"
              style={{ position: 'absolute', right: 4, bottom: -50, width: 120, height: 35 }}
              onClick={() => setModalVisible(true)}>提 交</Button>
          </div>}
      </div>
      
      {modalVisible && <Modal
        className="my-modal-box"
        title="确认提交"
        footer={<div>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button type="primary" loading={submitLoading} onClick={() => submitData()}>确认</Button>
        </div>}
        onCancel={() => setModalVisible(false)}
        onOk={() => history.push('/company-info/base')}
        visible={visible}>
        <div>提交后不可修改，确认提交吗？（ 当前已选关键词：<span style={{ color: 'orange', fontSize: 14 }}>{wordIds ? wordIds.length : 0}</span> 个 ）</div>
      </Modal>}
    </Modal>)
}
