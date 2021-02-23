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
  const [indexedDataSource, setIndexedDataSource] = useState(dataSource)
  const [paginationParams, setPaginationParams] = useState({ current: 1, pageSize: 10 })
  const [paginationCountParams, setPaginationCountParams] = useState({
    total: 0,
    showSizeChanger: false,
  })

  const changePage = (val: number) => {
    setPaginationParams({
      ...paginationParams,
      current: val,
    })
  }
  const changePageSize = (current: number, size: number) => {
    setPaginationParams({
      ...paginationParams,
      pageSize: size,
    })
  }

  // 默认给 dataSource 用索引设置 key
  useEffect(() => {
    if (dataSource && dataSource.length) {
      setIndexedDataSource(dataSource.map((x: any, i: number) => {
        x.key = x.key || i
        return x
      }))
    }
  }, [dataSource])

  useEffect(() => {
    setChangeFieldsCount(changeFieldsCount+1)
  }, [fields])

  useEffect(() => {
    if (changeFieldsCount % 2 === 0) return
    const itemHasError = fields.find((x: any) => x?.errors?.length)
    setIsValid(!itemHasError)
    if (itemHasError) {
      // TODO 显示校验错误的逻辑
      // notification.error({ message: JSON.stringify(itemHasError.errors[0]) })
    } else {
      setQueryParams(
        fields.reduce((h: any, c: any) => {
          const name = c.name[0]
          const config = query.find((x: QueryConfigItem) => x.name === name)
          const { format } = config || {}
          if (format) {
            format(c.value, h)
          } else {
            h[name] = c.value
          }
          return h
        }, {})
      )
    }
  }, [changeFieldsCount])

  useEffect(() => {
    const triggerQuery = isValid && queryParams && onQuery
    const params = {
      ...(queryParams || {}),
      pageNo: paginationParams.current,
      pageSize: paginationParams.pageSize,
    }
    if (triggerQuery) {
      const queryRes = onQuery(params)
      const isAsync = queryRes.then
      if (isAsync) {
        queryRes.then((data: any) => {
          const { totalElements = 0 } = data || {}
          setPaginationCountParams({
            ...paginationCountParams,
            total: totalElements,
          })
        })
      } else {
        const { totalElements = 0 } = queryRes || {}
        setPaginationCountParams({
          ...paginationCountParams,
          total: totalElements,
        })
      }
    }
  }, [queryParams, paginationParams])

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
          dataSource={indexedDataSource}
          bordered
          pagination={{
            ...pagination,
            ...paginationCountParams,
            ...paginationParams,
            onChange: changePage,
            onShowSizeChange: changePageSize,
          }}
          {...restTableProps}
        />
      )}
    </div>
  )
}
