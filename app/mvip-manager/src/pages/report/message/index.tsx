import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import moment from 'moment'
import { Tabs, Form } from 'antd'
import { throttle } from 'lodash'

import Loading from '@/components/loading'
import Query from '../components/search-list'

import { useApi } from '@/hooks/api'
import { track } from '@/api/common'
import { getLeaveMessageList } from '@/api/report'
import { errorMessage } from '@/components/message'
import { LeaveMessageSearchListConfig, formatTime } from './config'
import { getCookie, formatRange, decodeHTMLCodeSafe } from '@/utils'

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
  const last3Years = useMemo(() => [
    moment(moment().format('YYYY-MM-DD')).subtract(3, 'years'),
    moment(moment().format('YYYY-MM-DD')).endOf('day')
  ], [])
  const [query, setQuery] = useState<any>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [range, setRange] = useState<any[]>(last3Years)
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
      if (isMobile && items.length) {
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
  const [activeTab, setActiveTab] = useState<string>('3years')
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
      case '3years':
        range = [
          moment(moment().format('YYYY-MM-DD')).subtract(3, 'years'),
          moment(moment().format('YYYY-MM-DD')).endOf('day')
        ]
        break
      case '1mon':
        range = [
          moment(moment().format('YYYY-MM-DD')).subtract(1, 'months'),
          moment(moment().format('YYYY-MM-DD')).endOf('day')
        ]
        break
      case '3mon':
        range = [
          moment(moment().format('YYYY-MM-DD')).subtract(3, 'months'),
          moment(moment().format('YYYY-MM-DD')).endOf('day')
        ]
        break
      case '6mon':
        range = [
          moment(moment().format('YYYY-MM-DD')).subtract(6, 'months'),
          moment(moment().format('YYYY-MM-DD')).endOf('day')
        ]
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
  const changeTabWithTrackAtPC = (e: any) => {
    const key = e.target.value
    if (key) {
      // 不同的时间范围 TAB 使用情况 UV 打点
      trackEvent({
        eventType: TRACK_TYPE,
        data: {
          event_type: 'pc-tab-uv',
          item_id: key,
          uid,
          from,
        }
      })
      changeTab(key)
    }
  }
  const changeTabWithTrackAtMobile = (key: string) => {
    // 不同的时间范围 TAB 使用情况 UV 打点
    trackEvent({
      eventType: TRACK_TYPE,
      data: {
        event_type: 'mobile-tab-uv',
        item_id: key,
        uid,
        from,
      }
    })
    changeTab(key)
  }

  useEffect(() => {
    if (range) {
      queryForm.setFieldsValue({
        date: range
      })
      const [timeStart, timeEnd] = formatRange(last3Years)
      setQuery({ timeStart, timeEnd })
    }
  }, [range, setQuery])

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
                activeTab,
                switchTab: changeTabWithTrackAtPC,
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
      {dataSource.map((item: LeaveMessageListData, idx: number) => {
        return (
          <Card
            item={item}
            uid={uid}
            from={from}
            key={(item.id || item.time) + `-${idx}`}
          />
        )
      })}
      {loadMore && <div className='loading'>加载中...</div>}
      {noMore && <div className='loading'>没有更多啦~</div>}
    </div>
  }, [dataSource, activeTab, loadMore, noMore, uid, from])

  const $mobilePage = useCallback(() => {
    if (isMobile) {
      return <Tabs centered defaultActiveKey="3years" onChange={changeTabWithTrackAtMobile}>
        <TabPane tab="默认" key="3years">
          {isFirstLoad && <Loading prevent toast />}
          {$cards('3years')}
        </TabPane>
        <TabPane tab="近一个月" key="1mon">
          {isFirstLoad && <Loading prevent toast />}
          {$cards('1mon')}
        </TabPane>
        <TabPane tab="近三个月" key="3mon">
          {$cards('3mon')}
        </TabPane>
        <TabPane tab="近半年" key="6mon">
          {isFirstLoad && <Loading prevent toast />}
          {$cards('6mon')}
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

  const trackJump = useCallback(() => {
    if (item.id && uid && from) {
      track({
        eventType: TRACK_TYPE,
        data: {
          event_type: 'mobile-item-jump-to-source',
          item_id: item.id,
          uid,
          from,
        }
      })
    }
  }, [item.id])

  const displayMessage = decodeHTMLCodeSafe(item.message)

  return <div className={"card " + (fold ? '' : 'unfold')} key={item.id}>
    <div className="header">
      <div className="left">
        <div className="title">{`用户${item.name}`}</div>
        <div className="date">{formatTime(+item.time)}</div>
      </div>
      <div className="right">
        {item.contact && (
          <div className="phone-btn">
            <a href={`tel:${item.contact}`} onClick={trackTel}>立即联系</a>
          </div>
        )}
      </div>
    </div>
    <div className="message" ref={el => checkEllipses(el)}>
      {displayMessage && (
        <span className="message-content">
          {displayMessage}
        </span>
      )}
      {item.contact && (
        <div className="phone-number">手机号码：{item.contact}</div>
      )}
    </div>
    <div className="bottom-con">
      <a href={item.sourceUrl} target="_blank" onClick={trackJump}>
        <span>来源【{LeaveMessageChannelMap[item.sourceType] || '未知'}】</span>
        {item.sourceName}
      </a>
    </div>
    {(shouldFold && fold) && (
      <span className="fold-btn" onClick={() => setFold(!fold)}>展开更多</span>
    )}
</div>
}

LeaveMessagePage.wrappers = ['@/wrappers/path-auth']

export default LeaveMessagePage
