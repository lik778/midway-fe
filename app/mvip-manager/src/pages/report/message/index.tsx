import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Tabs, Form, Calendar } from 'antd'
import { throttle } from 'lodash'
import { PhoneFilled, DownOutlined } from '@ant-design/icons'
import Loading from '@/components/loading'
import MainTitle from '@/components/main-title'
import Query from '../components/search-list'

import { useApi } from '@/hooks/api'
import { getLeaveMessageList } from '@/api/report'
import { LeaveMessageSearchListConfig } from './config'
import { getLast24Hours, getLastWeek, getLastMonth, formatTimeRange } from '@/utils'

import { LeaveMessageChannelMap } from '@/constants/report'
import { ReportListResData, getLeaveMessageListParams, LeaveMessageListData } from '@/interfaces/report'

import "./index.less"

const TabPane = Tabs.TabPane
const PAGESIZE = 10

function LeaveMessagePage() {

  // ********************************************************* states

  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const isMobile = useMemo(() => params.get('mobile') === '1', [params])
  const isPC = useMemo(() => !isMobile, [isMobile])

  const [queryForm] = Form.useForm()
  const [page, setPage] = useState(1)
  const [range, setRange] = useState<any[]>(getLast24Hours())
  const [loadMore, setLoadMore] = useState(false)
  const [noMore, setNoMore] = useState(false)

  const defaultQueries = useMemo(() => {
    const [startTime, endTime] = formatTimeRange(range)
    return {
      startTime,
      endTime,
      pageNo: 1
    }
  }, [range])
  // 第一次请求时也需要设置 noMore 等状态
  const getList = useCallback(async (...args: any[]) => {
    const ret: any = await getLeaveMessageList(...args)
    const isSuccess = ret && (ret.success || ret.code === 0)
    const data = ret && ret.data
    const items = data?.result || []
    if (!isSuccess || items.length < PAGESIZE) {
      setNoMore(true)
    }
    return ret
  }, [noMore])
  const [lists, loading, refreshList] = useApi<ReportListResData<LeaveMessageListData[]> | null, getLeaveMessageListParams>(null, getList, defaultQueries)
  const [activeTab, setActiveTab] = useState<string>('1day')
  const [dataSource, setDataSource] = useState<LeaveMessageListData[]>([])
  useEffect(() => {
    if (dataSource.length === 0) {
      const items = lists?.result || []
      setDataSource(items)
    }
  }, [lists])

  const isFirstLoad = useMemo(() => !loadMore && loading, [loadMore, loading])

  const cardsRef = useRef<HTMLElement>()
  useEffect(() => {
    if (cardsRef.current) {
      const $el = cardsRef.current
      const checkScroll = throttle(async (e: any) => {
        // 门限差不多三张卡片高
        const threshold = 175 * 3
        const shouldLoadMore = $el.scrollHeight - $el.scrollTop < $el.offsetHeight + threshold
        // console.log('shouldLoadMore: ', shouldLoadMore)
        if (shouldLoadMore && !loadMore && !noMore) {
          setLoadMore(true)
          const [startTime, endTime] = formatTimeRange(range)
          const lists = await refreshList({
            startTime,
            endTime,
            pageNo: page + 1
          } as getLeaveMessageListParams)
          const items = lists?.result || []
          if (items.length < PAGESIZE) {
            setNoMore(true)
          }
          setPage(page + 1)
          setDataSource([...dataSource, ...items])
          setLoadMore(false)
        }
      }, 100)
      $el.addEventListener('scroll', checkScroll)
      return () => $el.removeEventListener('scroll', checkScroll)
    }
  }, [cardsRef.current, loadMore, noMore, dataSource, page, range])

  // ********************************************************* interactions

  const changeTab = (key: string) => {
    setPage(1)
    setNoMore(false)
    setDataSource([])
    setActiveTab(key)
    let range
    switch (key) {
      case '1day':
        range = getLast24Hours()
        break
      case '7day':
        range = getLastWeek()
        break
      case '30day':
        range = getLastMonth()
        break
    }
    if (range) {
      setRange(range)
      const [startTime, endTime] = formatTimeRange(range)
      refreshList({
        startTime,
        endTime,
        pageNo: 1
      })
    } else {
      setRange([])
      console.warn('[WARN] no range params when changeTab')
    }
  }

  const onSelectDate = (date: any) => {
    const range = getLast24Hours(date)
    setPage(1)
    setDataSource([])
    setRange(range)
    const [startTime, endTime] = formatTimeRange(range)
    refreshList({
      startTime,
      endTime,
      pageNo: 1
    })
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
      {noMore && <div className='loading'>没有更多啦~</div>}
    </div>
  }, [dataSource, activeTab, loadMore, noMore])

  const $mobilePage = useCallback(() => {
    if (isMobile) {
      return <Tabs centered defaultActiveKey="1day" onChange={changeTab}>
        <TabPane tab="今日" key="1day">
          {isFirstLoad && <Loading prevent toast />}
          {$cards('1day')}
        </TabPane>
        <TabPane tab="近7日" key="7day">
          {isFirstLoad && <Loading prevent toast />}
          {$cards('7day')}
        </TabPane>
        <TabPane tab="近30日" key="30day">
          {$cards('30day')}
        </TabPane>
        <TabPane tab="自定义" key="custom">
          {isFirstLoad && <Loading prevent toast />}
          {range.length === 0 ? (
            <Calendar
              fullscreen={false}
              headerRender={undefined}
              defaultValue={undefined}
              onSelect={onSelectDate}
            />
          ) : $cards('custom')}
        </TabPane>
      </Tabs>
    }
  }, [isMobile, dataSource, refreshList, activeTab, range])

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
