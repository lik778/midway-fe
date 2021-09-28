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
  const [pagelist, setPagelist] = useState<PageParams>({ page: 1, size: 20 })
  const [listData, setListData] = useState<any[]>([])
  useEffect(() => {
    getList()
  }, [])
  const getList = async () => {
    const res = await getAdviceList(pagelist)
    if (res?.success) {
      setListData(((res.data as any).result).map((x, i) => ({ ...x, key: i })))
    }
  }
  const handleClick = (text: any, items: any) => {
    console.log(items);

  }
  const onChange = (event: any) => {
  }
  const handleDown = async () => {
    const res = await getDownload()
    console.log(res);

  }
  return (
    <div className="advice-record">
      <div className="download-title">
        <div className="download" onClick={handleDown}>
          下载
        </div>
      </div>
      <div className="table-down">
        <Table columns={columns} dataSource={listData}></Table>
      </div>
      <Pagination onChange={onChange} total={50} />
    </div>
  )
}
