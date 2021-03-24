import moment from 'moment'
import { QueryConfigItem } from '@/pages/report/components/quick-form/interface'
import { getLastMonth, formatDateRange, isUrl } from '@/utils';
import React from 'react';

interface Config {
  form: any
  dataSource?: any,
  query?: QueryConfigItem[],
  render?: any
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
      disabledDate: (date: moment.Moment) => date > moment().endOf('day')
    }
  ]
})

export const pvListConfig = ({
  form,
  dataSource,
  render
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
      disabledDate: (date: moment.Moment) => date > moment().endOf('day')
    }
  ],
  table: {
    columns: [
      {
        title: '访问页面',
        dataIndex: 'webPage',
        key: 'webPage',
        ellipsis: true,
        render: (text: string) => isUrl(text) ? <a style={{ color: '#096DD9' }} href={text} target="_blank">{ text }</a> : text
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
    ]
  }
})
