import * as React from 'react'
import { useState, useEffect } from 'react'
import { Table } from 'antd'
import { getTemplateHistory } from '../../api/template'
import { TEMPLATE_TYPES } from '../../constants/templates'
import { Moment } from 'moment'

import Filter from './Filter'
import UploadModal from './UploadModal'

import './index.css'

const COLUMNS = [{
  title: '上传日期',
  dataIndex: 'createdTime',
}, {
  title: '文件名称',
  dataIndex: 'fileName',
}, {
  title: '操作人',
  dataIndex: 'operator',
}, {
  title: '上传数量',
  dataIndex: 'num',
}, {
  title: '成功数量',
  dataIndex: 'successNum',
}, {
  title: '素材类型',
  dataIndex: 'type',
  render: (val) => TEMPLATE_TYPES[val]
}, {
  title: '状态',
  dataIndex: 'status',
  render: (val) => val === 'DELETED' ? '已上传' : '上传中'
}];

const Template = () => {
  const [loading, setLoading] = useState(false)
  const [templateList, setTemplateList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<{
    date?: Moment
  }>({})
  const [selectedRowKeys, setSelectedRows] = useState<string[]>([])

  const fetchList = async () => {
    setLoading(true)
    const { data } = await getTemplateHistory({ 
      ...filter,
      page,
      size: pageSize,
      date: filter.date?.format('YYYY-MM-DD'),
    })
    setLoading(false)
    if (data) {
      setTemplateList(data.result)
      setTotal(data.totalRecord)
    }
  }

  const handleSearch = (values) => {
    const query = {}
    Object.entries(values).forEach(([key, val]) => {
      if (val) {
        query[key] = val
      }
    })
    setFilter(query)
  }

  useEffect(
    () => {
      fetchList()
    },
    [filter, page, pageSize]
  )

  return (
    <div className="templates">
      <UploadModal onSuccess={fetchList} />
      <Filter loading={loading} handleSearch={handleSearch} selectedRowIds={selectedRowKeys} />
      <Table
        loading={loading}
        rowKey="id"
        size="small"
        columns={COLUMNS}
        dataSource={templateList}
        rowSelection={{
          selectedRowKeys,
          onChange: (val: string[]) => setSelectedRows(val)
        }}
        pagination={{
          total,
          pageSize,
          current: page,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t, [s, e]) => `${s}-${e} 共${t}项`,
          pageSizeOptions: ['10', '15', '20', '50', '100'],
          onChange: (newPage, size) => {
            setPage(newPage)
            setPageSize(size)
          }
        }}
      />
    </div>
  )
}

export default Template