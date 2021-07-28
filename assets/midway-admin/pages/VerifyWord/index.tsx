import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Select, Input, Form } from 'antd';
import { VerifyWordModal } from '../../components/VerifyWordModal'
import { getVerifyListApi } from '../../api/verify';
import { addKeyForListData, formatTime } from '../../util';
import { VerifyWordItem } from '../../interfaces/verify';
import { AiTaskStatus } from '../../enums/verify';

const FormItem = Form.Item;
const Option = Select.Option;

export default () => {
  const [ modalVisible, setModalVisible ] = useState<boolean | null>(null)
  const [ listData, setListData ] = useState<VerifyWordItem[]>([])
  const [ listLoading, setListLoading ] = useState<boolean>(false)
  const [ editItem, setEditItem ] = useState<VerifyWordItem>(null)
  const [ total, setTotal ] = useState<number>(1)
  const [ current, setCurrent ] = useState<number>(1)
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ status: AiTaskStatus.DEFAULT })
    obtainVerifyData(1)
  }, [])

  const obtainVerifyData = async (page: number) => {
    const queryData = form.getFieldsValue();
    setCurrent(page);
    setListLoading(true);
    const { result, totalRecord } = await getVerifyListApi({ ...queryData, page, size: 10 });
    setListLoading(false);
    setTotal(totalRecord);
    setListData(addKeyForListData(result))
  }

  const viewWord = (record: VerifyWordItem) => {
    setEditItem(record)
    setModalVisible(true)
  }

  const columns = [
    { title: '用户id', dataIndex: 'usrId', key: 'usrId' },
    { title: '店铺id', dataIndex: 'shopId', key: 'shopId' },
    { title: '任务id', dataIndex: 'taskId', key: 'taskId' },
    { title: '所属分组', dataIndex: 'contentCateName', key: 'contentCateName' },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime',
      render: (time: string) => <span>{ formatTime(time) }</span> },
    { title: '审核状态', dataIndex: 'status', key: 'status',
      render: (status: string, record: VerifyWordItem) =>{
        if (Number(status) === AiTaskStatus.ON_TASK) return <span>审核通过</span>
        if (Number(status) === AiTaskStatus.REJECT) {
          return <div>
            <span style={{ color: '#f1492c' }}>审核驳回</span>
            { record.memo && <Tooltip placement="bottom" title={record.memo}>
              <p style={{ fontSize: 12 }}>{ `${record.memo.substring(0, 3)}...` }</p>
            </Tooltip>}
          </div>
        }
        if (Number(status) === AiTaskStatus.DEFAULT) return <span>待审核</span>
      }
    },
    { title: '操作', render: (record: VerifyWordItem) =>
        <Button type="primary" onClick={() => viewWord(record) }>查看</Button>
    },
  ];

  return (
    <div>
      <Form layout="inline" form={form} style={{ marginBottom: 32 }}>
        <FormItem label="审核状态" name="status">
          <Select style={{ width: 200 }}>
            <Option value={4}>待审核</Option>
            <Option value={0}>审核通过</Option>
            <Option value={3}>审核驳回</Option>
          </Select>
        </FormItem>
        <FormItem label="用户id" name="usrId">
          <Input placeholder="请输入用户id"/>
        </FormItem>
        <FormItem label="任务id" name="taskId">
          <Input placeholder="请输入任务id"/>
        </FormItem>
        <FormItem label="店铺id" name="shopId">
          <Input placeholder="请输入店铺id"/>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={() => obtainVerifyData(1)}>查询</Button>
        </FormItem>
      </Form>
      <Table loading={listLoading}  dataSource={listData} columns={columns} pagination={{
        showSizeChanger: false, current, total: total || 0,
        onChange: obtainVerifyData,
        hideOnSinglePage: listData.length < 10, position: ['bottomCenter']}}/>
      {  modalVisible !== null &&  <VerifyWordModal editItem={editItem} visible={modalVisible} close={(taskId: number) => {
        setListData(listData.filter(x => x.taskId !== taskId))
        setModalVisible(false)
      }}/> }
    </div>
  )
}