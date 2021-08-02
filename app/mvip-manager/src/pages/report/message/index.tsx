import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import moment from 'moment'
import { Tabs, Form, Calendar } from 'antd'
import { throttle } from 'lodash'
import { PhoneFilled, DownOutlined } from '@ant-design/icons'

import Loading from '@/components/loading'
import Query from '../components/search-list'

import { useApi } from '@/hooks/api'
import { track } from '@/api/common'
import { getLeaveMessageList } from '@/api/report'
import { errorMessage } from '@/components/message'
import { LeaveMessageSearchListConfig, formatTime } from './config'
import { getCookie, getLast24Hours, getLastWeek, getLastMonth, formatRange } from '@/utils'

import { LeaveMessagePageFromEnum } from '@/enums/report'
import { LeaveMessageChannelMap } from '@/constants/report'
import { ReportListResData, getLeaveMessageListParams, LeaveMessageListData } from '@/interfaces/report'

import "./index.less"

const TabPane = Tabs.TabPane
const PAGESIZE = 10
const TRACK_TYPE = 'shop-mvip-message-page'

// 可以的话请把这玩意儿删了
function LeaveMessagePage() {

  // ********************************************************* states

  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  // FIXME type
  const from = useMemo<LeaveMessagePageFromEnum | null>(() => params.get('from') || LeaveMessagePageFromEnum.MVIP, [params])
  const isMobile = useMemo(() => params.get('mobile') === '1', [params])
  const isPC = useMemo(() => !isMobile, [isMobile])
  const uid = useMemo(() => getCookie('__u'), [])

  const [queryForm] = Form.useForm()
  const last24Hrs = useMemo(() => getLast24Hours(null, true), [])
  const [query, setQuery] = useState<any>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [range, setRange] = useState<any[]>(last24Hrs)
  const [loadMore, setLoadMore] = useState(false)
  const [noMore, setNoMore] = useState(false)

  // TODO FIXME 线下数据过滤逻辑应该放到 tracker.service
  const trackEvent = useCallback((arg: any) => {
    if (from && uid) {
      track(arg)
    }
  }, [from, uid])

  // 页面来源打点
  useEffect(() => {
    if (from && uid) {
      track({
        eventType: TRACK_TYPE,
        data: {
          event_type: 'page-pv',
          uid,
          from,
        }
      })
    }
  }, [from, uid])

  const defaultQueries = useMemo(() => {
    const [timeStart, timeEnd] = formatRange(range)
    return {
      timeStart,
      timeEnd,
      page: 1,
      size: PAGESIZE
    }
  }, [range])

  const getList = useCallback(async (query: getLeaveMessageListParams) => {
    try {
      const ret: any = await getLeaveMessageList(query)
      const data = ret?.data?.res
      const isSuccess = ret && (ret.success || ret.code === 200)
      const items = data?.result || []
      const total = data?.totalRecord

      // 移动端留咨 PV 打点，每项都单独打，业务要求，
      // 不过现微信后台点开菜单栏的活跃数才几百，
      // 推测这个接口每日最多千记请求数量，暂时可以接受
      if (items.length) {
        items.map((x: LeaveMessageListData) => {
          trackEvent({
            eventType: TRACK_TYPE,
            data: {
              event_type: 'mobile-item-pv',
              item_id: x.id,
              uid,
              from,
            }
          })
        })
      }

      if (!isSuccess || items.length < PAGESIZE) {
        setNoMore(true)
      }
      setTotal(total)
      const adapter = { ...ret, data }
      return adapter
    } catch (err) {
      console.error('[ERROR]', err)
      setNoMore(true)
    }
  }, [isMobile])

  const [lists, loading, refreshList] = useApi<ReportListResData<LeaveMessageListData[]> | null, getLeaveMessageListParams | null>(null, getList, defaultQueries)
  const [activeTab, setActiveTab] = useState<string>('1day')
  const [dataSource, setDataSource] = useState<LeaveMessageListData[]>([])
  useEffect(() => {
    if (lists && dataSource.length === 0) {
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
          const [timeStart, timeEnd] = formatRange(range)
          const lists = await refreshList({
            timeStart,
            timeEnd,
            page: page + 1,
            size: PAGESIZE
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
        range = getLast24Hours(null, true)
        break
      case '7day':
        range = getLastWeek(null, true)
        break
      case '30day':
        range = getLastMonth(null, true)
        break
    }
    if (range) {
      setRange(range)
      const [timeStart, timeEnd] = formatRange(range)
      refreshList({
        timeStart,
        timeEnd,
        page: 1,
        size: PAGESIZE
      })
    } else {
      setRange([])
      console.warn('[WARN] no range params when changeTab')
    }
  }

  useEffect(() => {
    if (range) {
      queryForm.setFieldsValue({
        date: range
      })
      const [timeStart, timeEnd] = formatRange(last24Hrs)
      setQuery({ timeStart, timeEnd })
    }
  }, [range, setQuery])

  // 手机端选择日期后重新刷新列表
  const onSelectDate = (date: any) => {
    const range = getLast24Hours(date, true)
    setPage(1)
    setDataSource([])
    setRange(range)
    const [timeStart, timeEnd] = formatRange(range)
    refreshList({
      timeStart,
      timeEnd,
      page: 1,
      size: PAGESIZE
    })
  }

  // PC端选择日期后重刷新列表
  const queryList = useCallback((searchQuery?: any) => {
    const searchWith = searchQuery || query
    if (searchWith) {
      const formVals = queryForm.getFieldsValue()
      const { timeStart, timeEnd } = searchWith
      if (formVals && formVals.date && timeStart && timeEnd) {
        setPage(1)
        setDataSource([])
        refreshList({
          timeStart,
          timeEnd,
          page: 1,
          size: PAGESIZE
        })
      } else {
        errorMessage('请填写时间区间')
      }
    }
  }, [query, queryForm])

  const handleQueryChange = (newQuery: any) => {
    const { timeStart, timeEnd } = newQuery || {}
    if (timeStart && timeEnd) {
      setQuery(newQuery)
    }
  }

  // PC端快速选择日期
  const handleQuickQuery = useCallback((range: any) => {
    const [timeStart, timeEnd] = formatRange(range)
    const searchQuery = { timeStart, timeEnd }
    setQuery(searchQuery)
    queryForm.setFieldsValue({
      date: range
    })
    // 暂时禁用选择后自动刷新列表的功能
    // queryList(searchQuery)
  }, [queryList])

  const handleChangePage = useCallback((page: number) => {
    setPage(page)
    setDataSource([])
    const { timeStart, timeEnd } = query
    refreshList({
      timeStart,
      timeEnd,
      page,
      size: PAGESIZE
    })
  }, [query])


  // ********************************************************* renders

  const $pcPage = useCallback(() => {
    if (isPC) {
      return <>
        <div className="container">
          <div className='segment'>
            <h2>留咨报表</h2>
            <Query
              bindForm
              loading={loading}
              onQueryChange={handleQueryChange}
              config={LeaveMessageSearchListConfig({
                total,
                page,
                form: queryForm,
                dataSource: lists?.result,
                setQuery: handleQuickQuery,
                onSearch: queryList,
                changePage: handleChangePage,
              })}
            />
          </div>
        </div>
      </>
    }
  }, [isPC, lists, activeTab, total, loading, handleChangePage])

  const $cards = useCallback(tabKey => {
    if (!activeTab || tabKey !== activeTab) {
      return null
    }
    // console.log('[INFO] rendered:', tabKey, dataSource, loadMore, noMore)
    // TODO REFACTOR components ListView
    return <div className="cards-con" ref={el => el && (cardsRef.current = el)}>
      {/* TODO refactor uid\from injection better than props */}
      {dataSource.map((item: LeaveMessageListData) => <Card item={item} uid={uid} from={from} key={item.id} />)}
      {loadMore && <div className='loading'>加载中...</div>}
      {noMore && <div className='loading'>没有更多啦~</div>}
    </div>
  }, [dataSource, activeTab, loadMore, noMore, uid, from])

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
              disabledDate={(date: moment.Moment) => date > moment().endOf('day')}
              fullscreen={false}
              defaultValue={undefined}
              dateCellRender={date => <div className="date-catcher" onClick={() => onSelectDate(date)} />}
              headerRender={({ value, onChange }) => {
                const year = value.year()
                const month = value.month()
                const prevYear = () => onChange(value.clone().year(year - 1))
                const prevMonth = () => onChange(value.clone().month(month - 1))
                const nextYear = () => onChange(value.clone().year(year + 1))
                const nextMonth = () => onChange(value.clone().month(month + 1))
                return (
                  <div className="ant-picker-header">
                    <button type="button" className="ant-picker-header-super-prev-btn" onClick={prevYear}>
                      <span className="ant-picker-super-prev-icon"></span>
                    </button>
                    <button type="button" className="ant-picker-header-prev-btn" onClick={prevMonth}>
                      <span className="ant-picker-prev-icon"></span>
                    </button>
                    <div className="ant-picker-header-view">
                      <span className="ant-picker-year-btn">
                        {year}年
                      </span>
                      <span className="ant-picker-month-btn">
                        {month + 1}月
                      </span>
                    </div>
                    <button type="button" className="ant-picker-header-next-btn" onClick={nextMonth}>
                      <span className="ant-picker-next-icon"></span>
                    </button>
                    <button type="button" className="ant-picker-header-super-next-btn" onClick={nextYear}>
                      <span className="ant-picker-super-next-icon"></span>
                    </button>
                  </div>
                )
              }}
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
  item: LeaveMessageListData,
  uid: string,
  from: string | null
}
function Card (props: CardProps) {
  const { item, uid, from } = props
  const [shouldFold, setShouldFold] = useState(false)
  const [fold, setFold] = useState(true)

  const checkEllipses = useCallback((el: HTMLElement | null) => {
    if (el) {
      if (el.offsetHeight < el.scrollHeight) {
        setShouldFold(true)
      }
    }
  }, [setShouldFold])

  const trackTel = useCallback(() => {
    if (item.id && uid && from) {
      track({
        eventType: TRACK_TYPE,
        data: {
          event_type: 'mobile-item-contact-click',
          item_id: item.id,
          uid,
          from,
        }
      })
    }
  }, [item.id])

  return <div className={"card " + (fold ? '' : 'unfold')} key={item.id}>
    <div className="header">
      <div className="left">
        <div className="title">用户刘女士留言</div>
        <div className="date">{formatTime(+item.time)}</div>
      </div>
      <div className="right">
        <div className="phone-btn">
          <PhoneFilled />
          <a href={`tel:${item.contact}`} onClick={trackTel}>{item.contact}</a>
        </div>
      </div>
    </div>
    <div className="message line-2" ref={el => checkEllipses(el)}>
      {item.message}
    </div>
    <div className="source">
      <span>来源【{LeaveMessageChannelMap[item.sourceType] || '未知'}】</span>{item.sourceName}
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
