import React, { useState, useRef, FC } from 'react'
import { Spin } from 'antd'
import MainTitle from '@/components/main-title';
import { getMailBoxListApi } from '@/api/report'
import { MailBoxListItem } from '@/interfaces/report'
import { useDebounce } from '@/hooks/debounce'
import styles from './index.less'
import { useEffect } from 'react';
import { mockData } from '@/utils';

const Mailbox: FC = () => {
  const [dataList, setDataList] = useState<MailBoxListItem[]>([])
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)


  const getMailBoxList = async () => {
    setGetDataLoading(true)
    // const res = await getMailBoxListApi({
    //   page: pageIndex,
    //   size: 10
    // })
    const res = await mockData('list', {
      id: 1,
      text: '这是信息',
      url: ''
    }, 'text', pageIndex, 10)
    setDataList([...dataList, ...res.data.result])
    setGetDataLoading(false)
  }


  const handleScroll: React.UIEventHandler<HTMLDivElement> = useDebounce((e) => {
    // 未滚动到底部
    if (!ref.current) return
    if ((ref.current.scrollHeight - ref.current.clientHeight) > ref.current.scrollTop) {
      //未到底
    } else {
      //已到底部
      getMailBoxList()
    }
  }, 200)

  useEffect(() => {
    getMailBoxList()
  }, [])

  return <>
    <MainTitle title="站内信" />
    <Spin spinning={getDataLoading}>
      <div className={`container ${styles['page-container']}`} ref={(dom) => ref.current = dom} onScroll={handleScroll}>
        <div className={styles['scroll-box']}>
          {
            dataList.map(item => <div key={item.id}>{item.text}</div>)
          }
        </div>
      </div>
    </Spin>
  </>
}

export default Mailbox