import * as React from 'react'
import { useState } from 'react'
import { Button, Select, Form, Input, DatePicker } from 'antd'
import { TEMPLATE_TYPES } from '../../constants/templates'
import { downloadFile } from '../../api/template'
const { Option } = Select;

const Filter = ({
  loading,
  selectedRowIds,
  handleSearch
}: {
  loading: boolean
  selectedRowIds: string[]
  handleSearch: (val: any) => void
}) => {
  const [downloadLoading, setDownloadLoading] = useState(false)

  const handleDownload = async () => {
    setDownloadLoading(true)
    await downloadFile({ ids: selectedRowIds.join(',') })
    setDownloadLoading(false)
  }

  return (
    <div className="templates-filter">
       <Form layout="inline" onFinish={handleSearch}>
        <Form.Item
          label="日期"
          name="date"
        >
          <DatePicker placeholder="请选择日期" />
        </Form.Item>
        <Form.Item
          label="文件名称"
          name="fileName"
        >
          <Input placeholder="请输入文件名称" />
        </Form.Item>
        <Form.Item
          label="操作人"
          name="usrId"
        >
          <Input placeholder="请输入操作人" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item
          label="素材类型"
          name="type"
        >
          <Select style={{ width: 150 }} placeholder="请选择素材类型">
            <Option value="" key="all">全部</Option>
            {Object.entries(TEMPLATE_TYPES).map((([key, val] )=> (
              <Option value={key} key={key}>{val}</Option>
            )))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
          >查询</Button>
        </Form.Item>
      </Form>
      <Button 
        onClick={handleDownload}
        loading={downloadLoading}
        disabled={selectedRowIds.length === 0}
      >下载</Button>
    </div>
  )
}
export default Filter
