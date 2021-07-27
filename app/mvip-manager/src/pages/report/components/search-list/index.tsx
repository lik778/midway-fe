import React, { useState, useEffect } from 'react'
import { Table, notification } from 'antd'

import InlineForm from '@/pages/report/components/quick-form'
import { QueryConfigItem } from '@/pages/report/components/quick-form/interface'

export interface SearchListConfig {
  form: any
  dataSource: any
  query: any
  table: any
  pagiQueryKeys?: {
    pageKey: string,
    sizeKey: string
  }
}

// TODO doc props
interface Props {
  config: SearchListConfig
  bindForm?: boolean
  onQuery?: any
  onQueryChange?: (queries: any) => void;
  loading?: boolean
}
export default function SearchList (props: Props) {
  const { bindForm, config, onQuery, onQueryChange, loading } = props
  const { form, dataSource, query, table, pagiQueryKeys } = config
  const { pageKey = 'pageNo', sizeKey = 'pageSize' } = pagiQueryKeys || {}
  const { columns, pagination = {}, ...restTableProps } = table || {}

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
  const [paginationParams, setPaginationParams] = useState({ [pageKey]: 1, [sizeKey]: 10 })
  const [paginationCountParams, setPaginationCountParams] = useState({
    total: 0,
    showSizeChanger: false,
  })

  const changePage = (val: number) => {
    setPaginationParams({
      ...paginationParams,
      [pageKey]: val,
    })
  }
  const changePageSize = (_: any, size: number) => {
    setPaginationParams({
      ...paginationParams,
      [sizeKey]: size,
    })
  }

  // 默认给 dataSource 用索引设置 key
  useEffect(() => {
    if (dataSource && dataSource.length >= 0) {
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
      console.log('[WARN]', itemHasError)
      // notification.error({ message: JSON.stringify(itemHasError.errors[0]) })
    } else {
      const params = fields.reduce((h: any, c: any) => {
        const name = c.name[0]
        const config = query.find((x: QueryConfigItem) => x.name === name)
        const { format } = config || {}
        if (format) {
          const res = format(c.value, h)
          if (res) h[name] = res
        } else {
          h[name] = c.value
        }
        return h
      }, {})
      setQueryParams(params)
    }
  }, [changeFieldsCount])

  useEffect(() => {
    onQueryChange && onQueryChange(queryParams)
  }, [queryParams])

  useEffect(() => {
    const triggerQuery = isValid && queryParams && onQuery
    const params = {
      ...(queryParams || {}),
      [pageKey]: paginationParams[pageKey],
      [sizeKey]: paginationParams[sizeKey],
    }
    // TODO REFACTOR 请求函数和返回值解耦
    if (triggerQuery) {
      const queryRes = onQuery(params)
      const isAsync = queryRes && queryRes.then
      if (isAsync) {
        queryRes.then((data: any) => {
          const {
            totalElements = 0,
            totalRecord = 0,
          } = data || {}
          setPaginationCountParams({
            ...paginationCountParams,
            total: totalElements || totalRecord,
          })
        })
      } else {
        const {
          totalElements = 0,
          totalRecord = 0
        } = queryRes || {}
        setPaginationCountParams({
          ...paginationCountParams,
          total: totalElements || totalRecord,
        })
      }
    }
  }, [queryParams, paginationParams[pageKey], paginationParams[sizeKey]])

  return (
    <div className="cmpt-search-list">
      {query && form && (
        <InlineForm
          className="cmpt-search-list-query"
          bindForm={bindForm}
          form={form}
          items={query}
          fields={fields}
          onFieldsChange={(newFields: any) => setFields(newFields)}
          onValuesChange={(newVals: any) => { setValues(newVals); changePage(1) }}
        />
      )}
      {table && (
        <Table
          className="cmpt-search-list-table"
          columns={columns}
          loading={loading}
          dataSource={indexedDataSource}
          bordered
          pagination={{
            ...paginationCountParams,
            ...paginationParams,
            onChange: changePage,
            onShowSizeChange: changePageSize,
            ...pagination
          }}
          {...restTableProps}
        />
      )}
    </div>
  );
}
