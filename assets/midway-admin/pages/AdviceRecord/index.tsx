import React, { useEffect, useState } from 'react'
import { Table, Button, Pagination } from 'antd';
import './index.css'
import { getAdviceList } from '../../api/adviceRecord'
import { PageParams } from '../../interfaces/api'
import { Advicerespone } from '../../interfaces/adviceRecord'
interface tableAttr {

}
const AdviceRecord = () => {
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
        <Button type="primary" shape="circle" size="small" onClick={() => handleClick(record)}> 查看</ Button>
      )
    }
  ]
  const [pagelist, setPagelist] = useState<PageParams>({ page: 2, size: 20 })
  const [adviceList, setAdviceList] = useState<Advicerespone[]>(null)
  useEffect(() => {
    const getList = async () => {
      const res = await getAdviceList(pagelist)
      if (res?.success) {
        const { result, pageSize, totalPage, totalRecord } = res.data
        setAdviceList(result)
      }
    }
  }, [])
  const handleClick = (items: any) => {

  }
  const onChange = (event: any) => {

  }
  return (
    <div className="advice-record">
      <div className="download">
        下载
      </div>
      <div className="table-down">
        <Table columns={columns} dataSource={adviceList}></Table>
      </div>
      <Pagination onChange={onChange} total={50} />
    </div>
  )
}

export default AdviceRecord