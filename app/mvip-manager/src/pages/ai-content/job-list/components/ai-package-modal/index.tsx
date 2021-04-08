import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import { errorMessage, successMessage } from '@/components/message';
import { getAiChooseWordListApi } from '@/api/ai-content';
import { ChooseWord } from '@/interfaces/ai-content';

interface DataType {
  id: number;
  seoWord: string;
  type: string;
  isCheck: boolean
}

interface Props {
  visible: boolean;
  close(): void;
  viewtaskId: number | null;
}

export default (props: Props) => {
  const { visible, close, viewtaskId } = props
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [wordIds, setWordIds] = useState<number[]>([])
  const [seoWord, setSeoWord] = useState<DataType[]>([])
  const [showWord, setShowWord] = useState<DataType[]>([])

  useEffect(()=>{
    if(viewtaskId){
      getWord(viewtaskId)
      console.log("package");
    }
  },[viewtaskId])

  const getWord = async (id: number) => {
    setListLoading(true)
    setWordIds([])
    setSeoWord([])
    setShowWord([])
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
  }

  const columns = [
    { title: '编号', dataIndex: 'key', key: 'key', width: 130 },
    { title: '关键词', dataIndex: 'seoWord', key: 'seoWord' },
    { title: '关键词类型', dataIndex: 'type', key: 'type' },
  ];

  return (
    <Modal
      width={940}
      style={{ padding: 0 }}
      title={'查看词包'}
      className="my-modal-box"
      visible={visible}
      footer={null}
      onCancel={() => { close(); }}>
      <span style={{ color: '#999', fontSize: 13, position:'absolute', top: 40, left:110 }}>（已有关键词：<span style={{ color: 'orange' }}>{wordIds ? wordIds.length : 0}</span> 个）</span>
      <Table
        columns={columns} rowKey="id" dataSource={showWord}
        loading={listLoading} scroll={{ y: 380 }}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (page, size) => setSize(size),
          current: page, onChange: (page) => setPage(page),
          pageSize: size, position: ['bottomCenter']
        }}
      />
    </Modal>)
}
