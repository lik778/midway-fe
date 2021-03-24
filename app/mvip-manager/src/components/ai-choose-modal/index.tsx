import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'antd';
import { AiContentItem, ChooseWord} from '@/interfaces/ai-content';
import { errorMessage, successMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';
import { history } from 'umi';
import { getAiChooseWordListApi } from '@/api/ai-content';

interface DataType {
  key: React.Key;
  id: number;
  seoWord: string;
  type: string;
}

interface Props {
  visible: boolean;
  close(): void;
  editItem: AiContentItem | null;
}

export default (props: Props) => {
  const { visible, close, editItem } = props
  const [ submitLoading, setSubmitLoading ] = useState<boolean>(false);
  const [seoWord, setSeoWord] = useState<DataType[]>([])
  const [page, setPage] = useState<number>(1);
  const [size, setSize ] = useState<number>(10);
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [wordKey,setWordKey] = useState<string[]>([])
  const [ dataLoading, setDataLoading ] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      setListLoading(true)
      const id  = editItem?.id;
      console.log(id);
      
      const res = await getAiChooseWordListApi( Number(id) )
      console.log(res);
      if (res.success) {
        setDataLoading(true)
        // const value = Object.keys(res).values()
        const value = res.data.wordsGrouped
        let count = 1;
        Object.keys(value).forEach((items:any)=>{
          items.map((item:DataType)=>{
            item.key = String(count++);
            setSeoWord(
              ()=>{
                seoWord.push(item)
                return [...seoWord]
              })
            setWordKey(
              ()=>{
                wordKey.push(String(item.key))
                return [...wordKey]
              })
          })
        })
      } else {
        // errorMessage(res.message)
      }
      setListLoading(false)
    })()
  },[])

  const isValidForm =(checkValues: any): boolean => {
    if(checkValues == null || checkValues.length < 200){
      const errorList: string = "关键词最少选择200个词";
      errorMessage(`提交失败：${errorList}`)
      return false
    } else {
      return true
    }
  }

  const submitData = () => {
    setSubmitLoading(true)
    let notSelectWordIds :number[] = []
    if(isValidForm(wordKey)){
      Object.keys(seoWord).forEach((item:string)=>{
        if( wordKey.indexOf(String(seoWord[Number(item)].key)) == -1){
          notSelectWordIds.push(seoWord[Number(item)].id)
        }
      })
      const taskId  = editItem?editItem.id:null;
      const value = {
        notSelectWordIds:notSelectWordIds,
        taskId:taskId,
      }
      console.log(value);
      

      /** resData需要修改的！ **/
      const resData = { success:true,message:'操作成功'}
      if(resData.success){
        successMessage(resData.message)
        // setTimeout(()=> location.reload(), 500)
      } else {
        errorMessage(resData.message)
      }
    }
    setSubmitLoading(false)
  }
  
  const columns = [
    { title: '编号', dataIndex: 'key', key: 'key', width:80},
    { title: '关键词', dataIndex: 'seoWord', key: 'seoWord' },
    { 
      title: '关键词类型', 
      dataIndex: 'type', 
      key: 'type',
      filters:[
        {
          text:'AC',
          value:'AC',
        },
        {
          text:'ABC',
          value:'ABC',
        },
        {
          text:'ACD',
          value:'ACD',
        },
        {
          text:'ABCD',
          value:'ABCD',
        },
      ],
      onFilter: (value :any, record :any) => record.type == value,
    },
  ];

  const rowSelection : any = {
    selectedRowKeys:wordKey,
    selections:[
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      setWordKey(selectedRowKeys)
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
        columns={columns} dataSource={seoWord} scroll={{ y: 380 }}
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
        </div> }
    </Modal>)
}
