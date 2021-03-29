import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'antd';
import { errorMessage, successMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';
import { history } from 'umi';
import { getAiChooseWordListApi, submitAiChooseWordListApi } from '@/api/ai-content';

interface DataType {
  id: number;
  seoWord: string;
  type: string;
  isCheck: boolean
}

interface Props {
  visible: boolean;
  close(): void;
  wordId: number | null;
}

export default (props: Props) => {
  const { visible, close, wordId } = props
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const [wordKey, setWordKey] = useState<number[]>([])
  const [seoWord, setSeoWord] = useState<DataType[]>([])

  useEffect(()=>{
    if(wordId){
      getWord(wordId)
    }
  },[wordId])

  const getWord = async (id: number) => {
    setListLoading(true)
    const res = await getAiChooseWordListApi({ "taskId": id })
    if (res.success) {
      setDataLoading(true)
      const value = res.data.wordsGrouped
      // TODO;下方 item 类型定义
      const newSeoWord = Object.values(value).reduce((total, items: { id: number, seoWord: string, type: string }[], index) => {
        return total.concat(items)
      }, [] as { id: number, seoWord: string, type: string }[]).map((item,index) => ({
        ...item, isCheck: true,key:index+1
      }))
      setSeoWord(newSeoWord)
      setWordKey(newSeoWord.map(item => item.id))
    } else {
      errorMessage(res.message)
    }
    setListLoading(false)
  }

  const submitData = async () => {
    setSubmitLoading(true)
    if (wordKey.length >= 1) {
      const notSelectWordIds: number[] = seoWord.filter(item=>!item.isCheck).map(item=>item.id)
      const taskId = wordId;
      const value = {
        notSelectWordIds: notSelectWordIds,
        taskId: taskId,
      }
      const resData = await submitAiChooseWordListApi(value)
      if (resData.success) {
        successMessage(resData.message)
        setTimeout(()=> location.reload(), 500)
      } else {
        errorMessage(resData.message)
      }
    } else {
      errorMessage("提交失败：关键词最少选择200个词")
    }
    setSubmitLoading(false)
  }

  const columns = [
    { title: '编号', dataIndex: 'key', key: 'key', width: 80 },
    { title: '关键词', dataIndex: 'seoWord', key: 'seoWord' },
    {
      title: '关键词类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        {
          text: 'AC',
          value: 'AC',
        },
        {
          text: 'ABC',
          value: 'ABC',
        },
        {
          text: 'ACD',
          value: 'ACD',
        },
        {
          text: 'ABCD',
          value: 'ABCD',
        },
      ],
      onFilter: (value: any, record: any) => record.type == value,
    },
  ];

  const rowSelection: any = {
    selectedRowKeys: wordKey,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    onChange: (selectedRowKeys: number[], selectedRows: DataType[]) => {
      setWordKey(selectedRowKeys)
    },
    onSelect: (record: DataType, selected: boolean) => {
      const index = seoWord.findIndex((value,index)=>{
        return value.id === record.id
      })
      const newSeoWord = seoWord.splice(index, 1, { 
        ...record,
        isCheck: selected
      })
      setSeoWord(seoWord)
    },

    onSelectAll:(selected:boolean, selectedRows:DataType[], changeRows:DataType[])=> {
      const index = seoWord.findIndex((value,index)=>{
        return value.id === changeRows[0].id
      })
      // TODO; newSeoWord是否有存在的必要性
      const newSeoWord = seoWord.splice(index, changeRows.length, ...changeRows.map(item=>({ 
        ...item,
        isCheck: selected
      })))
      setSeoWord(seoWord)
    },
    getCheckboxProps: (record: DataType) => ({
      id: record.id,
    }),
  };

  return (
    <Modal
      width={940}
      style={{ padding: 0 }}
      title={'选词列表'}
      className="my-modal-box"
      visible={visible}
      confirmLoading={submitLoading}
      onOk={submitData}
      footer={null}
      onCancel={() => { close(); }}>
      <Table
        columns={columns} rowKey="id" dataSource={seoWord} scroll={{ y: 380 }}
        rowSelection={rowSelection} loading={listLoading}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (page, size) => setSize(size),
          current: page, onChange: (page) => setPage(page),
          pageSize: size, position: ['bottomLeft']
        }}
      />
      <MyModal
        title="确认提交"
        content="提交后不可修改，确认提交吗？"
        type={ModalType.info}
        onCancel={() => setModalVisible(false)}
        onOk={() => history.push('/company-info/base')}
        footer={<div>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button type="primary" loading={submitLoading} onClick={() => submitData()}>确认</Button>
        </div>}
        visible={modalVisible} />
      { dataLoading && <div style={{ color: '#333', fontSize: 16, position: 'absolute', right: 35, bottom: 60 }}>
        当前已选关键词：<span style={{ color: 'orange', fontSize: 16 }}>{wordKey ? wordKey.length : 0}个</span>
        <span style={{ color: '#999', fontSize: 10 }}>（至少选择200个词）</span>
        <Button key="submit" type="primary" style={{ position: 'absolute', right: 4, bottom: -50, width: 120, height: 35 }} onClick={() => setModalVisible(true)}>提 交</Button>
      </div>}
    </Modal>)
}
