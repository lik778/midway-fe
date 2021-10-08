import * as React from 'react'
import { useEffect, useState } from 'react'
import { Table, Button, message, Modal } from 'antd';
import { getAdviceList, getDownload } from '../../api/adviceRecord'
import { PageParams } from '../../interfaces/api'
import { Advicerespone } from '../../interfaces/adviceRecord'
import './index.css'

export default () => {
  const [listData, setListData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [itemContent, setItemContent] = useState<string>('')
  const getList = async (page?: number) => {
    setLoading(true)
    page = page || 1
    const res = await getAdviceList({ page, size: 999 })
    if (res?.success) {
      setListData(((res.data as any).result).map((x, i) => ({ ...x, key: i })))
    }
    setLoading(false)
  }

  useEffect(() => {
    getList()
  }, [])

  const columns = [
    {
      title: '反馈时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '用户id',
      dataIndex: 'usrId',
      key: 'usrId',
    },
    {
      title: '店铺Id',
      dataIndex: 'shopId',
      key: 'shopId',
    },
    {
      title: '店铺域名',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: '反馈者身份',
      dataIndex: 'identity',
      key: 'identity',
    },
    {
      title: '联系电话',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '详细建议',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => (
        <Button type="primary" size="small" onClick={() => renderPreviewModal(text, record)}> 查看</ Button>
      )
    }
  ]
  // 点击查看
  const renderPreviewModal = (text: any, items: any) => {
    setModalShow(true)
    setItemContent(items.content)
  }
  // 分页
  const onChange = (page: any) => {
  }
  // 点击下载
  const handleDown = async () => {
    message.info('此功能待开发')
  }
  const closemodalShow = () => {
    setModalShow(false)
  }
  const previewModal = () => {
    return (
      <Modal
        className="showModal"
        width={700}
        title="详细建议"
        footer={null}
        visible={modalShow}
        onCancel={closemodalShow}
        maskClosable={false}
        centered

      >
        <div className="showAdvice">
          {itemContent}
        </div>
      </Modal >
    )
  }
  return (
    <div className="advice-record">
      <div className="download-title">
        <div className="download" onClick={handleDown}>
          下载
        </div>
      </div>
      <div className="table-down">
        <Table columns={columns}
          onChange={onChange}
          loading={loading}
          dataSource={listData}
          pagination={{ pageSize: 20 }}
        ></Table>
      </div>
      {previewModal()}
    </div>
  )
}
