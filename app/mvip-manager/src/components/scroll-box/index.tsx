import React, { FC, useState, useEffect, useRef } from 'react';
import styles from './index.less'
import { useDebounce } from '@/hooks/debounce';

interface Props {
  className?: string
  height?: string | number
  scrollY: boolean// 是否开启向下滚动事件
  handleScrollToLower: (...arg: any) => void
}

const ScrollBox: FC<Props> = (props) => {
  const { children, className, height, scrollY, handleScrollToLower } = props
  const ref = useRef<HTMLDivElement | null>(null)

  const handleScroll: React.UIEventHandler<HTMLDivElement> = useDebounce((e) => {
    // 未滚动到底部
    if (!ref.current) return
    if ((ref.current.scrollHeight - ref.current.clientHeight) > ref.current.scrollTop) {
      //未到底
    } else {
      //已到底部
      if (scrollY) {
        handleScrollToLower()
      }
    }
  }, 200)

  return <div className={`${className || ''} ${styles['scroll-box-container']}`} onScroll={handleScroll} ref={(dom) => ref.current = dom} style={{ height }}>
    {children}
  </div>
}

export default ScrollBox