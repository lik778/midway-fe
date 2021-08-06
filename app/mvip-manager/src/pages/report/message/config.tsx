import React from 'react'
import dayjs from 'dayjs'
import { Popover, Radio } from 'antd'

import { LeaveMessageChannelMap } from '@/constants/report'
import { decodeHTMLCodeSafe } from '@/utils'

import { LeaveMessageListData } from '@/interfaces/report'
import { SearchListConfig } from '../components/search-list'

type Item = LeaveMessageListData

export const formatTime = (unixTime: number) => dayjs(unixTime * 1000).format('YYYY-MM-DD HH:mm:ss')

let hideContactBinded: any = null

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
          const renderText = r.name
            ? decodeHTMLCodeSafe(`${r.name}: ${r.message}`)
            : decodeHTMLCodeSafe(r.message)
          return <>
            <Popover content={renderText} trigger="hover">
              <span className="line-1">{renderText}</span>
            </Popover>
          </>
        }
      },
      {
        title: '联系方式',
        dataIndex: 'contact',
        width: 140,
        key: 'contact',
        render: (_: any, r: Item) => {
          const contact = r.contact || ''
          // TODO REFACTOR 如果内容不足4长度则不会隐藏
          const displayContact = contact.replace(/\d{4}$/, '****')
          const alwaysDisplayContent = displayContact.replace(/\*+$/, '')
          const [_dontcare, lastFour] = contact.split(alwaysDisplayContent)
          const display = (e: any) => {
            const $target = e.target
            if (hideContactBinded) {
              // 跨单元格选中时先隐藏上一个已打开的单元格
              if (hideContactBinded.target !== $target) {
                hideContactBinded()
              }
              window.removeEventListener('mousedown', hideContactBinded)
              delete hideContactBinded.target
              hideContactBinded = null
            }
            $target.innerText = lastFour

            /* 当一个单元格已经打开时，拦截点击事件，防止冒泡到触发隐藏单元格事件 */
            const catchEvt = (e: any) => e.stopPropagation()
            $target.addEventListener('mousedown', catchEvt, true)
            $target.addEventListener('click', catchEvt, true)

            hideContactBinded = () => {
              $target.innerText = '****'
              $target.removeEventListener('mousedown', catchEvt, true)
              $target.removeEventListener('click', catchEvt, true)
            }
            hideContactBinded.target = $target
            window.addEventListener('mousedown', hideContactBinded)
          }
          return <>
            <span className="contact">
              {alwaysDisplayContent}
              {lastFour && <span className="star" onClick={display}>****</span>}
            </span>
          </>
        }
      },
    ],
    pagination: {
      total,
      current: page,
      onChange: changePage
    }
  }
})
