import React from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import { Popover, Button } from 'antd'

import { formatDateRange } from '@/utils'
import { LeaveMessageChannelMap } from '@/constants/report'

import { LeaveMessageListData } from '@/interfaces/report'
import { SearchListConfig } from '../components/search-list'

type Item = LeaveMessageListData

export const formatTime = (unixTime: number) => dayjs(unixTime * 1000).format('YYYY-MM-DD HH:mm:ss')

export const LeaveMessageSearchListConfig = ({
  form,
  dataSource,
  onSearch,
  activeTab,
  changeTab,
}: Partial<SearchListConfig> & {
  activeTab: string,
  onSearch: () => void,
  changeTab: (e: any) => void
}) => ({
  form,
  dataSource,
  pagiQueryKeys: {
    pageKey: 'page',
    sizeKey: 'size'
  },
  query: [
    {
      label: '时间区间',
      name: 'date',
      type: 'range-picker',
      // @ts-ignore
      format: (...args) => formatDateRange(...args, 'timeStart', 'timeEnd'),
      disabledDate: (date: moment.Moment) => date > moment().endOf('day'),
    },
    {
      key: 'range-quick-picker',
      type: 'render',
      render() {
        return <>
          <Button onClick={() => changeTab('1day')}>今日</Button>
          <Button onClick={() => changeTab('7day')} style={{marginLeft: 16}}>近7天</Button>
          <Button onClick={() => changeTab('30day')} style={{marginLeft: 16}}>近30天</Button>
        </>
      }
    },
    {
      key: 'search-button',
      type: 'render',
      render: () => <Button type="primary" onClick={onSearch}>查询</Button>
    }
  ],
  table: {
    columns: [
      {
        title: '时间',
        dataIndex: 'date',
        width: 180,
        key: 'date',
        render: (_: any, r: Item) => formatTime(+r.time)
      },
      {
        title: '来源',
        dataIndex: 'type',
        width: 65,
        align: 'center',
        key: 'type',
        render: (_: any, r: Item) => LeaveMessageChannelMap[r.sourceType]
      },
      {
        title: '落地页名称',
        dataIndex: 'sourceName',
        width: 200,
        key: 'sourceName',
        render: (_: any, r: Item) => {
          return <>
            <Popover content={r.sourceName} title="落地页详情" trigger="hover">
              <span className="line-1">{r.sourceName}</span>
            </Popover>
          </>
        }
      },
      {
        title: '落地页详情',
        dataIndex: 'sourceUrl',
        width: 120,
        align: 'center',
        key: 'sourceUrl',
        render: (_: any, r: Item) => <Button type="link"><a href={r.sourceUrl} target="__blank">查看详情</a></Button>
      },
      {
        title: '留咨内容',
        dataIndex: 'message',
        minWidth: 440,
        key: 'message',
        render: (_: any, r: Item) => {
          return <>
            <Popover content={r.message} title="落地页详情" trigger="hover">
              <span className="line-1">{r.message}</span>
            </Popover>
          </>
        }
      },
      {
        title: '联系方式',
        dataIndex: 'contact',
        width: 140,
        key: 'contact'
      },
    ]
  }
})
