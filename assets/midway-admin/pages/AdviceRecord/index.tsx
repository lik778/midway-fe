import * as React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { Table, Button, Pagination, Modal } from 'antd';
import { getAdviceList, getDownload } from '../../api/adviceRecord'
import { PageParams } from '../../interfaces/api'
import { Advicerespone } from '../../interfaces/adviceRecord'
import './index.css'

export default () => {
  // const [pagelist, setPagelist] = useState<PageParams>({ page: 1, size: 20 })
  const [listData, setListData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [itemContent, setItemContent] = useState<string>('')
  const getList = async (page?: number) => {
    setLoading(true)
    page = page || 1
    const res = await getAdviceList({ page, size: 20 })
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
  const onChange = (event: any) => {
  }
  // 点击下载
  const baseURL = '/management/api/internal'
  const handleDown = async () => {
    const request = axios.create({
      timeout: 10000,
      // withCredentials: true,
      headers: {
        // "Content-Type": "application/json;charset=utf-8"
      },
      responseType: "blob"
    })
    const res = await request.post(baseURL, { method: 'get', path: '/api/midway/internal/feedback/download' })
    console.log(res);

    // axios({
    //   method: 'get',
    //   url: 'http://172.17.14.106:8080/api/midway/test/test',
    //   responseType: 'blob',
    //   headers: { 'Content-Type': 'application/json;charset=utf-8' },
    // }).then(res => {
    //   console.log(res);
    //   // const blob = new Blob([res.data]);, { type: 'application/vnd.ms-excel' }
    //   let blob = new Blob([res.data])
    //   let url = URL.createObjectURL(blob)
    //   let ele = document.createElement("a")
    //   ele.style.display = 'none'
    //   ele.href = url
    //   ele.download = "反馈收集表.xlsx"
    //   // 将a标签添加到页面并模拟点击
    //   document.querySelectorAll("body")[0].appendChild(ele)
    //   ele.click()
    //   // 移除a标签
    //   ele.remove()
    // })

    // const res: any = await getDownload()
    // console.log(res);

    let blob = new Blob([res.data])
    let url = URL.createObjectURL(blob)
    let ele = document.createElement("a")
    ele.style.display = 'none'
    ele.href = url
    ele.download = "反馈收集表.xlsx"
    // 将a标签添加到页面并模拟点击
    document.querySelectorAll("body")[0].appendChild(ele)
    ele.click()
    // 移除a标签
    ele.remove()



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
        <Table columns={columns} onChange={onChange} loading={loading} dataSource={listData}></Table>
      </div>
      {previewModal()}
    </div>
  )
}
