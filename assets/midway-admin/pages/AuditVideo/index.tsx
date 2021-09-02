import * as React from 'react'
import { useEffect, useState } from 'react'
import { message, Table, Button, Input, Form, Modal } from 'antd'
import { ZoomInOutlined } from "@ant-design/icons"

import { getAuditMaterialList, auditMaterial } from '../../api/shop'

import { MediaAssetsItem } from '../../interfaces/shop'

import './index.css'

export default () => {
  // const [form] = Form.useForm()
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [previewURL, setPreviewURL] = useState<string | undefined>();
  const [previewModal, setPreviewModal] = useState(false);

  const getLists = async (page?: number) => {
    setLoading(true)
    page = page || 1
    const res = await getAuditMaterialList({ source: 'VIDEO', page, size: 999 })
    setLists((res.data as any[]).map(x => ({ ...x, key: x.id })))
    setLoading(false)
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

  const passImage = async (item: MediaAssetsItem) => {
    setLoading(true)
    const res = await auditMaterial({
      id: item.id,
      reason: '',
      checkResult: 1
    })
    if (res.success) {
      const isPass = (res.data as any).checkStatus === 'APPROVE'
      if (isPass) {
        message.success('操作成功')
        getLists()
      } else {
        message.error('出错了，请稍后重试~')
      }
    } else {
      message.error(res.message)
    }
    setLoading(false)
  }
  const notPassImage = async (item: MediaAssetsItem) => {
    setLoading(true)
    const res = await auditMaterial({
      id: item.id,
      reason: '',
      checkResult: 4
    })
    if (res.success) {
      const isPass = (res.data as any).checkStatus === 'REJECT_BYHUMAN'
      if (isPass) {
        message.success('操作成功')
        getLists()
      } else {
        message.error('出错了，请稍后重试~')
      }
    } else {
      message.error(res.message)
    }
    setLoading(false)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '图片预览',
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
    { title: '违规原因', dataIndex: 'reason', key: 'reason' },
    {
      title: '审核操作',
      render: (_, item: MediaAssetsItem) => {
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
      <Table
        loading={loading}
        dataSource={lists}
        columns={columns}
      />
      {renderPreviewModal()}
    </div>
  )
}