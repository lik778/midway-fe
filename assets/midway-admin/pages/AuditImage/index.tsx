import * as React from 'react'
import { useEffect, useState } from 'react'
import { message, Table, Button, Input, Form, Modal } from 'antd'
import { ZoomInOutlined } from "@ant-design/icons"

import { getAuditImageList, auditImage } from '../../api/shop'

import { ImageItem } from '../../interfaces/shop'

import './index.css'

export default () => {
  // const [form] = Form.useForm()
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [previewURL, setPreviewURL] = useState<string | undefined>();
  const [previewModal, setPreviewModal] = useState(false);

  const getLists = async (page?: number) => {
    // console.log(form.getFieldsValue())
    setLoading(true)
    page = page || 1
    // const queryData = form.getFieldsValue()
    const lists = await getAuditImageList({ page, size: 999 })
    setLoading(false)
    setLists(lists.map(x => ({ ...x, key: x.id })))
  }

  useEffect(() => {
    getLists()
  }, [])

  const previewImage = (url: string) => {
    setPreviewURL(url)
    setPreviewModal(true)
  }
  const closePreviewModal = () => {
    setPreviewURL(undefined)
    setPreviewModal(false)
  }

  const passImage = async (item: ImageItem) => {
    setLoading(true)
    const res = await auditImage({
      id: item.id,
      reason: '',
      checkResult: 1
    })
    try {
      const isPass = res.checkStatus === 'APPROVE'
      if (isPass) {
        message.success('操作成功')
        getLists()
      } else {
        message.success('出错了，请稍后重试~')
      }
    } finally {
      setLoading(false)
    }
  }
  const notPassImage = async (item: ImageItem) => {
    setLoading(true)
    const res = await auditImage({
      id: item.id,
      reason: '',
      checkResult: 4
    })
    try {
      const isPass = res.checkStatus === 'REJECT_BYHUMAN'
      if (isPass) {
        message.success('操作成功')
        getLists()
      } else {
        message.success('出错了，请稍后重试~')
      }
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '预览',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: src => {
        return (
          <div className="preview-img-con">
            <img className="preview-sm-image" src={src} />
            <div className="mask" onClick={() => previewImage(src)}>
              <ZoomInOutlined />
            </div>
          </div>
        )
      }
    },
    { title: '审核结果', dataIndex: 'reason', key: 'reason' },
    { 
      title: '操作',
      render: (_, item: ImageItem) => {
        return <>
          <Button type="primary" disabled={loading} onClick={() => passImage(item)}>通过</Button>
          <Button type="primary" danger disabled={loading} onClick={() => notPassImage(item)} style={{ marginLeft: '1em' }}>不通过</Button>
        </>
      }
    },
  ]

  const renderPreviewModal = () => {
    if (!previewURL) {
      return
    }
    return (
      <Modal
        wrapClassName="image-preview-modal"
        width="100vw"
        footer={null}
        visible={previewModal}
        onCancel={closePreviewModal}
      >
        <div className={"image-wrapper " + ((previewModal && previewURL) ? 'active' : '')}>
          <img src={previewURL} alt="预览图片" />
        </div>
      </Modal>
    )
  }

  return (
    <div className="page-audit-image">
      {/* <Form layout="inline" form={form} style={{ marginBottom: 32 }}>
        <Form.Item label="用户id" name="usrId">
          <Input placeholder="请输入用户id" />
        </Form.Item>
      </Form> */}
      <Table
        loading={loading}
        dataSource={lists}
        columns={columns}
      />
      {renderPreviewModal()}
    </div>
  )
}