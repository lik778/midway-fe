import React, { useCallback, useMemo } from 'react'
import { Tabs, Form } from 'antd'
import { PhoneFilled } from '@ant-design/icons'
import Loading from '@/components/loading'
import MainTitle from '@/components/main-title'
import Query from '../components/search-list'

import { useApi } from '@/hooks/api'
import { getLeaveMessageList } from '@/api/report'
import { LeaveMessageSearchListConfig } from './config'

import { LeaveMessageChannelMap } from '@/constants/report'
import { ReportListResData, getLeaveMessageListParams, LeaveMessageListData } from '@/interfaces/report'

import "./index.less"

const TabPane = Tabs.TabPane

function LeaveMessagePage() {
  const isMobile = useMemo(() => {
    var searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('mobile') === '1'
  }, [])
  const [queryForm] = Form.useForm()
  const [lists, loading, refreshList] = useApi<ReportListResData<getLeaveMessageListParams[]> | null, LeaveMessageListData>(null, getLeaveMessageList)

  const $pcPage = useMemo(() => {
    if (!isMobile) {
      return <>
        <MainTitle title="留资报表" />
        <div className="container">
          {loading && <Loading />}
          <div className={"segment" + ' ' + (loading ? 'hide' : '')}>
            <h2>留资报表</h2>
            <Query
              onQuery={refreshList}
              config={LeaveMessageSearchListConfig({
                form: queryForm,
                dataSource: lists?.result
              })}
            />
          </div>
        </div>
      </>
    }
    return null
  }, [isMobile])

  const changeTab = (key) => {
    console.log(key)
  }

  const $cards = useMemo(() => {
    const items = lists?.result || []
    return <div className="cards-con">
      {items.map((item: LeaveMessageListData) => {
        return <div className="card" key={item.id}>
          <div className="header">
            <div className="left">
              <div className="title">用户刘女士留言</div>
              <div className="date">2017-10-01 12:00</div>
            </div>
            <div className="right">
              <div className="phone-btn"><PhoneFilled/> 13807823184</div>
            </div>
          </div>
          <div className="message line-2">{item.content}</div>
          <div className="source">
            <span>来源【{LeaveMessageChannelMap[item.type] || '未知'}】</span>{item.name}
          </div>
        </div>
      })}
    </div>
  }, [lists])

  return (
    <div className={"page-report page-report-keyword" + ' ' + (isMobile ? 'share' : '')}>
      {!isMobile ? $pcPage : (
        <>
          <Tabs defaultActiveKey="1" onChange={changeTab}>
            <TabPane tab="今日" key="1day">
              {$cards}
            </TabPane>
            <TabPane tab="近7日" key="7day">
              {$cards}
            </TabPane>
            <TabPane tab="近30日" key="30day">
              {$cards}
            </TabPane>
            <TabPane tab="自定义" key="custom">
              {$cards}
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  )
}

LeaveMessagePage.wrappers = ['@/wrappers/path-auth']

export default LeaveMessagePage
