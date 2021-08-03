import React from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import { Popover, Radio } from 'antd'

import { LeaveMessageChannelMap } from '@/constants/report'

import { LeaveMessageListData } from '@/interfaces/report'
import { SearchListConfig } from '../components/search-list'

type Item = LeaveMessageListData

export const formatTime = (unixTime: number) => dayjs(unixTime * 1000).format('YYYY-MM-DD HH:mm:ss')

export const LeaveMessageSearchListConfig = ({
  form,
  total,
  page,
  dataSource,
  activeTab,
  switchTab,
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
  autoLayout: false,
  query: [
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
        return <Radio.Group onChange={switchTab} value={activeTab} key="range-quick-picker">
          <Radio.Button value='3years'>默认</Radio.Button>
          <Radio.Button value='1mon' style={{ marginLeft: 14 }}>近一个月</Radio.Button>
          <Radio.Button value='3mon' style={{ marginLeft: 14 }}>近三个月</Radio.Button>
          <Radio.Button value='6mon' style={{ marginLeft: 14 }}>近半年</Radio.Button>
        </Radio.Group>
      }
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
              <span className="line-1">{r.sourceName || '-'}</span>
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
              <span className="line-1">{r.name ? `${r.name}: ${r.message}` : r.message}</span>
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
