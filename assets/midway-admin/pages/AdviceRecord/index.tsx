import * as React from 'react'
import { useEffect, useState } from 'react'
import { Table, Button, Pagination } from 'antd';
import { getAdviceList, getDownload } from '../../api/adviceRecord'
import { PageParams } from '../../interfaces/api'
import { Advicerespone } from '../../interfaces/adviceRecord'
import './index.css'

interface tableAttr {

}
export default () => {
  // const [pagelist, setPagelist] = useState<PageParams>({ page: 1, size: 20 })
  const [listData, setListData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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
        <Button type="primary" size="small" onClick={() => handleClick(text, record)}> 查看</ Button>
      )
    }
  ]
  const handleClick = (text: any, items: any) => {
    setLoading(true)
    console.log(items);
    setLoading(false)
  }
  const onChange = (event: any) => {
  }
  const handleDown = async () => {
    const res = await getDownload()
    const blob = res.data
    const reader = new FileReader()
    reader.onload = (e) => {
      let a = document.createElement('a')
      a.download = __filename
      a.href = window.URL.createObjectURL(blob)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

  }
  return (
    <div className="advice-record">
      <div className="download-title">
        <div className="download" onClick={handleDown}>
          下载
        </div>
      </div>
      <div className="table-down">
        <Table columns={columns} loading={loading} dataSource={listData}></Table>
      </div>
    </div>
  )
}
