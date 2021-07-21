import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Tabs, Form } from 'antd'
import { throttle } from 'lodash'
import { PhoneFilled, DownOutlined } from '@ant-design/icons'
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

  // ********************************************************* states

  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const isMobile = useMemo(() => params.get('mobile') === '1', [params])
  const isPC = useMemo(() => !isMobile, [isMobile])

  const [queryForm] = Form.useForm()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [lists, loading, refreshList] = useApi<ReportListResData<LeaveMessageListData[]> | null, getLeaveMessageListParams>(null, getLeaveMessageList)
  const [activeTab, setActiveTab] = useState<string>('1day')
  const [loadMore, setLoadMore] = useState(false)
  const [dataSource, setDataSource] = useState<LeaveMessageListData[]>([])
  useEffect(() => {
    if (dataSource.length === 0) {
      const items = lists?.result || []
      setDataSource(items)
    }
  }, [lists])

  const cardsRef = useRef<HTMLElement>()
  useEffect(() => {
    if (cardsRef.current) {
      const $el = cardsRef.current
      const checkScroll = throttle(async (e: any) => {
        // 门限差不多两卡片高
        const threshold = 350
        const shouldLoadMore = $el.scrollHeight - $el.scrollTop < $el.offsetHeight + threshold
        // console.log('shouldLoadMore: ', shouldLoadMore)
        if (shouldLoadMore && !loadMore) {
          setLoadMore(true)
          const lists = await refreshList({ pageNo: page + 1 })
          const items = lists?.result || []
          setPage(page + 1)
          setDataSource([...dataSource, ...items])
          setLoadMore(false)
        }
      }, 100)
      $el.addEventListener('scroll', checkScroll)
      return () => $el.removeEventListener('scroll', checkScroll)
    }
  }, [cardsRef.current, loadMore, dataSource, page])

  // ********************************************************* interactions

  const changeTab = (key: string) => {
    setPage(1)
    setDataSource([])
    refreshList()
    setActiveTab(key)
  }

  // ********************************************************* renders

  const $pcPage = useCallback(() => {
    if (isPC) {
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
  }, [isPC, lists, refreshList])

  const $cards = useCallback(tabKey => {
    if (!activeTab || tabKey !== activeTab || dataSource.length === 0) {
      return null
    }
    // console.log('[INFO] rendered:', tabKey, dataSource)
    // TODO REFACTOR components ListView
    return <div className="cards-con" ref={el => el && (cardsRef.current = el)}>
      {dataSource.map((item: LeaveMessageListData) => <Card item={item} key={item.id} />)}
      {loadMore && <div className='loading'>加载中...</div>}
    </div>
  }, [dataSource, activeTab, loadMore])

  const $mobilePage = useCallback(() => {
    if (isMobile) {
      return <Tabs centered defaultActiveKey="1day" onChange={changeTab}>
        <TabPane tab="今日" key="1day">
          {activeTab === '1day' && $cards('1day')}
        </TabPane>
        <TabPane tab="近7日" key="7day">
          {activeTab === '7day' && $cards('7day')}
        </TabPane>
        <TabPane tab="近30日" key="30day">
          {activeTab === '30day' && $cards('30day')}
        </TabPane>
        <TabPane tab="自定义" key="custom">
          {activeTab === 'custom' && $cards('custom')}
        </TabPane>
      </Tabs>
    }
  }, [isMobile, dataSource, refreshList, activeTab])

  return (
    <div className={"page-report page-report-message" + ' ' + (isMobile ? 'share' : '')}>
      {isPC && $pcPage()}
      {isMobile && $mobilePage()}
    </div>
  )
}


type CardProps = {
  item: LeaveMessageListData
}
function Card (props: CardProps) {
  const { item } = props
  const [shouldFold, setShouldFold] = useState(false)
  const [fold, setFold] = useState(true)

  const checkEllipses = useCallback((el: HTMLElement | null) => {
    if (el) {
      if (el.offsetHeight < el.scrollHeight) {
        setShouldFold(true)
      }
    }
  }, [setShouldFold])

  return <div className={"card " + (fold ? '' : 'unfold')} key={item.id}>
    <div className="header">
      <div className="left">
        <div className="title">用户刘女士留言</div>
        <div className="date">2017-10-01 12:00</div>
      </div>
      <div className="right">
        <div className="phone-btn">
          <PhoneFilled />
          <a href={`tel:${item.mobile}`}>{item.mobile}</a>
        </div>
      </div>
    </div>
    <div className="message line-2" ref={el => checkEllipses(el)}>
      {item.content}
    </div>
    <div className="source">
      <span>来源【{LeaveMessageChannelMap[item.type] || '未知'}】</span>{item.name}
    </div>
    {shouldFold && (
      <div className="fold-btn" onClick={() => setFold(!fold)}>
        <DownOutlined />
      </div>
    )}
  </div>
}

// LeaveMessagePage.wrappers = ['@/wrappers/path-auth']

export default LeaveMessagePage
