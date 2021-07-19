import React from 'react'
import moment from 'moment'
import { history } from 'umi'
import { Popover, Button } from 'antd'

import { getLast24Hours, formatDateRange } from '@/utils'
import { LeaveMessageChannelMap } from '@/constants/report'

import { LeaveMessageListData } from '@/interfaces/report'
import { SearchListConfig } from '../components/search-list'

type Item = LeaveMessageListData

export const LeaveMessageSearchListConfig = ({
  form,
  dataSource,
}: Partial<SearchListConfig>) => ({
  form,
  dataSource,
  query: [
    {
      label: '时间区间',
      name: 'date',
      type: 'range-picker',
      value: getLast24Hours(),
      format: formatDateRange,
      disabledDate: (date: moment.Moment) => date > moment().endOf('day')
    },
  ],
  table: {
    columns: [
      {
        title: '时间',
        dataIndex: 'date',
        width: 180,
        key: 'date'
      },
      {
        title: '来源',
        dataIndex: 'type',
        width: 65,
        key: 'type',
        render: (_: any, r: any) => LeaveMessageChannelMap[r.type]
      },
      {
        title: '落地页名称',
        dataIndex: 'name',
        width: 200,
        key: 'name',
        render: (_: any, r: Item) => {
          return <>
            <Popover content={r.name} title="落地页详情" trigger="hover">
              <span className="line-1">{r.name}</span>
            </Popover>
          </>
        }
      },
      {
        title: '落地页详情',
        dataIndex: 'url',
        width: 120,
        key: 'url',
        render: (_: any, r: Item) => <Button type="link"><a href={r.url} target="__blank">查看详情</a></Button>
      },
      {
        title: '留资内容',
        dataIndex: 'content',
        minWidth: 440,
        key: 'content',
        render: (_: any, r: Item) => {
          return <>
            <Popover content={r.content} title="落地页详情" trigger="hover">
              <span className="line-1">{r.content}</span>
            </Popover>
          </>
        }
      },
      {
        title: '联系方式',
        dataIndex: 'mobile',
        width: 140,
        key: 'mobile'
      },
    ]
  }
})
