import React, { useState, useEffect } from 'react'
import { Table, notification } from 'antd'

import InlineForm from '@/components/quick-form'
import { QueryConfigItem } from '@/components/quick-form/interface'

interface Props {
  config: any
  onQuery: any
  loading?: boolean
}
export default function SearchList (props: Props) {
  const { config, onQuery, loading } = props
  const { form, dataSource, query, table } = config
  const { columns, pagination, ...restTableProps } = table || {}

  const [values, setValues] = useState<any>()
  // fields 会更新两次，一次改变值时，一次校验，所以要等两次结束后才能更新 values
  const [changeFieldsCount, setChangeFieldsCount] = useState(0)
  const [fields, setFields] = useState(query.map((x: QueryConfigItem) => ({
    name: [x.name],
    value: x.value
  })))
  const [isValid, setIsValid] = useState<boolean>(true)
  const [queryParams, setQueryParams] = useState(null)

  useEffect(() => {
    setChangeFieldsCount(changeFieldsCount+1)
  }, [fields])

  useEffect(() => {
    if (changeFieldsCount % 2 === 0) return
    const itemHasError = fields.find((x: any) => x?.errors?.length)
    setIsValid(!itemHasError)
    if (itemHasError) {
      // TODO 点击按钮再显示？
      // notification.error({ message: JSON.stringify(itemHasError.errors[0]) })
    } else {
      setQueryParams(fields.map((x: any) => ({ [x.name[0]]: x.value })))
    }
  }, [changeFieldsCount])

  useEffect(() => {
    isValid && queryParams && onQuery && onQuery(queryParams)
  }, [queryParams])

  return (
    <div className="cmpt-search-list">
      {query && form && (
        <InlineForm
          className="cmpt-search-list-query"
          form={form}
          items={query}
          fields={fields}
          onFieldsChange={(newFields: any) => setFields(newFields)}
          onValuesChange={(newVals: any) => setValues(newVals)}
          // loading={loading}
        />
      )}
      {table && (
        <Table
          className="cmpt-search-list-table"
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          bordered
          {...restTableProps}
        />
      )}
    </div>
  )
}
