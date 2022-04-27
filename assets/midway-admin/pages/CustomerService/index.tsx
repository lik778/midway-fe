import * as React from 'react'
import {  Table,Button,Modal,Form,Input,Radio,Row,Col,Popover } from 'antd';
import { useEffect, useState } from 'react'
import { getComplaintList ,getUpdateStatus,searchByContact} from '../../api/customerService'
import {STATUS_LIST} from './config'

import './index.css'
export default () => {
  const [listData, setListData] = useState<any[]>([])
  const [id, setId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = React.useState(false);
  const [pending,setPending] = useState(0)
  const [proportion,setProportion] = useState('0')
  const [sum,setSum] = useState('0')
  const getList = async () => {
    setLoading(true)
    const complaintList = {page:1,size:1000}
    const {data,code,data:{pending,sum,proportion}} = await getComplaintList(complaintList)
    if (code == 200) {
      setListData(data.bos)
      setPending(pending)
      setProportion(proportion)
      setSum(sum)
    }
    setLoading(false)
  }
  const updateStatus = async (obj:any) => {
    setLoading(true)
    const {code} = await getUpdateStatus({...obj,id})
    if (code == 200) {
      console.log(code);
      setVisible(false)
      getList()
    }
    setLoading(false)
  }

  useEffect(() => {
    getList()
  }, [])
  
  const [value, setValue] = React.useState(1);
  const dataList = [
    {
      id:1,
      title:'待处理数据',
      number:pending,
      desc:'未处理的反馈问题数量'
    },
    {
      id:2,
      title:'未处理比例',
      number:proportion,
      desc:'未处理与处理问题的比例'
    },{
      id:3,
      title:'总反馈量',
      number:sum,
      desc:'所有反馈问题数量'
    }
  ]
  
  const columns = [
    {
      title: '时间',
      dataIndex: 'createTime',
      key: '1',
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: '2',
    },
    {
      title: '客户电话',
      dataIndex: 'contact',
      key: '3',
    },
    {
      title: '维权事宜',
      dataIndex: 'content',
      key: '4',
      render: (content,id) => (
          <Popover content={content} key={id}>
            <p className='list-content'>{content}</p>
          </Popover>
      ),
    },
    {
      title: '商户UID',
      dataIndex: 'userId',
      key: '5',
    },
    {
      title: '店铺链接',
      dataIndex: 'sourceUrl',
      key: '6',
      render: (sourceUrl,id) => (
        <a key={id} href={sourceUrl}>{sourceUrl}</a>
      )
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: '7',
      render: (status,id) => (
        <p key={id}>{STATUS_LIST.find(o=>o.value==status).label}</p>
      )
    },
    {
      title: '处理',
      dataIndex: 'status',
      key: '8',
      render: (status,id) => (
        <Button   type="link" size='large' onClick={() => renderUpdate(id)}  key={id} disabled={status == 1}>处理</ Button>
      )
    }
  ]
  const renderUpdate = (val:any) => {
    setId(val.id)
    setValue(val.status)
    setVisible(true)
  }
  const onFinish = (values: any) => {
    console.log('Success:', values);
    const obj = {...values}
    updateStatus(obj)
  };
  const onSeach = async(values: any) => {
    const { contact } = values
    const {data} = await searchByContact({contact:contact})
    setListData(data)
  }
  const handleCancel = () => {
    setVisible(false);
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onSeachFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = e => {
    setValue(e.target.value);
  };
  const getDataList = dataList.map((item)=>{
    return(
      <div className='percentage-item' key={item.id}>
            <div className='number'>{item.number}</div>
            <div className='text-list'>
              <p>{item.title}</p>
              <p className='gray'>{item.desc}</p>
            </div>
          </div>
    )
  })
  
  const previewModal = () => {
    return (
      <Modal
        className="showModal"
        width={700}
        title="用户反馈详情"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
       <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          
          <Form.Item
            label="处理状态"
            name="status"
            rules={[{ required: true, message: '请选择状态提交!' }]}
          >
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>已处理</Radio>
              <Radio value={0}>已知晓，稍后处理</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="备注"
            name="note"
            rules={[{ required: true, message: '请输入您觉得重要的信息!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal >
    )
  }
  return (
    <div className="customer-service">
      <div className="data-statistics">
        <p className='title'>处理概况</p>
        <p>为了保证客户的反馈体验，建议在接到反馈1-5个工作日内进行处理并结束反馈流程。</p>
        <div className="data-percentage">
          {getDataList}
        </div>
      </div>
      <Row justify="end">
        <Col span={8}>
          <Form
            name="seach"
            layout="inline"
            initialValues={{ remember: true }}
            onFinish={onSeach}
            onFinishFailed={onSeachFailed}
            autoComplete="off"
          >
            <Form.Item
              label="电话"
              name="contact"
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <div className="table-list">
        <Table columns={columns} dataSource={listData}
        ></Table>
      </div>
      {previewModal()}
    </div>
  )
}