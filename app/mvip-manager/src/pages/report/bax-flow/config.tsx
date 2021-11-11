import dayjs from 'dayjs'
import { PlatformLabelMap } from '@/constants/report'
import { FlowDetailData } from '@/interfaces/report'
import { getLastMonth, formatDateRange, isUrl } from '@/utils';
import React from 'react';

interface Config {
  form: any
  dataSource?: any
}

export const flowConfig = ({
  form
}: Config) => ({
  form,
  query: [
    {
      label: '时间区间',
      name: 'date',
      type: 'range-picker',
      value: getLastMonth(),
      format: formatDateRange,
      disabledDate: (date: dayjs.Dayjs ) => date > dayjs().endOf('day')
    }
  ]
})

export const visitListConfig = ({
  form,
  dataSource
}: Config) => ({
  form,
  dataSource,
  query: [
    {
      label: '时间区间',
      name: 'date',
      type: 'range-picker',
      value: getLastMonth(),
      format: formatDateRange,
      disabledDate: (date: dayjs.Dayjs ) => date > dayjs().endOf('day')
    }
  ],
  table: {
    columns: [
      {
        title: '访问页面',
        dataIndex: 'webPage',
        key: 'webPage',
        ellipsis: true,
        render: (text: string) => (isUrl(text) ? <a style={{ color: '#096DD9' }} href={text} target="_blank">{ text }</a> : text)
      },
      {
        title: '访问IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '访问时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '搜索引擎',
        dataIndex: 'platform',
        key: 'platform',
        render: (_: any, row: FlowDetailData) => PlatformLabelMap[row.platform]
      },
      {
        title: '关键词',
        dataIndex: 'keyword',
        key: 'keyword',
      },
    ]
  }
})
