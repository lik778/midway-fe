import React from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import { Popover, Button } from 'antd'

import { formatDateRange } from '@/utils'
import { LeaveMessageChannelMap } from '@/constants/report'

import { LeaveMessageListData } from '@/interfaces/report'
import { SearchListConfig } from '../components/search-list'
import { getLast24Hours, getLastWeek, getLastMonth, formatRange } from '@/utils'

type Item = LeaveMessageListData

export const formatTime = (unixTime: number) => dayjs(unixTime * 1000).format('YYYY-MM-DD HH:mm:ss')

export const LeaveMessageSearchListConfig = ({
  form,
  total,
  page,
  dataSource,
  trackWhenChangeTab,
  setQuery,
  onSearch,
  changePage,
}: Partial<SearchListConfig> & any
) => ({
  form,
  dataSource,
  pagiQueryKeys: {
    pageKey: 'page',
    sizeKey: 'size',
    retTotalKey: 'totalRecord'
  },
  query: [
    {
      label: '时间区间',
      name: 'date',
      type: 'range-picker',
      // ranges: {
      //   '今 日': [
      //     moment(moment().format('YYYY-MM-DD')),
      //     moment(moment().format('YYYY-MM-DD'))
      //   ],
      //   '近一周': getLastWeek(),
      //   '近一个月': getLastMonth(),
      //   '近三个月': [
      //     moment(moment().format('YYYY-MM-DD')).subtract(3, 'months'),
      //     moment(moment().format('YYYY-MM-DD'))
      //   ],
      // },
      // @ts-ignore
      format: (...args) => formatDateRange(...args, 'timeStart', 'timeEnd'),
      disabledDate: (date: moment.Moment) => {
        const isFuture = date > moment().endOf('day')
        const isOlderThan3Months = date < moment().subtract(3, 'months')
        return isFuture || isOlderThan3Months
      }
    },
    {
      key: 'range-quick-picker',
      type: 'render',
      span: 8,
      style: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      },
      render() {
        return <>
          <Button
            onClick={() => {
              trackWhenChangeTab()
              setQuery(getLast24Hours(null, true))}
            }
          >今日</Button>
          <Button
            onClick={() => {
              trackWhenChangeTab()
              setQuery(getLastWeek(null, true))}
            }
            style={{ marginLeft: 14 }}
          >近一周</Button>
          <Button
            onClick={() => {
              trackWhenChangeTab()
              setQuery(getLastMonth(null, true))}
            }
            style={{ marginLeft: 14 }}
          >近一个月</Button>
          <Button
            onClick={() => {
              trackWhenChangeTab()
              setQuery([
                moment(moment().format('YYYY-MM-DD')).subtract(3, 'months'),
                moment(moment().format('YYYY-MM-DD')).add(1, 'day').subtract(1, 'second')
              ])}
            }
            style={{ marginLeft: 14 }}
          >近三个月</Button>
        </>
      }
    },
    {
      key: 'search-button',
      type: 'render',
      render: () => <Button type="primary" onClick={() => onSearch()}>查询</Button>
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
            <Popover content={r.sourceName} trigger="hover">
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
        render: (_: any, r: Item) => <a href={r.sourceUrl} target="__blank">查看详情</a>
      },
      {
        title: '留咨内容',
        dataIndex: 'message',
        minWidth: 440,
        key: 'message',
        render: (_: any, r: Item) => {
          return <>
            <Popover content={r.message} trigger="hover">
              <span className="line-1">{r.name}: {r.message}</span>
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
    ],
    pagination: {
      total,
      current: page,
      onChange: changePage
    }
  }
})
