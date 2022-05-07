import * as React from 'react'
import {  Table,Button,Modal,Form,Input,Radio,Row,Col,Popover,Image } from 'antd';
import { useEffect, useState } from 'react'
import { getComplaintList ,getUpdateStatus,searchByContact} from '../../api/customerService'
import {STATUS_LIST} from './config'

import './index.css'
export default () => {
  const [listData, setListData] = useState<any[]>([])
  const [id, setId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [urlImg, setUrlImg] = useState("")
  const [visible, setVisible] = React.useState(false);
  const [pending,setPending] = useState(0)
  const [proportion,setProportion] = useState('0')
  const [sum,setSum] = useState('0')
  const [noteValue,setNoteValue] = useState('')
  const [form] = Form.useForm()
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
    form.setFieldsValue({
      urlImg:urlImg,
      note:noteValue
    })
  }, [noteValue,urlImg])
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
      render: (name,record) => (
        <Popover content={name} key={record.id}>
          <p className='list-name'>{name}</p>
        </Popover>
    ),
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
      render: (content,record) => (
          <Popover content={content} key={record.id}>
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
      render: (sourceUrl,record) => (
        <a key={record.id} href={sourceUrl}>{sourceUrl}</a>
      )
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: '7',
      render: (status,record) => (
          <Popover  key={record.id}>
            <p className='list-width'>{STATUS_LIST.find(o=>o.value==status).label}</p>
          </Popover>
      )
    },
    {
      title: '处理',
      dataIndex: 'note',
      key: '8',
      render: (note,record) => (
        <Popover  key={record.id} content={record.status == 1 ?(note?note:'无'):null}>
          <Button   type="link" size='large' onClick={() => renderUpdate(record)} disabled={record.status == 1}>处理</ Button>
        </Popover>
      )
    }
  ]
  const renderUpdate = (val:any) => {
    setId(val.id)
    setUrlImg(val.urlImg)
    setNoteValue(val.note)
    form.setFieldsValue({
      urlImg:urlImg,
      note:noteValue
    })
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

  const onTextChange = e => {
    console.log(e.target.value);
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
          form={form}
        >
          {
          urlImg? <Form.Item
          label="证据上传"
          name="urlImg"
          initialValue={urlImg}
          >
            <Image
              width={200}
              src={urlImg}
            />
          </Form.Item>:""
          }
          <Form.Item
            label="处理状态"
            name="status"
            rules={[{ required: true, message: '请选择状态提交!' }]}
          >
            <Radio.Group>
              <Radio value={1}>已处理</Radio>
              <Radio value={0}>已知晓，稍后处理</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="备注"
            name="note"
            rules={[{ required: true, message: '请输入您觉得重要的信息!' }]}
            initialValue={noteValue}
          >
            <Input.TextArea onChange={onTextChange} value={noteValue}/>
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