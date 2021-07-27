import React from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import { Popover, Button, Radio } from 'antd'

import { formatDateRange } from '@/utils'
import { LeaveMessageChannelMap } from '@/constants/report'

import { LeaveMessageListData } from '@/interfaces/report'
import { SearchListConfig } from '../components/search-list'

type Item = LeaveMessageListData

export const formatTime = (unixTime: number) => dayjs(unixTime * 1000).format('YYYY-MM-DD HH:ss')

export const LeaveMessageSearchListConfig = ({
  form,
  dataSource,
  onSearch,
  activeTab,
  handleChangeRange,
}: Partial<SearchListConfig> & {
  activeTab: string,
  onSearch: () => void,
  handleChangeRange: (e: any) => void
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
        return (
          <Radio.Group value={activeTab} onChange={handleChangeRange} >
            <Radio.Button value="1day" key="1day">今日数据</Radio.Button>
            <Radio.Button value="7day" key="7day">近7天</Radio.Button>
            <Radio.Button value="30day" key="30day">近30天</Radio.Button>
          </Radio.Group >
        )
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
